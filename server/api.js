const cors = require('cors');
const express = require('express');
const helmet = require('helmet');

const PORT = 8092;
const MongoClient = require("mongodb").MongoClient;
const ObjectId = require("mongodb").ObjectID;
const CONNECTION_URL="mongodb+srv://guillaumezhu6:WoS82Qy78hOFIeF1@cluster0.e8sr63z.mongodb.net/test";
const DATABASE_NAME = 'clearfashion';
const app = express();

module.exports = app;

app.use(require('body-parser').json());
app.use(cors());
app.use(helmet());

app.options('*', cors());

app.get('/', (request, response) => {
  response.send({'ack': true});
});




app.get("/products", (request, response) => {
  collection.find({}).toArray((error, result) => {
      if(error) {
          return response.status(500).send(error);
      }
      response.send(result);
  });
});

//test
/*http://localhost:8092/products/search?limit=10&brand=Dedicated&price=7 */

app.get("/products/search", (req, res) => {
  const limit = parseInt(req.query.limit) || 12;
  const brand = req.query.brand || "";
  const price = parseInt(req.query.price) || 0;

  const query = {};

  if (brand !== "") {
    query.brand = brand;
  }

  if (price !== 0) {
    query.price = { $lte: price };
  }

  collection
    .find(query)
    .limit(limit)
    .sort({ price: 1 })
    .toArray((err, result) => {
      if (err) {
        return res.status(500).send(err);
      }
      const total = result.length;
      res.send({ limit, total, results: result });
    });
});

app.get("/products/:id", (request, response) => {
  collection.findOne({ "_id": new ObjectId(request.params.id) }, (error, result) => {
      if(error) {
          return response.status(500).send(error);
      }
      response.send(result);
  });
});






app.listen(PORT, () => {
  MongoClient.connect(CONNECTION_URL, { useNewUrlParser: true }, (error, client) => {
      if(error) {
          throw error;
      }
      database = client.db(DATABASE_NAME);
      collection = database.collection("products");
      console.log("Connected to `" + DATABASE_NAME + "`!");
  })});


console.log(`📡 Running on port ${PORT}`);
