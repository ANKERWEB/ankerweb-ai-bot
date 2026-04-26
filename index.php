<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') { exit; }

$apiKey = "AIzaSyDdLxPTb7S8ML0izry6vhExrN55c9f4IaA"; // API Key Gemini lu
$url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=" . $apiKey;

$input = json_decode(file_get_contents('php://input'), true);
$userMessage = $input['message'] ?? '';

if (empty($userMessage)) {
    echo json_encode(["reply" => "Halo bro, ada yang bisa dibantu?"]);
    exit;
}

$dataRequest = [
    "contents" => [
        ["role" => "user", "parts" => [["text" => "Kamu adalah Ankerweb AI asisten Arka Muhammad. Jawab gaul.\n\nUser: " . $userMessage]]]
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
$answer = $result['candidates']['content']['parts']['text'] ?? "Server lagi pusing bro.";
echo json_encode(["reply" => $answer]);
