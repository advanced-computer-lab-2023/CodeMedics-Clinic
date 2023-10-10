const mongoose = require('mongoose');

async function connectDB() {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
        console.log(`MongoDB Connection: ${conn.connection.host}`.bgGreen.bold);
    } catch (err) {
        console.log(err);
        process.exit(1);
    }
}

module.exports = connectDB;