import mongoose from "mongoose";

const connectDatabase = () => {
    mongoose.connect(process.env.MONGO_URI)
        .then(() => {
            console.log("Successfully connected to database")
        })
        .catch((error) => {
            console.log(`Failed to connect to database: ${error}`);
        });
}

export default connectDatabase;