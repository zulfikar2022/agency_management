<!DOCTYPE html>
<html lang="bn">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>সামগ্রিক সংক্ষিপ্ত রিপোর্ট</title>

   


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
        <h1 class="title"> সামগ্রিক সংক্ষিপ্ত রিপোর্ট</h1>
        @if ($start_date == $end_date)
        <!-- use Carbon and make the date as 22 December 2025 -->
        <p style="text-align: center; font-weight: bold;">রিপোর্টের সময়কাল: {{ \Carbon\Carbon::parse($start_date)->format('d F Y') }} </p>
        @else
        <p style="text-align: center; font-weight: bold;">রিপোর্টের সময়কাল: {{ \Carbon\Carbon::parse($start_date)->format('d F Y') }} থেকে {{ \Carbon\Carbon::parse($end_date)->format('d F Y') }} </p>
        @endif
        <p style="font-weight: bold; text-align: center;">রিপোর্ট তৈরির তারিখঃ    <span style="font-weight: normal;">{{ \Carbon\Carbon::now()->format('d F Y') }}</span></p>
        <div style="display: flex; justify-content: space-around; margin-bottom: 20px;">
            <div>
                <p style="font-weight:bold">ঋণের কিস্তি বাবদ মোট সংগ্রহযোগ্যঃ  <span style="font-weight: normal;">{{ number_format($total_loan_collectable/100, 2)}} টাকা</span> </p>
               
            </div>
            <div>
                <p style="font-weight:bold">পণ্যের মূল্য বাবদ মোট সংগ্রহযোগ্যঃ <span style="font-weight: normal;">{{ number_format($total_product_money_collectable, 2)}} টাকা</span> </p>
                
            </div>
        </div>
       <div style="display: grid; grid-template-columns: 1fr 1fr">
            <div>
                <div>
                    <p style="font-weight: bold;">মোট সংগৃহীত ভর্তি ফিঃ <span style="font-weight: normal;">{{ $total_admission_fee }} টাকা</span> </p>
                </div>
                <div>
                    <p style="font-weight: bold;">মোট সংগৃহীত ঋণ ফিঃ <span style="font-weight: normal;">{{ $total_loan_fee }} টাকা</span> </p>
                </div>
                 <div>
                    <p style="font-weight: bold;">মোট শেয়ার জমাঃ  <span style="font-weight: normal;">{{ $total_share_money }} টাকা</span> </p>
                </div>
                 <div>
                    <p style="font-weight: bold;">মোট সঞ্চয় সংগ্রহঃ   <span style="font-weight: normal;">{{ $total_deposit_collection }} টাকা</span> </p>
                </div>
                    <div>
                    <p style="font-weight: bold;">মোট ঋণের কিস্তি সংগ্রহঃ   <span style="font-weight: normal;">{{ $total_loan_collection }} টাকা</span> </p>
                </div>
                <div>
                    <p style="font-weight: bold;">পণ্য বিক্রি বাবদ মোট ডাউনপেমেন্ট সংগ্রহঃ   <span style="font-weight: normal;">{{ $total_downpayments }} টাকা</span> </p>
                </div>
                <div>
                    <p style="font-weight: bold;">পণ্যের মূল্য বাবদ মোট কিস্তি সংগ্রহঃ   <span style="font-weight: normal;">{{ $total_product_money_collections }} টাকা</span> </p>
                </div>
            </div>
                 
            <div>
                <div>
                    <p style="font-weight:bold">মোট লিখিত খরচঃ <span style="font-weight: normal;">{{ $total_costs }} টাকা</span></p>
                </div>
                 <div>
                    <p style="font-weight:bold">মোট প্রদানকৃত ঋণঃ <span style="font-weight: normal;">{{ $total_provided_loans }} টাকা</span></p>
                </div>
                <div>
                    <p style="font-weight:bold">মোট উত্তোলনঃ <span style="font-weight: normal;">{{ $total_withdraws }} টাকা</span></p>
                </div>
                <div>
                    <p style="font-weight:bold">সঞ্চয় একাউন্ট ক্লোজ বাবদ মোট প্রদানকৃত অর্থঃ  <span style="font-weight: normal;">{{ $total_deposit_dismissals_paid }}টাকা</span></p>
                </div>
                <div>
                    <p style="font-weight:bold">মূল একাউন্ট ক্লোজ বাবদ মোট প্রদানকৃত শেয়ার টাকাঃ  <span style="font-weight: normal;">{{ $total_account_dismissals_provided_share_money }}টাকা</span></p>
                </div>
            </div>
        </div>

        
           
        
</body>
</html>