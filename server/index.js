import cors from "cors";
import multer from "multer";
import express from "express";
import * as dotenv from "dotenv";
import storage from "./firebase";
import { ref, listAll, uploadBytes, deleteObject, getDownloadURL } from "firebase/storage";

dotenv.config();

const PORT = process.env.PORT || 5000;

const app = express();

app.use(cors());
app.use(express.json());

const memoStorage = multer.memoryStorage();
const upload = multer({ memoStorage });

app.post("/upload-image", upload.any("pic"), async (req, res) => {
    const files = req.files;
    
    if (files.length) {
        files.forEach(async(file) => {
            const metatype = {
                name: file.originalname,
                contentType: file.mimetype,
            };
            const imageRef = ref(storage, file.originalname);
    
            await uploadBytes(imageRef, file.buffer, metatype)
                .then((snapshot) => res.json({ message: "success" }))
                .catch((error) => console.log(error.message));

            const url = await getDownloadURL(imageRef);
        })
    } else {
        res.json({ message: "File is empty" });
    }
});

app.get("/get-images", async (_req, res) => {
    const listRef = ref(storage);

    await listAll(listRef)
        .then((images) => {
            const listImage = images.items.map((item) => ({
                name: item._location.path_,
                url: `https://firebasestorage.googleapis.com/v0/b/${item._location.bucket}/o/${item._location.path_}?alt=media`,
            }));
            res.json({ message: "success", data: listImage });
        })
        .catch((error) => console.log(error.message));
});

app.delete("/remove-image", async (req, res) => {
    const imageName = req.body.name;
    const imageRef = ref(storage, imageName);

    await deleteObject(imageRef)
        .then(() => res.json({ message: "success" }))
        .catch((error) => console.log(error.message));
});

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
