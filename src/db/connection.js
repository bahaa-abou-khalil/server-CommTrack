import { connect } from "mongoose";

const connectToDatabase = async () => {
  try {
    await connect("mongodb://127.0.0.1:27017/comm-track");

    console.log("Connected to database");
  } catch (error) {
    console.log(`error connecting to database: ${error}`);
  }
};

export default connectToDatabase;
