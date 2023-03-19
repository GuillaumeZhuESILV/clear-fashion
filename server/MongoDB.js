const products=require('./TotalProduct.json');

async function connectToDatabase() {
    try {
      const {MongoClient} = require('mongodb');
      const MONGODB_URI = "mongodb+srv://guillaumezhu6:WoS82Qy78hOFIeF1@cluster0.e8sr63z.mongodb.net/test";
    
      const MONGODB_DB_NAME = 'clearfashion';
      const client = await MongoClient.connect(MONGODB_URI, {'useNewUrlParser': true});
      const db = client.db(MONGODB_DB_NAME);
      console.log("Connected to the database")
      const collection = db.collection('products');
      collection.drop();
      const result = await collection.insertMany(products);
      //console.log(result);

      //Search all the products from Montlimart
      const brand = 'Montlimart';
      console.log("search for Montlimart");
      const searchresult = await collection.find({brand}).toArray();
      //console.log(searchresult);

      //Search all the products less than a price
      price=50
      const results = await collection.find({ brand: 'Montlimart', price: { $lt: 50 } }).toArray();
      //console.log(results);
      
      //Ascending
      const sorted_result_asc= await collection.find().sort({price:1}).toArray();
      //Descending
      const sorted_result_desc= await collection.find().sort({price:-1}).toArray();

      //console.log(sorted_result_asc);

      //Find all products sorted by date
      const sorted_date_result= await collection.find().sort({date: 1}).toArray();
      console.table(sorted_date_result);


      //Find all products scraped less than 2 weeks
      const less_2weeks_products=db.products.find({date: {$lt: new Date(Date.now() - (14 * 24 * 60 * 60 * 1000))}});
      //console.log(less_2weeks_products);

      client.close();
     
    } catch (error) {
      console.error('Failed to connect to the database:', error);
    }
  }

  connectToDatabase();