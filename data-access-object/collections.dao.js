import mongoose from "mongoose";
import Logging from "../Logging/logging.js";
import Collections from "../model/collections.model.js"
import fs from 'fs'

export default class CollectionsDAO {
  static async getCollections() {
    const collectionsResult = await Collections
      .find()
      .exec()
      .then(docs => {
        const response = {
          collections: docs.map(doc => {
            return doc
          })
        }

        return response
      })
      .catch(error => {
        Logging.error(`
          error: ${error},
          file: getCollections - DAO
        `)
      })
    
    return collectionsResult;
  }

  static async postCollections(data, host) {
    
    Logging.info(`[host]: ${ host }`)

    try {
      const collections = new Collections({
        _id: new mongoose.Types.ObjectId,
        ...data
      })

      Logging.info(`[Collections Data]: ${collections}`)

      // check if data is already exist, deny the request

      const addCollectionsResult = collections
        .save()
        .then(data => {
          Logging.info("Post data successfully")

          // return name and link to the detail 
          const response = {
            status: "Data Successfully Added",
            dataDetail: {
              type: "GET",
              url: host + "/collections/" + data._id
            }
          }
          return response
        })
        .catch(error => {
          Logging.error(`error to add data [db]: ${ error }`)
        })    
      
      return addCollectionsResult

    } catch (error) {
      Logging.error(`error to add data [function]: ${ error }`) 
    } 
  }

  static async getCollectionDetail(collectionId){
    const collectionsDetailResult = await Collections
        .findById(collectionId)
        .exec()
        .then(data => {
          const response = data
          return response
        })
        .catch(error => {
          Logging.error(error)
        })
    
    return collectionsDetailResult;
  }

  /**
   * 
   * @param {*} collectionId 
   * @param {*} body 
   * @param {*} host 
   * @returns 
   */
  static async updateCollection(collectionId, body, host){

    const updateResult = await Collections.updateOne(
      { _id: collectionId },
      { $set: body }
    )
    .exec()
    .then(result => {
      if (result.acknowledged){
        Logging.info(`[db] Update Success`)
      }
      const response = {
        acknowledge: result.acknowledged,
        eventDetail: {
          type: "GET",
          url: host + '/collections/'+ collectionId
        }
      }
      return response
    })
    .catch(error => {
      Logging.error(error)
    })

    return updateResult

  }

  static async deleteCollection(collectionId){
    const errorNoData = new Error("There is no data with data specific")
    try {
      const deleteCollection = await Collections.deleteOne({ _id: collectionId}) 
              .exec()
              .then(data => {
                return data.deletedCount
              })
              .catch(error => {
                return error
              })
      return deleteCollection
    } catch (error) {
      Logging.error(error)
    }
  }

}