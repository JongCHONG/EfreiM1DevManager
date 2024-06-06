import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { ObjectId } from "mongodb";
import { startMongoDBServer, connectToMongoDB } from "../../script/runMongo.ts";
import { typeDefs } from "../../graphql/src/schema.ts";
import { Resolvers } from "../../graphql/src/resolvers.ts";

//On modifie schema.gql ensuite, npm run generate avant run serve

// Appel de la fonction pour démarrer le serveur MongoDB au démarrage de l'application
await startMongoDBServer();
const dbClient = await connectToMongoDB();

const SECRET = 'your_secret_key'; // Change this to a secure secret key

const db = {
  books: dbClient
    .db("main")
    .collection<{ id: string; title: string; author: string }>("books"),
  users: dbClient.db("main").collection("users"),
};

const resolvers: Resolvers = {
  Query: {
    books: async () => {
      const data = await db.books.find({}).toArray();
      const books = data.map(({ _id, ...rest }) => {
        return { ...rest, id: _id.toString() };
      });

      return books;
    },
    bookById: async (_: any, { id }) => {
      const book = await db.books.findOne({ _id: new ObjectId(id) });
      if (!book) {
        console.log("Book not found");
      }
      return { id, title: book?.title, author: book?.author };
    },
  },
  Mutation: {
    addBook: async (_, { title, author }) => {
      const result = await dbClient
        .db("main")
        .collection("books")
        .insertOne({ title, author });
      return { id: result.insertedId.toString(), title, author };
    },
    modifyBook: async (_, { id, title, author }) => {
      await dbClient
        .db("main")
        .collection("books")
        .updateOne({ _id: new ObjectId(id) }, { $set: { title, author } });
      return { id, title, author };
    },
    deleteBook: async (_, { id }) => {
      const bookToDelete = await dbClient
        .db("main")
        .collection("books")
        .findOne({ _id: new ObjectId(id) });
      if (!bookToDelete) {
        throw new Error("Book not found");
      }
      await db.books.deleteOne({ _id: new ObjectId(id) });
      return { id, title: bookToDelete.title, author: bookToDelete.author };
    },
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

const { url } = await startStandaloneServer(server, {
  listen: { port: 4000 },
});

console.log(`🚀  Server ready at: ${url}`);
