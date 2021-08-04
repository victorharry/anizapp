import mongoose from 'mongoose';
import dotenv from 'dotenv'

dotenv.config()
mongoose.connect(`mongodb://localhost/${process.env.DB_NAME}`, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    console.log(`Mongo connected 🍃\n`)
});

export default mongoose;