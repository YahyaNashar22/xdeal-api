import { Router } from "express";
import { upload } from "../../middlewares/upload.js";

const uploadRouter = Router();

// POST /api/v1/uploads/:type
// type examples: vehicles, properties, users
uploadRouter.post("/:type", upload.array("files", 10), (req, res) => {
  const type = req.params.type || "misc";
  const files = req.files || [];

  if (!files.length) return res.status(400).json({ message: "No files uploaded" });

  const baseUrl = `${req.protocol}://${req.get("host")}`;
  const urls = files.map((f) => `${baseUrl}/uploads/${type}/${f.filename}`);

  return res.status(201).json({ urls });
});

uploadRouter.post("/:type/single", upload.single("file"), (req, res) => {
  const type = req.params.type || "misc";
  if (!req.file) return res.status(400).json({ message: "No file uploaded" });
  const baseUrl = `${req.protocol}://${req.get("host")}`;
  return res.status(201).json({ url: `${baseUrl}/uploads/${type}/${req.file.filename}` });
});

export default uploadRouter;