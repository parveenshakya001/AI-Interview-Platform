const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');
const { GoogleGenAI } = require('@google/genai');

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const extractText = async (file) => {
  const ext = file.originalname.split('.').pop().toLowerCase();

  if (ext === 'pdf') {
    const data = await pdfParse(file.buffer);
    return data.text;
  }

  if (ext === 'docx' || ext === 'doc') {
    const result = await mammoth.extractRawText({ buffer: file.buffer });
    return result.value;
  }

  throw new Error('Unsupported file type. Please upload a PDF or DOCX file.');
};

const analyzeResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded.' });
    }

    const resumeText = await extractText(req.file);

    if (!resumeText || resumeText.trim().length < 50) {
      return res.status(400).json({ message: 'Could not extract enough text from the file.' });
    }

    const prompt = `You are an expert technical resume reviewer and ATS analyzer.

Analyze the following resume text and respond ONLY with valid JSON in exactly this format, no markdown, no other text:

{
  "atsScore": <number 0-100>,
  "detectedSkills": [<array of skill strings found in the resume, max 10>],
  "missingSkills": [<array of 3-5 commonly expected skills NOT found, relevant to the resume's apparent field>],
  "suggestions": [<array of 4-6 short, actionable improvement suggestions, each under 12 words>]
}

Resume text:
"""
${resumeText.slice(0, 8000)}
"""`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: prompt,
    });

    const rawText = response.text;
    const cleaned = rawText.replace(/```json|```/g, '').trim();
    const analysis = JSON.parse(cleaned);

    return res.status(200).json({
      fileName: req.file.originalname,
      ...analysis,
    });
  } catch (error) {
    console.error('Resume analysis error:', error);
    return res.status(500).json({ message: error.message || 'Failed to analyze resume.' });
  }
};

module.exports = { analyzeResume };