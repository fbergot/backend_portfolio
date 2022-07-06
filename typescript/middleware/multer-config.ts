import * as multer from "multer";

type MimesTypes<T> = {
   [key: string]: T;
};

const mimesTypes: MimesTypes<string> = {
   "image/jpg": "jpg",
   "image/jpeg": "jpg",
   "image/png": "png",
};

const options: multer.DiskStorageOptions = {
   destination: (_, __, callback) => {
      callback(null, "images");
   },
   filename: (_, file, callback) => {
      // transform space in _
      const name = file.originalname.split(" ").join("_");
      let extension;
      let fileNameWithExtension = "";
      // check mimetype/extension & fileName creation
      if (file.mimetype in mimesTypes) {
         extension = mimesTypes[file.mimetype];
         fileNameWithExtension = `${name}${Date.now()}.${extension}`;
         callback(null, fileNameWithExtension);
      } else {
         callback(new Error("Bad mimetype"), "");
      }
   },
};
const storage = multer.diskStorage(options);

export default multer({ storage: storage }).single("image");
