export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') return res.status(200).end();

    let message = "";
    if (req.body && req.body.message) {
        message = req.body.message;
    } else if (typeof req.body === 'string') {
        try { message = JSON.parse(req.body).message; } catch(e) { message = ""; }
    }

    if (!message) return res.status(200).json({ reply: "Ketik sesuatu dong bro!" });

    const apiKey = "AIzaSyAoj0x7s7Hh3i_IkEjKuMi7pEz7QyuBQjc"; 
    
    // GANTI v1beta JADI v1 DI SINI BRO
    const url = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: "Kamu adalah Ankerweb AI asisten Arka Muhammad. Jawab gaul dan singkat.\n\nUser: " + message }] }]
            })
        });

        const data = await response.json();
        
        if (data.candidates && data.candidates.content) {
            const reply = data.candidates.content.parts.text;
            res.status(200).json({ reply });
        } else {
            // Biar langsung kelihatan kalau ada error lagi dari Google
            res.status(200).json({ reply: "Error Gemini: " + (data.error ? data.error.message : "Cek API Key!") });
        }
    } catch (error) {
        res.status(200).json({ reply: "Vercel lagi pening, coba lagi!" });
    }
}
