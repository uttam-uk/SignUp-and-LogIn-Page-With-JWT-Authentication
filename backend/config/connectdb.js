import mongoose from "mongoose";
const connectDb = async (DATABASE_URL) => {
    try {
        const DB_OPTION = {
            dbName: "skygoal"
        };
        await mongoose.connect(DATABASE_URL, DB_OPTION);
        console.log('Connected to MongoDB successfully....');
    } catch (error) {
        console.log('Connection to MongoDB failed:', error);
    }
};

export default connectDb;
