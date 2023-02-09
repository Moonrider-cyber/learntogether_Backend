const multer =  require('multer');

exports.singleUpload = ()=>{

    const storage = multer.memoryStorage();

    const singleUpload = multer({storage}).single("file");
    return singleUpload;
}
