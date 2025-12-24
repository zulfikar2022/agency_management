<!DOCTYPE html>
<html lang="bn">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>এমপ্লয়ী ভিত্তিক বিস্তারিত রিপোর্ট</title>

   


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
    <h1 class="title">এমপ্লয়ী ভিত্তিক পণ্যের কিস্তি কালেকশন রিপোর্ট</h1>
        @if ($start_date == $end_date)
            <!-- use Carbon and make the date as 22 December 2025 -->
            <p style="text-align: center; font-weight: bold;">রিপোর্টের সময়কাল: {{ \Carbon\Carbon::parse($start_date)->format('d F Y') }} </p>
            @else
             <p style="text-align: center; font-weight: bold;">রিপোর্টের সময়কাল: {{ \Carbon\Carbon::parse($start_date)->format('d F Y') }} থেকে {{ \Carbon\Carbon::parse($end_date)->format('d F Y') }} </p>
        @endif
        <p style="font-weight: bold; text-align: center;">এমপ্লয়ীর নামঃ <span style="font-weight: normal;">{{ $employee->name }}</span></p>
        <p style="font-weight: bold; text-align: center;">রিপোর্ট তৈরির তারিখঃ    <span style="font-weight: normal;">{{ \Carbon\Carbon::now()->format('d F Y') }}</span></p>

        <div style="display: grid; grid-template-columns: 1fr 1fr; justify-items: center;">
            <p style="font-weight:bold">মোট সংগ্রহযোগ্যঃ <span style="font-weight:normal">{{ $total_collectable }} টাকা</span></p>
            <p style="font-weight:bold">মোট সংগ্রহঃ  <span style="font-weight:normal">{{ $total_collection }} টাকা</span></p>
        </div>

        @forelse ($collections as $collection)
            <div class="collection-entry" style="display: grid; grid-template-columns: 0.5fr 1fr 1fr 1fr 1fr; border-bottom: 1px solid #ccc;">
                <p style="font-weight: normal;"><span style="font-weight: bold" class="label">গ্রাহকের আইডিঃ </span> {{ $collection->customer_id }}</p>
                <p style="font-weight: normal;"><span style="font-weight: bold;" class="label">গ্রাহকের নামঃ</span> {{ $collection->customer_name }}</p>
                <p style="font-weight: normal;"><span style="font-weight: bold;" class="label"> তারিখঃ</span> {{ \Carbon\Carbon::parse($collection->created_at)->format('d F Y') }}</p>
                <p style="font-weight: normal;"><span style="font-weight: bold;" class="label">সংগ্রহযোগ্য পরিমাণঃ</span> {{ $collection->collectable_amount }} টাকা</p>
                <p style="font-weight: normal;"><span style="font-weight: bold;" class="label">সংগ্রহকৃত পরিমাণঃ</span> {{ $collection->collected_amount }} টাকা</p>
                <!-- <p><span class="label">বাকী পরিমাণঃ</span> {{ $collection->collectable_amount - $collection->collected_amount }} টাকা</p> -->
                
            </div>
        @empty
            <p style="text-align: center; font-weight: bold; margin-top: 20px;">কোনো সংগ্রহের তথ্য পাওয়া যায়নি।</p>
        @endforelse


</body>
</html>