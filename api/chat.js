export default async function handler(req, res) {
    // Header agar bisa dipanggil dari AppCreator24
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    const { message } = req.body;
    const apiKey = "AIzaSyDdLxPTb7S8ML0izry6vhExrN55c9f4IaA"; // API Key lu
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: "Kamu adalah Ankerweb AI asisten Arka Muhammad. Jawab gaul dan singkat.\n\nUser: " + message }] }]
            })
        });

        const data = await response.json();
        const reply = data.candidates.content.parts.text;
        res.status(200).json({ reply });
    } catch (error) {
        res.status(500).json({ reply: "Duh, server Vercel lagi pusing bro!" });
    }
}
