const express = require('express');
const router = express.Router();
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

const url = "mongodb://localhost:27017/";
const mongoClient = new MongoClient(url, { useUnifiedTopology: true });

router.post('/getStorage', (req, res) => {
  const { body : { category } } = req;
  let cursor;

  mongoClient.connect((err, client) => {
    assert.equal(null, err);
    const db = client.db("storage");
    const collection = db.collection("lists");

    if(err) return console.log(err);

    collection.find({"category": category}).toArray((err, result) => {
      cursor = JSON.stringify(result);
      res.json(cursor);

      client.close();
    });
  });
});

router.post('/addStorage', (req, res)=> {
  const { body : { data } } = req;

  mongoClient.connect((err, client) => {
    assert.equal(null, err);
    const db = client.db("storage");
    const collection = db.collection("lists");

    collection.updateOne({"name": data.name}, {$setOnInsert: data},{ upsert: true }, (err, result) => {
      if(err) {
        return console.log(err);
      }

      res.json({"status": "success"});

      console.log(result.ops);
      client.close();
    });
  });
});

router.post('/delStorage', (req, res)=> {
  const data = req.body;

  mongoClient.connect((err, client) => {
    assert.equal(null, err);
    const db = client.db("storage");
    const collection = db.collection("lists");

    collection.deleteOne(data)
        .then((err, result) => {
          if(err) {
            return console.log(err);
          }

          res.json({"status": "success"});
          console.log(result.ops);

          client.close();
        });

  });
});

module.exports = router;
