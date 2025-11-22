<!DOCTYPE html>
<html lang="bn">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>কাস্টমার রিপোর্ট</title>

   


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
</head>
<body>
    <h1 class="title">কাস্টমার রিপোর্ট</h1>

    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
         <div>
            <div>
                <p style="font-weight: bold;">নামঃ</p>
                <p>{{ $customer['name'] ?? 'নামবিহীন' }}</p>
            </div>
            <div>
                <p style="font-weight: bold;">ফোন নাম্বারঃ</p>
                <p>{{ $customer['phone_number'] ?? 'ফোন নাম্বার নেই' }}</p>
            </div>
            <div>
                <p style="font-weight: bold;">ঠিকানাঃ</p>
                <p>{{ $customer['address'] ?? 'ঠিকানা নেই' }}</p>
            </div>
               <div>
                <p style="font-weight: bold;">টাকা সংগ্রহের দিনঃ</p>
                <p>{{ $customer['collection_date'] ?? 'টাকা সংগ্রহের দিন নেই' }}</p>
            </div>
         </div>
            <div>
                <div><p style="font-weight: bold;">মোট মূল্যঃ </p>
                    <p>{{ $customer['total_payable_price'] ?? '0' }} টাকা</p>
            </div>
            </div>
         <div>

         </div>
    </div>
    
    
    
</body>
</html>