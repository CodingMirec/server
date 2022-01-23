// imports
import express from "express";
import mongoose from "mongoose";
import Messages from "./dbMessages.js";

// app config
const app = express();
const port = process.env.PORT || 9000;

// middleware
app.use(express.json());

// DB config
const connection_url = `mongodb+srv://admin:Sp412250@cluster0.rnrvo.mongodb.net/messagepp?retryWrites=true&w=majority`;

mongoose.connect(connection_url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// ???

// api routes
app.get("/", (req, res, next) => res.status(200).send("hello world"));

app.get("/messages/sync", (req, res, next) => {
  Messages.find((err, data) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(200).send(data);
    }
  });
});

app.post("/messages/new", (req, res) => {
  const dbMessage = req.body;

  Messages.create(dbMessage, (err, data) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(201).send(data);
    }
  });
});

// listen
app.listen(port, () => console.log(`Listening to localhost:${port}`));
