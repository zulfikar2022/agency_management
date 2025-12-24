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
    <h1 class="title">পণ্যের কালেকশনের রিপোর্ট</h1>
        @if ($start_date == $end_date)
            <!-- use Carbon and make the date as 22 December 2025 -->
            <p style="text-align: center; font-weight: bold;">রিপোর্টের সময়কাল: {{ \Carbon\Carbon::parse($start_date)->format('d F Y') }} </p>
            @else
             <p style="text-align: center; font-weight: bold;">রিপোর্টের সময়কাল: {{ \Carbon\Carbon::parse($start_date)->format('d F Y') }} থেকে {{ \Carbon\Carbon::parse($end_date)->format('d F Y') }} </p>
        @endif
        <p style="text-align: center; font-weight: bold;">রিপোর্ট তৈরির তারিখঃ <span style="font-weight: normal;">{{ \Carbon\Carbon::now()->format('d F Y') }}</span> </p>
        <div style="display: grid; grid-template-columns: 1fr 1fr; justify-items: center;">
            <div>
                <p style="font-weight: bold;">মোট সংগ্রহযোগ্য <span style="font-weight: normal;">{{ $total_collectable }} টাকা</span></p>
            </div>
            <div>
                <p style="font-weight: bold;">মোট সংগ্রহঃ <span style="font-weight: normal;">{{ $total_collection }} টাকা</span></p>
            </div>
        </div>

        @forelse ($collections as $collection)
            <div style="display: grid; grid-template-columns: 0.5fr 1fr 1fr 1fr 1fr; border-bottom: 1px solid #ccc; padding: 4px 0; margin-bottom: 4px;">
                <div>
                    <p style="font-weight: bold;">আইডিঃ <span style="font-weight: normal;">{{ $collection->customer_id }}</span></p>
                   
                </div>
                <div>
                     <p style="font-weight: bold;">কাস্টমারের নামঃ <span style="font-weight: normal;">{{ $collection->customer_name }}</span></p>
                </div>
                <div>
                    <p style="font-weight: bold;">সংগ্রহযোগ্য পরিমাণঃ <span style="font-weight: normal;">{{ $collection->collectable_amount }} টাকা</span></p>
                </div>
                <div>
                    <p style="font-weight: bold;">সংগ্রহকৃত পরিমাণঃ <span style="font-weight: normal;">{{ $collection->collected_amount }} টাকা</span></p>
                </div>
                 <div>
                    <p style="font-weight: bold;">তারিখঃ <span style="font-weight: normal;">{{ \Carbon\Carbon::parse($collection->created_at)->format('d F Y') }}</span></p>
                </div>
            </div>
        @empty
            <p style="text-align: center; font-weight: bold; margin-top: 20px;">কোনো সংগ্রহের তথ্য পাওয়া যায়নি।</p>
        @endforelse

</body>
</html>