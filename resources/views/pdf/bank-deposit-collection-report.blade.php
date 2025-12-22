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
        <h1 class="title"> সামগ্রিক সঞ্চয় কালেকশনের বিস্তারিত রিপোর্ট</h1>
        @if ($start_date == $end_date)
        <!-- use Carbon and make the date as 22 December 2025 -->
        <p style="text-align: center; font-weight: bold;">রিপোর্টের সময়কাল: {{ \Carbon\Carbon::parse($start_date)->format('d F Y') }} </p>
        @else
        <p style="text-align: center; font-weight: bold;">রিপোর্টের সময়কাল: {{ \Carbon\Carbon::parse($start_date)->format('d F Y') }} থেকে {{ \Carbon\Carbon::parse($end_date)->format('d F Y') }} </p>
        @endif
        <p style="font-weight: bold; text-align: center;">রিপোর্ট তৈরির তারিখঃ    <span style="font-weight: normal;">{{ \Carbon\Carbon::now()->format('d F Y') }}</span></p>
        
        <p style="text-align: center; font-weight: bold; margin-bottom: 20px;">মোট সঞ্চয় কালেকশন: {{ number_format($total_collection / 100, 2) }} টাকা</p>

        @forelse ($deposit_collections as $deposit_collection)
            <div class="deposit-collection-entry">
                <div style="display: grid; grid-template-columns: 1fr 2fr 2fr 1fr;">
                    <p><strong>সদস্যের আইডি:</strong> {{ $deposit_collection->member_id }}</p>
                    <p><strong>সদস্যের নাম:</strong> {{ $deposit_collection->member_name }} </p>
                     <p><strong>সঞ্চয়ের তারিখ:</strong> {{ \Carbon\Carbon::parse($deposit_collection->created_at)->format('d F Y') }}</p>
                    <p><strong>পরিমাণ:</strong> {{ number_format($deposit_collection->deposit_amount / 100, 2) }} টাকা</p>
                </div>
                
                <hr>
            </div>
        @empty
            <p style="text-align: center; font-weight: bold;">কোনো সঞ্চয় কালেকশন পাওয়া যায়নি।</p>
        @endforelse
       

    </body>
</html>