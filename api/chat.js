export default async function handler(req, res) {
    // Header agar bisa dipanggil dari AppCreator24
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    // Ambil pesan dari user
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

    // API Key Groq Lu
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
                        content: "Kamu adalah Ankerweb AI, asisten gaul milik Arka Muhammad. Jawab singkat, pakai bahasa Indonesia santai (gue/lu), dan jangan kaku." 
                    },
                    { role: "user", content: message }
                ],
                temperature: 0.7
            })
        });

        const data = await response.json();
        
        if (data.choices && data.choices) {
            const reply = data.choices.message.content;
            res.status(200).json({ reply });
        } else {
            res.status(200).json({ reply: "Duh, Groq lagi limit atau ada yang salah di kuncinya bro!" });
        }
    } catch (error) {
        res.status(200).json({ reply: "Koneksi ke server Groq gagal, coba lagi!" });
    }
}
