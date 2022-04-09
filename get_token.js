const fs = require('fs');
const { MongoClient, ServerApiVersion } = require('mongodb');
const result = require('dotenv').config();
const uri = process.env.MONGO_URI;
const client = new MongoClient(uri,
    {   useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      
// START OF MONGODB UPLOADING CODE
async function main() {
    try {
        // Connect to the MongoDB cluster
        await client.connect();

        // Make the appropriate DB calls

        // Find the listing named "Infinite Views" that we created in create.js
        await findOneListingByName(client, "dmpklzz");

    } finally {
        // Close the connection to the MongoDB cluster
        await client.close();
    }
}
async function findOneListingByName(client, nameOfListing) {
    // See https://mongodb.github.io/node-mongodb-native/3.6/api/Collection.html#findOne for the findOne() docs
    const results = await client.db("mydb").collection("tokens").findOne({ instance: nameOfListing });

    if (results) {
        console.log(`Found a listing in the collection with the name '${nameOfListing}':`);
        console.log(results);

        let data = JSON.stringify(results, null, 4);
        fs.writeFileSync('./tokens.json', data);
    } else {
        console.log(`No listings found with the name '${nameOfListing}'`);
    }
}

main().catch(console.error);
// ENDO OF MONGODB UPLOADING CODE