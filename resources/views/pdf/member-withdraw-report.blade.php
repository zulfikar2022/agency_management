<!DOCTYPE html>
<html lang="bn">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>উত্তোলনের বিস্তারিত রিপোর্ট</title>

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
        <h1 class="title"> উত্তোলনের বিস্তারিত রিপোর্ট</h1>
    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 10px;">
        <div>
            <p style="font-weight: bold;">আইডিঃ <span style="font-weight: normal;">{{ $member->id }}</span></p>
            <p style="font-weight: bold;">নামঃ <span style="font-weight: normal;">{{ $member->name }}</span></p>
            <p style="font-weight: bold;"> পিতার নামঃ <span style="font-weight: normal;">{{ $member->fathers_name }}</span></p>
            <p style="font-weight: bold;">মাতার নামঃ <span style="font-weight: normal;">{{ $member->mothers_name }}</span></p>
            <p style="font-weight: bold;">ফোন নাম্বারঃ  <span style="font-weight: normal;">{{ $member->phone_number }}</span></p>
            <p style="font-weight: bold;">ঠিকানাঃ  <span style="font-weight: normal;">{{ $member->address }}</span></p>
            <p style="font-weight: bold;">এনআইডি/জন্মনিবন্ধন নম্বরঃ <span style="font-weight: normal;">{{ $member->nid_number }}</span></p>


        </div>
        <div>
            @if ($withdraws)
                <p style="font-weight: bold;">মোট উত্তোলনঃ <span style="font-weight: normal;">{{ $total_withdrawn_amount  / 100}} টাকা</span></p>
                 <p style="font-weight: bold;">অবশিষ্ট আছেঃ  <span style="font-weight: normal;">{{ $member->total_deposit  / 100}} টাকা</span></p>
            @endif      
                <p style="font-weight: bold; border-top: 1px dashed black;">রিপোর্ট তৈরির তারিখঃ    <span style="font-weight: normal;">{{ \Carbon\Carbon::now()->format('d F Y') }}</span></p>
        </div>
    </div>

    @forelse ($withdraws as $withdraw)
        <div style="border-bottom: 1px solid #ccc; display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
            <p style="font-weight: bold;">তারিখঃ <span style="font-weight: normal;">{{ \Carbon\Carbon::parse($withdraw->created_at)->format('d F Y') }}</span></p>
            <p style="font-weight: bold;">পরিমাণঃ <span style="font-weight: normal;">{{ $withdraw->withdraw_amount  / 100}} টাকা</span></p>
           
        </div>
    @empty
        <p style="text-align: center; font-weight: bold; margin-top: 20px;">কোনো উত্তোলন পাওয়া যায়নি।</p>
    @endforelse
</body>
</html>