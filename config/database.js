import mongoose from 'mongoose';

const connectDB = async() => {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log(`MongoDB Connected Sucessfully: ${mongoose.connection.host}`)
    } catch (error) {
        console.log(`MongoDb Connection Error: ${error}`)
    }
}

export default connectDB;