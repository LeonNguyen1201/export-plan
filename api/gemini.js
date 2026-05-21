import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: "Method not allowed" });

  const { prompt, systemInstruction } = req.body;
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  
  // Dùng model 1.5-flash
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  try {
    const result = await model.generateContent({
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        // Đưa systemInstruction vào đúng chỗ Google yêu cầu
        systemInstruction: systemInstruction
    });
    const response = await result.response;
    res.status(200).json({ text: response.text() });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}