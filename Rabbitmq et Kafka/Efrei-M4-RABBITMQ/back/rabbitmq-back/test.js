import express from "express";
import { connect } from "amqplib";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

const exchange = "my_exchange";

let messages = [];

connect("amqp://localhost")
  .then((connection) => {
    return connection.createChannel();
  })
  .then((channel) => {
    channel.assertExchange(exchange, "fanout");

    app.post("/send", (req, res) => {
      const message = {
        ...req.body,
        createdAt: new Date().toISOString()
      };
      channel.publish(exchange, "", Buffer.from(JSON.stringify(message)));
      res.status(200).send("Message sent to RabbitMQ");
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
  });


app.listen(5000, () => {
  console.log("Server is running on port 5000");
});
