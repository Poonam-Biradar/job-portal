import express from 'express';
import multer from 'multer';
import { analyzeResume } from '../controllers/resumeAnalysisController.js';

const router = express.Router();
const upload = multer({ dest: 'uploads/' });  // ensure `uploads/` exists

// POST /api/v1/resume-analysis
router.post('/', upload.single('resume'), analyzeResume);

export default router;
