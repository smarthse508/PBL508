import express from "express";
import userAuth from "../middleware/userAuth.js";
import {
  tambahAsesmen,
  listAsesmen,
  editAsesmen,
  hapusAsesmen
} from "../controllers/asesmenController.js";

const router = express.Router();

// semua route butuh userAuth supaya req.user tersedia
router.post("/tambah", userAuth, tambahAsesmen);
router.get("/list", userAuth, listAsesmen);
router.put("/edit", userAuth, editAsesmen);
router.delete("/hapus", userAuth, hapusAsesmen);

export default router;
