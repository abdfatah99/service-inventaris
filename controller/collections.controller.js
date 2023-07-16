//import collectionDAO from '../data-access-object/collections.dao.js'

import CollectionsDAO from "../data-access-object/collections.dao.js";
import Logging from "../Logging/logging.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

class collectionsController {
  static async getCollections(req, res, next) {
    Logging.info(
      `Incoming -> Method: [${req.method}] - URL: [${req.url}] - IP: [${req.socket.remoteAddress}]] - Info: Request All collection data`
    );

    console.log(req.body.test);
    if (req.file.path) {
      console.log(`file accepted: ${req.file.path}`);
    }

    // receive the request and pass to the dao
    try {
      const getCollections = await CollectionsDAO.getCollections();

      res.status(200).send(getCollections);
    } catch (error) {
      Logging.error(error);
      res.status(500).json({
        message: error,
      });
    }
  }

  static async postCollection(req, res, next) {
    Logging.info(
      `Incoming -> Method: [${req.method}] - URL: [${req.url}] - IP: [${req.socket.remoteAddress}]] - Info: Post Data Collection`
    );

    console.log(req.body.kondisi);

    console.log(req.file.path);

    const host = req.headers.host;

    const fotoUrlFunc = (reqFile, host) => {
      /**
       * host: http:ip
       * reqFile: public\\collection-image\\Mon Jan 02 2023 13-25-23 GMT+0700 (Western Indonesia Time)kain batik buah asem.png
       *
       * @return http:ip/image/identifier
       */
      return host + "/" + reqFile.replaceAll("\\", "/");
    };

    const imageName = (reqFile) => {
      /**
       * File - Image
       * MongoDB will only save the path to the file, not save the image into the db
       * to make it happen, we have to define the path to the image to make it available
       * to public
       * 
       * original path name: public\\collection-image\\Mon Jan 02 2023 13-25-23 GMT+0700 (Western Indonesia Time)kain batik buah asem.png
       * desired path name: public/collection-image/Mon Jan 02 2023 13-25-23 GMT+0700 (Western Indonesia Time)kain batik buah asem.png
       * 
       * split the path to get only the name: 
       *  -> .split('/')
       * result: [  'public',
                    'collection-image',  
                    'Mon Jan 02 2023 13-25-23 GMT+0700 (Western Indonesia Time)kain batik buah asem.png']
       * 
       * get only the name:
       *  -> result[2]
       */
      return reqFile.replaceAll("\\", "/").split("/")[2];
    };

    // post status
    let data = {
      nomorRegistrasi: req.body.nomorRegistrasi,
      nomorInventaris: req.body.nomorInventaris,
      jenisKoleksi: req.body.jenisKoleksi,
      namaKoleksi: req.body.namaKoleksi,
      pembuatan: {
        asalPembuatan: req.body.asalPembuatan,
        tanggalPembuatan: req.body.tanggalPembuatan,
      },
      perolehan: {
        asalPerolehan: req.body.asalPerolehan,
        tanggalPerolehan: req.body.tanggalPerolehan,
      },
      caraPerolehan: req.body.caraPerolehan,
      ukuran: {
        panjang: req.body.panjang,
        lebar: req.body.lebar,
        tinggi: req.body.tinggi,
        diameter: req.body.diameter,
        tebal: req.body.tebal,
      },
      bahan: req.body.bahan,
      warna: req.body.warna,
      kondisi: req.body.kondisi,
      uraianSingkat: req.body.uraianSingkat,
      tempatPenyimpanan: req.body.tempatPenyimpanan,
      fotoName: imageName(req.file.path),
      fotoUrl: fotoUrlFunc(req.file.path, host),
      dateInput: req.body.tanggalInput,
    };

    // console.log(data) check

    const serverHostAddress = (host) => {
      /**
       * @param {request} -> req.headers.host
       *
       * after success fully save the data into database, i want to show the
       * link to the detail of the data
       *
       * for example
       * {
       *    "status": "successfully saved to database",
       *    "dataDetail" : {
       *      "type": "GET",
       *      "url": "http://localhost:3001/collection/" + collection.id
       *    }
       * }
       *
       * later, we want to apply this program to another computer or server,
       * so we have to get the address of this host.
       * we can achieve this by accessing the req.headers.host
       */

      return host;
    };

    // add data to database
    try {
      const addCollection = await CollectionsDAO.postCollections(
        data,
        serverHostAddress(req.headers.host)
      );
      res.status(200).send(addCollection);
      // res.status(200).json({ msg: "data "})
    } catch (error) {
      Logging.error(error);
    }
  }
}

class collectionSpecificController {
  static async getSpecificCollection(req, res, next) {
    Logging.info(
      `Incoming -> Method: [${req.method}] - URL: [${req.url}] - IP: [${req.socket.remoteAddress}]] - Info: GET Specific Data Collection`
    );

    const findCollection = await CollectionsDAO.getCollectionDetail(
      req.params.collectionId
    );

    if (findCollection) {
      res.status(200).send(findCollection);
    } else {
      res.status(500).json({
        message: "cannot find the collection",
      });
    }
  }

