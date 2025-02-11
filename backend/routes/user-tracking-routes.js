import express from 'express';
import tracking from "../controllers/user-tracking-controller.js";
const router = express.Router();

router.post("/post", tracking.createOrUpdatePostTrackingData);

router.post("/global", tracking.createOrUpdateGlobalPageMetaData);

export default router;
