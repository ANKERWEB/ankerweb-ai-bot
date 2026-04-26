<?php
// Izinkan akses dari mana saja (CORS Fix)
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header('Content-Type: application/json');

// Handle preflight request (Penting buat Fetch API)
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    exit;
}

$apiKey = "AIzaSyDdLxPTb7S8ML0izry6vhExrN55c9f4IaA"; 
$url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=" . $apiKey;

$input = json_decode(file_get_contents('php://input'), true);
$userMessage = $input['message'] ?? '';

if (empty($userMessage)) {
    echo json_encode(["reply" => "Halo bro, server aktif! Mau tanya apa?"]);
    exit;
}

$dataRequest = [
    "contents" => [
        ["role" => "user", "parts" => [["text" => "Kamu adalah Ankerweb AI asisten Arka Muhammad. Jawab dengan gaya gaul dan singkat.\n\nUser: " . $userMessage]]]
    ]
];

$ch = curl_init($url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($dataRequest));
curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);

$response = curl_exec($ch);
curl_close($ch);

$result = json_decode($response, true);
$answer = $result['candidates']['content']['parts']['text'] ?? "Duh, server lagi limit atau pusing bro. Coba lagi bentar ya!";

echo json_encode(["reply" => $answer]);
echo json_encode(["reply" => $answer]);
