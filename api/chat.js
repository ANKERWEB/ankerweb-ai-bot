export default async function handler(req, res) {
    // Header CORS agar bisa diakses dari AppCreator24
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    // Mengambil pesan dari user dengan proteksi parsing
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
        return res.status(200).json({ reply: "Ketik sesuatu dong bro, jangan dikosongin!" });
    }

    // GANTI DENGAN API KEY GROQ TERBARU LU
    const apiKey = "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"; 

    try {
        const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: "llama3-8b-8192", 
                messages: [
                    { 
                        role: "system", 
                        content: "Kamu adalah Ankerweb AI, asisten gaul milik Arka Muhammad. Jawab singkat, padat, pakai bahasa Indonesia santai (gue/lu), dan jangan kaku. Fokus bantu soal Donghua atau script." 
                    },
                    { role: "user", content: message }
                ],
                temperature: 0.8
            })
        });

        const data = await response.json();
        
        if (data.choices && data.choices) {
            const reply = data.choices.message.content;
            res.status(200).json({ reply });
        } else {
            // Memberikan pesan error yang lebih jelas jika gagal
            const errorMsg = data.error ? data.error.message : "API Key bermasalah atau limit.";
            res.status(200).json({ reply: "Duh, ada masalah: " + errorMsg });
        }
    } catch (error) {
        res.status(200).json({ reply: "Koneksi ke server AI gagal, coba lagi nanti!" });
    }
}
