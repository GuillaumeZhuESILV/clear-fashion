/* eslint-disable no-console, no-process-exit */


//Import required modules
const dedicatedbrand = require('./eshops/dedicatedbrand');
const Montlimartbrand= require('./eshops/Montlimartbrand');
const circlesportswearbrand=require('./eshops/circlesportswearbrand')
const fs =require('fs');


//Define URLs for Montlimart and Circle Sportswear
const url_montlimart=["https://www.montlimart.com/99-vetements",
                      "https://www.montlimart.com/14-chaussures",
                      "https://www.montlimart.com/15-accessoires"];

const url_circlesportswear=["https://shop.circlesportswear.com/collections/collection-femme",
                            "https://shop.circlesportswear.com/collections/collection-homme"];


// Define an empty array for storing the all products                        
let final=[]

//Define a sandbox function to scrape all products
async function sandbox (eshop = 'https://www.dedicatedbrand.com/en/') {
  try {

    console.log(`🕵️‍♀️  browsing ${eshop} eshop`);

   //Scrape products for Circle Sportswear
    for(url in url_circlesportswear){
      const products = await circlesportswearbrand.scrape(url_circlesportswear[url]) ;
      final=final.concat(products);
    }

    //Scrape products for Circle Sportswear
    const number_product_circle=final.length;
    
    //Get number of products scraped from Montlimart
    for(url in url_montlimart){
      const products = await Montlimartbrand.scrape(url_montlimart[url]);
      final=final.concat(products)
    }

    //Get number of products scraped from Montlimart
    const number_product_montlimart=final.length-number_product_circle;

    //Scrape products for Dedicated Brand
    const products = await dedicatedbrand.scrape(eshop);
    final=final.concat(products)
   
    //Log the final array of products
    console.log(final);
    console.log("Number of products on circle sportswear :",number_product_circle);
    console.log("Number of products on montlimart :",number_product_montlimart);
    console.log("Number of products on dedicated :",final.length-number_product_montlimart)
    console.log("Total number of products =",final.length);

    // Write the final result to a JSON file
    fs.writeFileSync('TotalProduct.json', JSON.stringify(final, null, 2));

    //console.log('done');
    process.exit(0);
    
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}

const [,, eshop] = process.argv;

sandbox(eshop);
