import {MongoClient} from 'mongodb';
import dotenv from 'dotenv';

dotenv.config(); 

const uri = process.env.MONGODB_URI || 'mongodb://mevn-sports-scheduler.onrender.com:27017'; 
const dbName = 'BVG Athletics';

let db;

export const connectDB = async () => {
    if (db)
        return db;
    try {
        const client = await MongoClient.connect(uri);
        console.log("Connected to MongoDB");
        db = client.db(dbName);
        return db;
    }catch (error) {
        console.error("Failed to connect to MongoDB", error);
        throw error;
    }
};