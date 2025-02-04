const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const path = require("path");
const ENV = process.env.NODE_ENV || "development";
require("dotenv").config({
  path: `${__dirname}/../../../../.env.${ENV}`,
});

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];

  if (!allowedTypes.includes(file.mimetype)) {
    return cb(
      new Error("Invalid file type. Only JPG, PNG, or JPEG files are allowed.")
    );
  }

  cb(null, true);
};

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "TheCommunityHub/",
    allowed_formats: ["jpg", "png", "jpeg"],
    public_id: (req, file) => Date.now() + path.extname(file.originalname),
  },
});

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
});

module.exports = upload;
