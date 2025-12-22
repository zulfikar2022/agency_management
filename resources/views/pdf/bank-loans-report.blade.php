<!DOCTYPE html>
<html lang="bn">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>সঞ্চয়ের বিস্তারিত রিপোর্ট</title>

   


    <link rel="stylesheet" href="{{ public_path('css/pdf-report.css') }}">

    <style>
        /* FIX 2: Use public_path() for custom fonts so Dompdf finds the absolute file path */
        @font-face {
            font-family: 'SolaimanLipi';
            src: url('{{ public_path('fonts/SolaimanLipi_20-04-07.ttf') }}') format('truetype');
            font-weight: normal;
        }
        @font-face {
            font-family: 'SolaimanLipi';
            src: url('{{ public_path('fonts/SolaimanLipi_20-04-07.ttf') }}') format('truetype');
            font-weight: bold;
        } 
        body {
            font-family: 'SolaimanLipi', sans-serif;
            font-size: 14px;
            line-height: 1.6;
            padding: 40px;
            margin: 0;
        }
        .title { font-size: 28px; font-weight: bold; text-align: center; margin: 10px 0; }
    </style>
</head>
    <body>
        <div>
            <p class="" style="text-align: center; font-weight:bold ; font-size: large;">ভেলাজান কৃষি সমবায় সমিতি লিমিটেড, ভেলাজান বাজার, ঠাকুরগাঁও সদর, ঠাকুরগাঁও </p>
        </div>
        <h1 class="title"> ব্যাঙ্ক ঋণ একাউন্টের বিস্তারিত রিপোর্ট</h1>
        <p style="text-align: center; font-weight: bold;">রিপোর্টের সময়কাল: {{ date('d-m-Y', strtotime($start_date)) }} থেকে {{ date('d-m-Y', strtotime($end_date)) }} </p>

    </body>
</html>