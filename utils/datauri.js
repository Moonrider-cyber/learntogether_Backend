const dataUriParser = require('datauri/parser.js');

const getDataUri = (file)=>{
    const parser = new dataUriParser();
    const extName = path.extname(file.originalName).toString();
}