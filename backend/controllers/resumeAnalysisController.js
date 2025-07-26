import axios from 'axios';
import FormData from 'form-data';
import fs from 'fs';

export const analyzeResume = async (req, res) => {
  try {
    // multer put file on disk
    const pdfPath = req.file.path;
    const jobDesc = req.body.job_description || '';

    // build a multipart/form-data request for Flask
    const form = new FormData();
    form.append('resume', fs.createReadStream(pdfPath));
    if (jobDesc) form.append('job_description', jobDesc);

    // call your Flask API
    const flaskResp = await axios.post(
      'http://localhost:5000/analyze',
      form,
      { headers: form.getHeaders() }
    );

    // forward the analysis back to React
    return res.json({ success: true, analysis: flaskResp.data.analysis });
  } catch (err) {
    console.error('✖ resumeAnalysis error:', err.response?.data || err.message);
    return res.status(500).json({ success: false, error: 'Failed to analyze resume' });
  }
};
