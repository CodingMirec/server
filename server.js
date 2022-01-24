// imports
import express from "express";
import mongoose from "mongoose";
import Messages from "./dbMessages.js";
import Pusher from "pusher";

// app config
const app = express();
const port = process.env.PORT || 9000;

const pusher = new Pusher({
  appId: "1337115",
  key: "bbb2d0c317e8c8284d53",
  secret: "ec6f7470e6bb1106c695",
  cluster: "eu",
  useTLS: true,
});

// middleware
app.use(express.json());

// DB config
const connection_url = `mongodb+srv://admin:Sp412250@cluster0.rnrvo.mongodb.net/messagepp?retryWrites=true&w=majority`;

mongoose.connect(connection_url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// ???

const db = mongoose.connection;

db.once("open", () => {
  console.log("DB connected ");

  const msgCollection = db.collection("messagecontent");
  const changeStream = msgCollection.watch();

  changeStream.on("change", (change) => {
    console.log(change);
  });
});

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