  static async updateSpecificCollection(req, res, next) {
    Logging.info(
      `Incoming -> Method: [${req.method}] - URL: [${req.url}] - IP: [${req.socket.remoteAddress}]] - Info: Update Data Collection`
    );

    const host = req.headers.host;

    let updateData;

    if (req.file) {
      console.log("update data with file");

      const host = req.headers.host;

      /**
       * Used to update the image url in the mongoDB
       * host= http:ip
       * reqFile= public\\collection-image\\Mon Jan 02 2023 13-25-23 GMT+0700 (Western Indonesia Time)kain batik buah asem.png
       *
       * @param {*} reqFile
       * @param {*} host
       * @returns http:ipAddress/image/identifier
       */
      const fotoUrlFunc = (reqFile, host) => {
        return host + "/" + reqFile.replaceAll("\\", "/");
      };

      /**
       * Used to update the imageName in mongoDB
       *
       * @param {*} reqFile
       * @returns Mon Jan 02 2023 13-25-23 GMT+0700 (Western Indonesia Time)kain batik buah asem.png
       */
      const imageName = (reqFile) => {
        /**
          * File - Image
          * MongoDB will only save the path to the file, not save the image into the db
          * to make it happen, we have to define the path to the image to make it available
          * to public
          * 
          * original path name: public\\collection-image\\Mon Jan 02 2023 13-25-23 GMT+0700 (Western Indonesia Time)kain batik buah asem.png
          * desired path name: public/collection-image/Mon Jan 02 2023 13-25-23 GMT+0700 (Western Indonesia Time)kain batik buah asem.png
          * 
          * split the path to get only the name: 
          *  -> .split('/')
          * result: [  'public',
                        'collection-image',  
                        'Mon Jan 02 2023 13-25-23 GMT+0700 (Western Indonesia Time)kain batik buah asem.png']
          * 
          * get only the name:
          *  -> result[2]
          * 

          */
        return reqFile.replaceAll("\\", "/").split("/")[2];
      };

      /**
       * function to get directory of old image
       *
       * @param {*} collectionId
       * @returns \public\collection-image\Mon ...
       */
      const fileDirFunc = async (collectionId) => {
        // access db to get the information about the image -> foto url
        const result = await CollectionsDAO.getCollectionDetail(collectionId);
        console.log(result);
        const { fotoUrl } = result;

        // example result: localhost:3002/public/collection-image/Mon Jan 02 2023 18-04-38 GMT+0700 (Western Indonesia Time)Update kain batik buah asem.png
        // desired: ../public/collection-image/Mon . . .
        let fileDir = fotoUrl.split("/");

        // splice (get out) the host name
        let filteredDir = fileDir.splice(1, 3); // start at 0, get 3 element

        // add parent dir
        //filteredDir.unshift('..')

        // join the array to become string of directory
        let directory = filteredDir.join("\\");

        return directory;
      };

      const imageDir = await fileDirFunc(req.params.collectionId); //check

      // delete the file if user inserted new file while update
      const __filename = fileURLToPath(import.meta.url);
      const __dirname = path.dirname(__filename);
      // console.log(__dirname) // D:\Document\Semester 9\Skripsi Project\service-inventaris\controller

      // const removeLastPathDirname = dirname => {
      //   let dirArr = dirname.split('\\')
      //   dirArr.pop()
      //   return dirArr.join('\\')
      // }

      // const dirname = removeLastPathDirname(__dirname)
      // console.log(dirname) D:\Document\Semester 9\Skripsi Project\service-inventaris

      const directoryImageCollection = (dirname, imageDir) => {
        // __dirname: D:\Document\Semester 9\Skripsi Project\service-inventaris\controller
        // desired __dirname: D:\Document\Semester 9\Skripsi Project\service-inventaris\

        let dirArr = dirname.split("\\");
        dirArr.pop(); // remove controller
        let new_dirname = dirArr.join("\\");

        let fullImageDir = new_dirname + "\\" + imageDir;
        return fullImageDir;
      };

      const dirImage = directoryImageCollection(__dirname, imageDir);
      console.log(dirImage);

      fs.unlink(dirImage, (error) => {
        if (error) throw error;
        console.log("successfully delete old data");
      });

      updateData = {
        fotoName: imageName(req.file.path),
        fotoUrl: fotoUrlFunc(req.file.path, req.headers.host),
        ...req.body,
      };
    } else {
      console.log("update data tanpa file");
      updateData = req.body;
    }

    // console.log(updateData)

    const updateCollectionResult = await CollectionsDAO.updateCollection(
      req.params.collectionId,
      updateData,
      host
    );

    res.status(200).send(updateCollectionResult);
  }

  static async deleteSpecificCollection(req, res, next) {
    Logging.info(
      `Incoming -> Method: [${req.method}] - URL: [${req.url}] - IP: [${req.socket.remoteAddress}]] - Info: Delete Data Collection`
    );

    // if database already deleted, delete the file.

    // TODO handling if data un-exist
    const data = await CollectionsDAO.getCollectionDetail(
      req.params.collectionId
    );
    const imageDirectory = "public\\collection-image\\" + data.fotoName;

    try {
      const deleteCollection = await CollectionsDAO.deleteCollection(
        req.params.collectionId
      );
      // let deleteCollection = true
      if (deleteCollection) {
        // if data in database deleted, delete the image file in directory
        fs.unlink(imageDirectory, (error) => {
          if (error) throw error;
          console.log("successfully delete old data");
        });

        res.status(200).json({
          message: "Data berhasil dihapus",
        });
      } else {
        res.status(500).json({
          message: "Tidak ada data yang dihapus",
        });
      }
    } catch (error) {
      Logging.error(error);
    }
  }
}

export { collectionsController, collectionSpecificController };
