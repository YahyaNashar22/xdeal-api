import multer from "multer";
import path from "path";
import fs from "fs";

const uploadBase = path.join(process.cwd(), "uploads");

const storage = multer.diskStorage(
    {
        destination: (req, file, cb) => {
            const type = req.params.type || req.body.type; // e.g., users, vehicles, properties, ads
            const dir = path.join(uploadBase, type || "misc");

            // create directory if not exists
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir, { recursive: true });
            }
            cb(null, dir);
        },
        filename: (req, file, cb) => {
            const uniqueName = Date.now() + "-" + Math.round(Math.random() * 1e9) + path.extname(file.originalname);
            cb(null, uniqueName);
        }
    }
);

export const upload = multer({
    storage,
    limits: { fileSize: 50 * 1024 * 1024 }, // 50mb max
    fileFilter: (req, file, cb) => {
        const allowed = /jpeg|jpg|png|mp4|mov|avi|webp/;
        const ext = path.extname(file.originalname).toLowerCase();
        if (allowed.test(ext)) {
            cb(null, true)
        }
        else {
            cb(new Error("Invalid File Type"))
        };
    }
});



// HACK: example usage

/*

? Profile picture upload
router.post("/uploads/users", upload.single("file"), (req, res) => {
  res.json({ filePath: `/uploads/users/${req.file.filename}` });
});

? Vehicle images upload
router.post("/uploads/vehicles", upload.array("files", 5), (req, res) => {
  res.json({
    files: req.files.map(f => `/uploads/vehicles/${f.filename}`)
  });
});



*/