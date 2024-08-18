const mongoose = require("mongoose");
require("dotenv").config(); 

const connectMongoDb = async () => {
    try {
        const uri = process.env.MONGO_URI;
        console.log(`Connecting to MongoDB at ${uri}`);
        await mongoose.connect(uri);
        console.log('Connected to MongoDB');
    } catch (err) {
        console.error('Error connecting to MongoDB:', err);
    }
}

module.exports = { connectMongoDb };
