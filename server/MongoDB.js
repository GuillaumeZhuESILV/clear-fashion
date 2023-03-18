const products=require('./TotalProduct.json');

async function connectToDatabase() {
    try {
      const {MongoClient} = require('mongodb');
      const MONGODB_URI = "mongodb+srv://guillaumezhu:PymLFUB5NG8xEj40@cluster0.kre4qeq.mongodb.net/test";
      console.log("Connected to the database")
      const MONGODB_DB_NAME = 'clearfashion';
      const client = await MongoClient.connect(MONGODB_URI, {'useNewUrlParser': true});
      const db = client.db(MONGODB_DB_NAME);
      const collection = db.collection('products');
      collection.drop();
      const result = await collection.insertMany(products);
      
      //console.log(result);

      //Search all the products from Montlimart
      const brand = 'Montlimart';
      //console.log("search for Montlimart");
      const searchresult = await collection.find({brand}).toArray();
      //console.log(searchresult);

      //Search all the products less than a price
      price=50
      const results = await collection.find({ brand: 'Montlimart', price: { $lt: 50 } }).toArray();
      //console.log(results);
      
      //Ascending
      const sorted_result= await collection.find().sort({price:1}).toArray();
      //Descending const sorted_result= await collection.find().sort({price:-1}).toArray();
      console.log(sorted_result);
      //Find all products sorted by date
      //Find all products scraped less than 2 weeks

      client.close();
     
    } catch (error) {
      console.error('Failed to connect to the database:', error);
    }
  }

  connectToDatabase();