import express from "express";
import { connect } from "amqplib";
import cors from "cors";
import amqp from "amqplib";
import { createRequire } from "module";
import { createServer } from "http";
import { v4 as uuidv4 } from "uuid";

const require = createRequire(import.meta.url);
const WebSocket = require("ws");
const http = require("http");

const app = express();
app.use(express.json());
app.use(cors());

const exchange = "my_exchange";
let channel, connection;

amqp
  .connect("amqp://localhost")
  .then((conn) => {
    connection = conn;
    return conn.createChannel();
  })
  .then((ch) => {
    channel = ch;
    channel.assertExchange(exchange, "fanout");
  });

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const users = new Map();

function broadcastUserList() {
  const userList = Array.from(users.values()).map(user => user.username);
  users.forEach((user) => {
    user.ws.send(JSON.stringify({ type: 'userList', users: userList }));
  });
}

wss.on('connection', (ws) => {
  let userId;
  ws.on('message', (message) => {
    try {
      const messageAsString = message.toString();
      const data = JSON.parse(messageAsString);
      if (data.username) {
        userId = uuidv4();
        users.set(userId, { username: data.username, ws: ws });
        console.log(`Utilisateur ${data.username} (${userId}) connecté`);
        broadcastUserList(); 
        console.log(`Message reçu de l'utilisateur ${data.username}:`, messageAsString);
      }
    } catch (error) {
      console.error("Erreur lors du parsing du message:", error);
    }
  });

  ws.on('close', () => {
    if (userId) {
      users.delete(userId);
      console.log(`Utilisateur ${userId} déconnecté`);
      broadcastUserList(); 
    }
  });

  ws.on('error', (error) => {
    console.error(`Erreur WebSocket pour l'utilisateur ${userId}:`, error);
  });
});

server.listen(8080, () => {
  console.log("WebSocket is running on port 8080");
});

app.post("/send", (req, res) => {
  const message = {
    ...req.body,
    createdAt: new Date().toISOString(),
  };
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(
        JSON.stringify({
           ...message,
           username: req.body.username,
        })
      );
    }
  });
  res.status(200).send("Message sent to WebSocket server");
});

app.post("/create-queue", (req, res) => {
  const queueName = req.body.queue + "_queue";
  channel.assertQueue(queueName).then(({ queue }) => {
    channel.bindQueue(queue, exchange, "").then(() => {
      res.status(200).send(`Queue ${queueName} created successfully`);
    });
  });
});

app.get("/messages/:username", (req, res) => {
  const queueName = req.params.username + "_queue";
  let messages = [];
  channel.assertQueue(queueName).then(({ queue }) => {
    channel.consume(queue, (msg) => {
      if (msg !== null) {
        messages.push(JSON.parse(msg.content.toString()));
        channel.ack(msg);
      }
    });
    res.status(200).send(messages);
  });
});

app.listen(5000, () => {
  console.log("Server is running on port 5000");
});
