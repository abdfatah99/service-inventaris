import express from "express";
import mongoose from "mongoose";
import collectionRoute from "./api-route/collection.route.js";
import Logging from "./Logging/logging.js";
import config from "./config/config.js";

// create express app
const app = express();

// [multer.js] - use multer to handle form-data

// handling json -> Content-Type: application/json
app.use(express.json());

// enable public directory to access via http
app.use(
  "/public/collection-image",
  express.static("./public/collection-image")
);

/**
 * strictQuery
 * By default, Mongoose use strictQuery, which mean the returned document only
 * the exact match the specified query condition. If a document has additional
 * fields that are not part of the query, those fields will not be included in
 * the result.
 *
 * // disable query strict mode
 * -> mongoose.set("strictQuery", false)
 *
 * false: allow querying database with conditions that match a subset of the
 * fields in the documents. It means if a document has additional fields beyond
 * the specified query will also be included in the result
 */
mongoose.set("strictQuery", false);

mongoose
  .connect(config.mongo.url)
  .then(() => {
    Logging.info("Database Connected");
  })
  .catch((error) => {
    Logging.error("Connection Error");
    Logging.error(error);
  });

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
    return res.status(200).json({});
  }
  next();
});

// define the route for serving a request
app.use("/collections", collectionRoute);

// route error handling
app.use((req, res, next) => {
  const error = new Error("URL Not Found");
  error.status = 404;

  // pass the error to next function
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message,
    },
  });
});

export default app;
