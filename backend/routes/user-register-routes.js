import express from 'express';
import userRegister from "../controllers/user-register-controller.js";
import { uploadFiles } from "../middleware/upload.js";

const router = express.Router();

router.get("/:pageId", userRegister.getRegisterDetails);

router.post("/", uploadFiles.any("files"), userRegister.createUserRegister);

export default router;
