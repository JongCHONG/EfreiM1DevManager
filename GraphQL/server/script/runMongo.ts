import { MongoMemoryServer } from "mongodb-memory-server";
import { MongoClient } from "mongodb";

let dbUri = "";
let dbClient: MongoClient;

// Définition de la fonction pour démarrer le serveur MongoDB
export async function startMongoDBServer() {
  const mongod = new MongoMemoryServer({
    instance: {
      dbPath: "./db",
      storageEngine: "wiredTiger",
      port: 27017,
    },
  });

  await mongod.start();

  const mongoUri = mongod.getUri();
  dbUri = mongoUri;
  console.log(`MongoDB server started at ${mongoUri}`);
}

export async function connectToMongoDB() {
  const uri = dbUri; // URI de votre base de données MongoDB
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log("Connected to MongoDB");
    dbClient = client;

    return dbClient;
    // return client.db('yourDatabaseName'); // Remplacez 'yourDatabaseName' par le nom de votre base de données
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    throw error;
  }
}