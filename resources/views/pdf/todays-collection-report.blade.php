
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
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
        .title { font-size: 28px; font-weight: bold; text-align: center; margin: 30px 0; }
    </style>
    <title>কিস্তির রিপোর্ট</title>
</head>
<body>
     <div>
        <p class="" style="text-align: center; font-weight:bold ; font-size: large;">ভেলাজান কৃষি সমবায় সমিতি লিমিটেড, ভেলাজান বাজার, ঠাকুরগাঁও সদর, ঠাকুরগাঁও </p>
    </div>
    <div>
        <h1 class="title">কিস্তির রিপোর্ট</h1>
    </div>
    <div>
        <p style="font-weight:bold">রিপোর্ট তৈরির তারিখঃ <span style="font-weight: normal;">{{ \Carbon\Carbon::now()->format('j F Y (l)') }}</span> </p>
        <p style="font-weight:bold">কিস্তির তারিখঃ <span style="font-weight:normal">{{ $reportDate }}</span> </p>
        <p style="font-weight:bold">মোট সংগ্রহকৃত অর্থঃ <span style="font-weight:normal">{{ $total_collected_amount }} টাকা </span> </p>
    </div>
    <p class="title">কিস্তির তালিকা</p>
    <div>
        @foreach ($collections as $collection )
            <div style="font-size: 13px; display: flex; justify-content: space-between; border-bottom: 1px solid #000; padding: 10px;">
                <div>
                    <p style="font-weight: bold;">কাস্টমারের নামঃ </p>
                    <p>{{ $collection['customer']['name'] }}</p>
                </div>
               <div>
                <p style="font-weight: bold;">ঠিকানাঃ </p>
                <p>{{ $collection['customer']['address'] }}</p>
               </div>
               <div>
                    <p style="font-weight: bold;">সাপ্তাহিক পরিশোধযোগ্যঃ  </p>
                    <p>{{ $collection['collectable_amount'] }} টাকা</p>
               </div>
                <div>
                    <p style="font-weight: bold;">সাপ্তাহিক পরিশোধ  </p>
                    <p>{{ $collection['collected_amount'] }} টাকা</p>
               </div>
            </div>
        
        @endforeach
    </div>
</body>
</html>