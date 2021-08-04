import mongoose from 'mongoose';
import dotenv from 'dotenv'

dotenv.config()
mongoose.connect(`mongodb://${process.env.DB_USER ? `${process.env.DB_USER }:${process.env.DB_PASSWORD}` : null}@localhost:27017/${process.env.DB_NAME}?authSource=admin`);
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    console.log(`Mongo connected 🍃\n`)
});

export default mongoose;