import express from "express";
import upload from "../middleware/multer.js";

import {
  collectionsController,
  collectionSpecificController,
} from "../controller/collections.controller.js";

const router = express.Router();

router
  .route("/")
  .get(upload.single("fotoKoleksi"), collectionsController.getCollections)
  .post(upload.single("fotoKoleksi"), collectionsController.postCollection); // post a collection data

router
  .route("/post")
  .get(upload.single("fotoKoleksi"), collectionsController.postCollection);

router
  .route("/:collectionId")
  .get(collectionSpecificController.getSpecificCollection)
  .patch(
    upload.single("fotoKoleksi"),
    collectionSpecificController.updateSpecificCollection
  ) // protected
  .delete(collectionSpecificController.deleteSpecificCollection); // protected

export default router;
