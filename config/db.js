const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI, {
            serverSelectionTimeoutMS: 5000
        });
        console.log(`🚀 MongoDB Connected: ${conn.connection.host}`);
        process.env.DB_CONNECTED = 'true';
    } catch (error) {
        console.error(`⚠️ Database Connection Failed: ${error.message}`);
        console.warn('⚡ ENTERING RESILIENT MODE: Using In-Memory Storage for this session.');
        process.env.DB_CONNECTED = 'false';
    }
};

module.exports = connectDB;
