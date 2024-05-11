import multer from 'multer';

const storage = multer.diskStorage({
  destination: 'uploads/', // Change this to your desired upload directory
});

const upload = multer({ storage });

export default upload;
