const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {

    try {
        const mongoLink = process.env.MONGO_URI || 'mongodb+srv://hiteshy468:sCt9qUbAIyyw03iF@sampoornserver.vgw9siu.mongodb.net/?retryWrites=true&w=majority&appName=sampoornServer';
        const conn = await mongoose.connect(mongoLink);
        console.log(`MongoDB Connected`);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

module.exports = connectDB;