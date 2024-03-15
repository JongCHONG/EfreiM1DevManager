import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { MongoMemoryServer } from "mongodb-memory-server";
import { MongoClient } from "mongodb";

let dbUri = "";
let dbClient: MongoClient = null;

// Définition de la fonction pour démarrer le serveur MongoDB
async function startMongoDBServer() {
  const mongod = new MongoMemoryServer({
    instance: {
      dbPath: "./db",
      storageEngine: "wiredTiger",
    },
  });

  await mongod.start();

  const mongoUri = mongod.getUri();
  dbUri = mongoUri;
  console.log(`MongoDB server started at ${mongoUri}`);
}

async function connectToMongoDB() {
  const uri = dbUri; // URI de votre base de données MongoDB
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log("Connected to MongoDB");
    dbClient = client;

    // return client.db('yourDatabaseName'); // Remplacez 'yourDatabaseName' par le nom de votre base de données
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    throw error;
  }
}

// Appel de la fonction pour démarrer le serveur MongoDB au démarrage de l'application
startMongoDBServer()
  .then(() => {
    connectToMongoDB();
  })
  .catch((error) => {
    console.error("Failed to connect MongoDB server:", error);
  });

// A schema is a collection of type definitions (hence "typeDefs")
// that together define the "shape" of queries that are executed against
// your data.
const typeDefs = `#graphql
  # Comments in GraphQL strings (such as this one) start with the hash (#) symbol.

  # This "Book" type defines the queryable fields for every book in our data source.
  type Book {
    title: String
    author: String
  }

  # The "Query" type is special: it lists all of the available queries that
  # clients can execute, along with the return type for each. In this
  # case, the "books" query returns an array of zero or more Books (defined above).
  type Query {
    books: [Book]
  }

  type Mutation {
    addBook(title: String!, author: String!): Book!
  }
`;

const books = [
  {
    title: "The Awakening",
    author: "Kate Chopin",
  },
  {
    title: "City of Glass",
    author: "Paul Auster",
  },
];

// Resolvers define how to fetch the types defined in your schema.
// This resolver retrieves books from the "books" array above.
// const resolvers = {
//   Query: {
//     books: () => books,
//   },
// };
const resolvers = {
  Query: {
    books: async () => {
      const books = await dbClient
        .db("main")
        .collection("books")
        .find({})
        .toArray();
      return books;
    },
  },
  Mutation: {
    addBook: async (_, { title, author }) => {
      const result = await dbClient
        .db("main")
        .collection("books")
        .insertOne({ title, author });
      return { id: result.insertedId, title, author };
    },
  },
};

// The ApolloServer constructor requires two parameters: your schema
// definition and your set of resolvers.
const server = new ApolloServer({
  typeDefs,
  resolvers,
});

// Passing an ApolloServer instance to the `startStandaloneServer` function:
//  1. creates an Express app
//  2. installs your ApolloServer instance as middleware
//  3. prepares your app to handle incoming requests
const { url } = await startStandaloneServer(server, {
  listen: { port: 4000 },
});

console.log(`🚀  Server ready at: ${url}`);
