// imports
import express from "express";
import mongoose from "mongoose";
import Messages from "./dbMessages.js";
import Pusher from "pusher";
import cors from "cors";

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
app.use(cors());

// DB config
const connection_url = `mongodb://admin:SP412250@cluster0-shard-00-00.rnrvo.mongodb.net:27017,cluster0-shard-00-01.rnrvo.mongodb.net:27017,cluster0-shard-00-02.rnrvo.mongodb.net:27017/messageapp?ssl=true&replicaSet=atlas-9as9if-shard-0&authSource=admin&retryWrites=true&w=majority`;

mongoose.connect(connection_url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// ???

const db = mongoose.connection;

db.once("open", () => {
  console.log("DB connected ");

  const msgCollection = db.collection("messagecontents");
  const changeStream = msgCollection.watch();

  changeStream.on("change", (change) => {
    console.log(change);

    if (change.operationType === "insert") {
      const messageDetails = change.fullDocument;
      pusher.trigger("messages", "inserted", {
        name: messageDetails.name,
        message: messageDetails.message,
        timestamp: messageDetails.timestamp,
        received: messageDetails.received,
      });
    } else {
      console.log("Error triggering Pusher");
    }
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
