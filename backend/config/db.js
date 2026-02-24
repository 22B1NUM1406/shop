const mongoose = require("mongoose");

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(
            process.env.MONGODB_URI || "mongodb://localhost:27017/nomad-shop",
            {
                useNewUrlParser: true,
                useUnifiedTopology: true,
            }
        );
        console.log(`✅ MongoDB холбогдлоо: ${conn.connection.host}`);
    } catch (err) {
        console.error(`❌ MongoDB алдаа: ${err.message}`);
        process.exit(1);
    }
};

module.exports = connectDB;