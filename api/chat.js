export default async function handler(req, res) {
    // Header wajib biar nggak kena blokir
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    // Ambil pesan dari user
    // Di Vercel, kita perlu pastikan body-nya terbaca
    let message = "";
    if (req.body && req.body.message) {
        message = req.body.message;
    } else if (typeof req.body === 'string') {
        try {
            const parsed = JSON.parse(req.body);
            message = parsed.message;
        } catch(e) { message = ""; }
    }

    if (!message) {
        return res.status(200).json({ reply: "Pesan lu kosong bro, coba ketik sesuatu!" });
    }

    const apiKey = "AIzaSyDdLxPTb7S8ML0izry6vhExrN55c9f4IaA"; 
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ 
                    parts: [{ text: "Kamu adalah Ankerweb AI asisten Arka Muhammad. Jawab dengan gaya gaul dan singkat.\n\nUser: " + message }] 
                }]
            })
        });

        const data = await response.json();
        
        // Cek apakah ada jawaban dari Gemini
        if (data.candidates && data.candidates.content) {
            const reply = data.candidates.content.parts.text;
            res.status(200).json({ reply });
        } else {
            // Kalau API Key lu bermasalah atau limit, ini yang muncul
            res.status(200).json({ reply: "API Gemini lu lagi limit atau kuncinya salah nih bro." });
        }
    } catch (error) {
        res.status(200).json({ reply: "Koneksi ke Google putus, coba lagi bentar!" });
    }
}
