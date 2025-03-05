const { Storage } = require("@google-cloud/storage");
const path = require("path");

const storage = new Storage({
  keyFilename: path.join(__dirname, "Your Google Cloud Service Account Key"),
});

const bucket = storage.bucket("dexaitv");

module.exports = bucket;
