const AWS = require('aws-sdk');
const Busboy = require('busboy');
const config = require('../../../config/config')
var CryptoJS = require("crypto-js");
var jpeg = require('jpeg-js');
var fs = require("fs");
const fetch = require("node-fetch");
const { URLSearchParams } = require('url');

const BUCKET_NAME = 'crypto-cloud';
const IAM_USER_KEY = config.iamUser;
const IAM_USER_SECRET = config.iamSecret;


function uploadToS3(file){
 let s3bucket = new AWS.S3({
   accessKeyId: IAM_USER_KEY,
   secretAccessKey: IAM_USER_SECRET,
   Bucket: BUCKET_NAME,
 });
 s3bucket.createBucket(function () {
   var params = {
    Bucket: BUCKET_NAME,
    Key: file.name,
    Body: file,
   };
   s3bucket.upload(params, function (err, data) {
    if (err) {
     console.log('error in callback');
     console.log(err);
    }
    console.log('success');
    console.log(data);
   });
 });
}

module.exports = (app) => {
  app.post('/api/upload', function (req, res, next) {
   // This grabs the additional parameters so in this case passing     
   // in "element1" with a value.
   const element1 = req.body.element1;
   var busboy = new Busboy({ headers: req.headers });
   // The file upload has completed
    busboy.on('file', function (fieldname, file, filename, encoding, mimetype) {
    console.log('Upload finished');
  
    const file = req.files.element2;
    console.log(file);
    const params = new URLSearchParams();
    params.append('file',fs.createReadStream(file));

    console.log(params);
    const url = "http://localhost:5000/api/v1/encrypt";
    fetch(url, {
        method : "POST",
        body: params,
        headers: {
          "Content-Type": "multipart/form-data",
        },
    }).then(res => {console.log(res)});
    // uploadToS3(file);
   });
   req.pipe(busboy);
  });
}