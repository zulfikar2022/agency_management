<!DOCTYPE html>
<html lang="bn">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>খরচের বিস্তারিত রিপোর্ট</title>

   


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
        <h1 class="title"> খরচের বিস্তারিত রিপোর্ট</h1>
        @if ($start_date == $end_date)
        <!-- use Carbon and make the date as 22 December 2025 -->
        <p style="text-align: center; font-weight: bold;">রিপোর্টের সময়কাল: {{ \Carbon\Carbon::parse($start_date)->format('d F Y') }} </p>
        @else
        <p style="text-align: center; font-weight: bold;">রিপোর্টের সময়কাল: {{ \Carbon\Carbon::parse($start_date)->format('d F Y') }} থেকে {{ \Carbon\Carbon::parse($end_date)->format('d F Y') }} </p>
        @endif
        <p style="font-weight: bold; text-align: center;">রিপোর্ট তৈরির তারিখঃ    <span style="font-weight: normal;">{{ \Carbon\Carbon::now()->format('d F Y') }}</span></p>
        
        <p style="text-align: center; font-weight: bold; margin-bottom: 20px;">মোট খরচ: {{ number_format($total_cost , 2) }} টাকা</p>

        @forelse ($costs as $cost)
            <div class="cost-entry">
                <div style="display: grid; grid-template-columns: 2fr 2fr 2fr 2fr;">
                    <div>
                        <p style="font-weight: bold;">বিবরণ:</p>
                        <span> {{ $cost->description }} </span>
                    </div>
                        <div>
                            <p style="font-weight: bold;">পরিমাণ:</p>
                            <span> {{ number_format($cost->amount , 2) }} টাকা </span>
                        </div>
                    <div>
                        <p style="font-weight: bold;">তারিখ:</p>
                        <span> {{ \Carbon\Carbon::parse($cost->created_at)->format('d F Y') }} </span>
                    </div>
                    <div>
                        <p style="font-weight: bold;">খরচ করেছেন:</p>
                        <span> {{ $cost->creating_user_name }} </span>
                    </div>
                </div>
                
                <hr>
            </div>
        @empty
            <p style="text-align: center; font-weight: bold;">কোনো খরচ পাওয়া যায়নি।</p>
        @endforelse 
</body>
</html>