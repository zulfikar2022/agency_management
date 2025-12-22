<!DOCTYPE html>
<html lang="bn">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>সদস্যের বিস্তারিত রিপোর্ট</title>

   


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
    <h1 class="title">সদস্যের বিস্তারিত রিপোর্ট</h1>

    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 10px;">
        <div>
            <p style="font-weight: bold;">নামঃ <span style="font-weight: normal;">{{ $member->name }}</span></p>
             <p style="font-weight: bold;"> পিতার নামঃ <span style="font-weight: normal;">{{ $member->fathers_name }}</span></p>
            <p style="font-weight: bold;">মাতার নামঃ <span style="font-weight: normal;">{{ $member->mothers_name }}</span></p>
            <p style="font-weight: bold;">ফোন নাম্বারঃ  <span style="font-weight: normal;">{{ $member->phone_number }}</span></p>
            <p style="font-weight: bold;">ঠিকানাঃ  <span style="font-weight: normal;">{{ $member->address }}</span></p>
            <p style="font-weight: bold;">এনয়াইডি/জন্মনিবন্ধন নম্বরঃ <span style="font-weight: normal;">{{ $member->nid_number }}</span></p>


        </div>
        <div>
        @if ($member->total_loan> 0)
            <p style="font-weight: bold;">মোট ঋণঃ <span style="font-weight: normal;">{{ $member->total_loan  / 100}} টাকা</span></p>
             <p style="font-weight: bold;">মোট পরিশোধ করতে হবেঃ  <span style="font-weight: normal;">{{ $loan->total_payable_amount  / 100}} টাকা</span></p>
            <p style="font-weight: bold;">জামানতঃ  <span style="font-weight: normal;">{{ $loan->safety_money  / 100}} টাকা</span></p>
            <p style="font-weight: bold;">পরিশোধ হয়েছেঃ   <span style="font-weight: normal;">{{ ($loan->total_payable_amount - $loan->remaining_payable_amount)  / 100}} টাকা</span></p>
            <p style="font-weight: bold;">বাকি ঋণঃ   <span style="font-weight: normal;">{{ $loan->remaining_payable_amount  / 100}} টাকা</span></p>

        @endif      
       
            <p style="font-weight: bold;">মোট জমা আছেঃ   <span style="font-weight: normal;">{{ $member->total_deposit / 100 }} টাকা</span></p>
        </div>
    </div>

    <div style="display: grid; grid-template-columns:1fr 1fr 1fr; gap: 20px; margin-bottom: 10px;">
       <div>
         @if ($loan)
        <h2 style="font-size: 20px; font-weight: bold; margin-bottom: 10px; border-bottom: 1px solid #000;">কিস্তির তালিকা</h2>
        @forelse ($loan_collections as $collection)
            <div style="border-bottom: 1px solid #ccc; display: flex;flex-direction:column;">
                <p style="font-weight: bold;">তারিখঃ <span style="font-weight: normal;">
                <!-- need date format as 23 December 2025 -->
                {{ $collection->created_at->format('d F Y') }}</span></p>
                <p style="font-weight: bold;">পরিমাণঃ <span style="font-weight: normal;">{{ $collection->paid_amount / 100 }} টাকা</span></p>
            </div>
            @empty
                <p>কোনো ঋণের কিস্তি সংগ্রহের তথ্য নেই।</p>
            @endforelse
        @endif
       </div>
       <div>
            @if ($deposit)
                <h2 style="font-size: 20px; font-weight: bold; margin-bottom: 10px; border-bottom: 1px solid #000;">সঞ্চয়ের তালিকা</h2>
                @forelse ($deposit_collections as $collection)
                    <div style="border-bottom: 1px solid #ccc; display: flex;flex-direction:column;">
                        <p style="font-weight: bold;">তারিখঃ <span style="font-weight: normal;">
                        <!-- need date format as 23 December 2025 -->
                        {{ $collection->created_at->format('d F Y') }}</span></p>
                        <p style="font-weight: bold;">পরিমাণঃ <span style="font-weight: normal;">{{ $collection->deposit_amount / 100 }} টাকা</span></p>
                    </div>
                @empty
                    <p>কোনো সঞ্চয়ের তথ্য নেই।</p>
                @endforelse
            @endif
       </div>
       <div>
            @if ($withdraw_collections->count() > 0)
                <h2 style="font-size: 20px; font-weight: bold; margin-bottom: 10px; border-bottom: 1px solid #000;">উত্তোলনের তালিকা</h2>
                @forelse ($withdraw_collections as $collection)
                    <div style="border-bottom: 1px solid #ccc; display: flex;flex-direction:column;">
                        <p style="font-weight: bold;">তারিখঃ <span style="font-weight: normal;">
                        <!-- need date format as 23 December 2025 -->
                        {{ $collection->created_at->format('d F Y') }}</span></p>
                        <p style="font-weight: bold;">পরিমাণঃ <span style="font-weight: normal;">{{ $collection->withdraw_amount / 100 }} টাকা</span></p>
                    </div>
                @empty
                    <p>কোনো উত্তোলনের তথ্য নেই।</p>
                @endforelse
            @endif
       </div>
    </div>


    
</body>
</html>