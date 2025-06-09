// /api/generate-scenario.js

export default async function handler(req, res) {
  // フロントエンドからのリクエストか確認
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { prompt } = req.body;

  // サーバー側でのみ使用するAPIキー
  const apiKey = process.env.GEMINI_API_KEY; 
  const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

  const payload = {
    contents: [{ role: "user", parts: [{ text: prompt }] }],
  };

  try {
    const apiResponse = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!apiResponse.ok) {
      throw new Error(`API call failed with status: ${apiResponse.status}`);
    }

    const data = await apiResponse.json();

    // Googleからのレスポンスをフロントエンドに送り返す
    res.status(200).json(data);

  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
}
