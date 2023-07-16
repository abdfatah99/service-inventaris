import dotenv from "dotenv";

dotenv.config();

// const MONGO_URL = "mongodb://0.0.0.0:8081/museum-collection";
const MONGO_URL =
  "mongodb+srv://fatah:M0n90d847l45@cluster0.9yxz1.mongodb.net/service-inventaris?retryWrites=true&w=majority";
const SERVER_PORT = process.env.SERVER_PORT
  ? Number(process.env.SERVER_PORT)
  : 3032;

const config = {
  mongo: {
    url: MONGO_URL,
  },
  server: {
    port: SERVER_PORT,
  },
};

export default config;
