const host = req.headers.host

/**
 * host: http:ip
 * reqFile: public\\collection-image\\Mon Jan 02 2023 13-25-23 GMT+0700 (Western Indonesia Time)kain batik buah asem.png
 * 
 * @param {*} reqFile 
 * @param {*} host 
 * @returns http:ip/image/identifier
 */
const fotoUrlFunc = (reqFile, host) => {
  return host + "/" + reqFile.replaceAll("\\", "/") 
}

/**
 * 
 * @param {*} reqFile 
 * @returns Mon Jan 02 2023 13-25-23 GMT+0700 (Western Indonesia Time)kain batik buah asem.png
 */
const imageName = reqFile => {
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
 return reqFile.replaceAll("\\", "/").split("/")[2]
}

// function to get directory of old image
const fileDirFunc = async collectionId => {
  const result = await CollectionsDAO.getCollectionDetail(collectionId)
  const { fotoUrl } = result

  // example result: localhost:3002/public/collection-image/Mon Jan 02 2023 18-04-38 GMT+0700 (Western Indonesia Time)Update kain batik buah asem.png
  // desired: ../public/collection-image/Mon . . . 
  let fileDir = fotoUrl.split("/")
  
  // splice (get out) the host name
  let filteredDir = fileDir.splice(1, 3) // start at 0, get 3 element

  // add parent dir
  //filteredDir.unshift('..')

  // join the array to become string of directory
  let directory = filteredDir.join("\\")

  return directory
}

const imageDir = await fileDirFunc(req.params.collectionId)