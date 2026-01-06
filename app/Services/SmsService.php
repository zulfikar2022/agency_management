<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class SmsService
{
    /**
     * Send SMS via MREM (Elitbuzz) API
     *
     * @param string $receiver 11-digit number (e.g., 01712345678)
     * @param string $message The text message (Bengali or English)
     * @return array
     */
    public static function send($receiver, $message)
    {
        $url = "https://msg.mram.com.bd/smsapi";
        
        // Ensure 88 is added just in case, though your provider handles both
        $formattedReceiver = (strlen($receiver) == 11) ? '88' . $receiver : $receiver;

        $params = [
            "api_key"  => config('services.mrem.api_key'),
            "type"     => config('services.mrem.message_type'),
            "contacts" => $formattedReceiver,
            "senderid" => config('services.mrem.sender_id'),
            "msg"      => $message,
        ];

        try {
            // Laravel's Http client automatically handles urlencode($message)
            $response = Http::get($url, $params);

            if ($response->successful()) {
                Log::info("SMS Sent Successfully", ['to' => $formattedReceiver]);
                return [
                    'success' => true,
                    'data'    => $response->body()
                ];
            }

            Log::error("SMS Gateway Error", ['response' => $response->body()]);
            return ['success' => false, 'message' => 'Gateway Error'];

        } catch (\Exception $e) {
            Log::error("SMS Exception", ['msg' => $e->getMessage()]);
            return ['success' => false, 'message' => $e->getMessage()];
        }
    }
}