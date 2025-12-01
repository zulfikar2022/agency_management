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
    <!-- <div>
        <img src="{{ asset('images/organization_logo.png') }}" alt="Organization Logo">
    </div> -->
      <div>
        <p class="" style="text-align: center; font-weight:bold ; font-size: large;">ভেলাজান কৃষি সমবায় সমিতি লিমিটেড, ভেলাজান বাজার, ঠাকুরগাঁও সদর, ঠাকুরগাঁও </p>
    </div>
    <h1 class="title">কাস্টমার রিপোর্ট</h1>

    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 30px;">
         <div>
            <div>
                <p style="font-weight: bold; margin-bottom: 0px;">নামঃ <span style="font-weight: normal;">{{ $customer['name'] ?? 'নামবিহীন' }}</span> </p>
            </div>
            <div>
                <p style="font-weight: bold; margin-bottom: 0px;">ফোন নাম্বারঃ <span style="font-weight: normal;">{{ $customer['phone_number'] ?? 'ফোন নাম্বার নেই' }}</span></p>
            </div>
            <div>
                <p style="font-weight: bold; margin-bottom: 0px;">ঠিকানাঃ</p>
                <p>{{ $customer['address'] ?? 'ঠিকানা নেই' }}</p>
            </div>
               <div>
                <p style="font-weight: bold;">টাকা সংগ্রহের দিনঃ <span style="font-weight: normal;">{{ $customer['collection_day'] ?? 'টাকা সংগ্রহের দিন নেই' }}</span></p>
                <p></p>
            </div>
         </div>
            <div>
                <div>
                    <p style="font-weight: bold;">মোট মূল্যঃ <span style="font-weight: normal;">{{ $total_payable_price }} টাকা</span> </p>
                </div>
                <div>
                    <p style="font-weight: bold;">মোট ডাউনপেমেন্টঃ <span style="font-weight: normal;">{{ $total_downpayment }} টাকা</span> </p>
                </div>
                
                <div>
                    <p style="font-weight: bold;">কিস্তিতে মোট পরিশোধঃ <span style="font-weight: normal;">{{ $total_collected_by_kisti }} টাকা</span> </p>
                </div>

                  <div>
                    <p style="font-weight: bold;">সাপ্তাহিক মোট পরিশোধযোগ্যঃ  <span style="font-weight: normal;">{{ $total_weekly_payable }} টাকা</span> </p>
                </div>

                   <div>
                    <p style="font-weight: bold;">মোট বাকি আছেঃ   <span style="font-weight: normal;">{{ $total_remaining_payable }} টাকা</span> </p>
                </div>
                
                <!-- total_weekly_payable -->
            </div>
    </div>
    <div>
        <h1 class="title">ক্রয়কৃত পণ্যের তালিকা</h1>
        <div>
            @foreach ($purchased_products as $product)
                <div style="border-bottom:1px solid grey; padding: 10px; margin-bottom: 10px; display: grid; grid-template-columns: repeat(5, 1fr); gap: 10px;">
                   <div>
                       <p style="font-weight: bold; padding: 0px;">পণ্যের নামঃ </p>
                       <p style="font-weight: normal; padding: 0px;">{{ $product['product']->name ?? 'নামবিহীন পণ্য' }}</p>
                   </div>
                   <div>
                       <p style="font-weight: bold; padding: 0px;">ক্রয়কৃত পরিমাণঃ  </p>
                       <p style="font-weight: normal; padding: 0px;">{{ $product->quantity ?? '0' }}টি</p>
                   </div>
                   <div>
                       <p style="font-weight: bold; padding: 0px;">মোট মূল্যঃ   </p>
                       <p style="font-weight: normal; padding: 0px;">{{ $product->total_payable_price ?? '0' }} টাকা</p>
                   </div>
                     <div>
                       <p style="font-weight: bold; padding: 0px;">সাপ্তাহিক কিস্তিঃ </p>
                       <p style="font-weight: normal; padding: 0px;">{{ $product->weekly_payable_price ?? '0' }} টাকা</p>
                   </div>
                     <div>
                       <p style="font-weight: bold; padding: 0px;">বাকি আছেঃ  </p>
                       <p style="font-weight: normal; padding: 0px;">{{ $product->remaining_payable_price ?? '0' }} টাকা</p>
                   </div>
                </div>
            
            @endforeach
        </div>
        <div>
            <h1 class="title">কিস্তির তালিকা</h1>
        </div>
        <div>
            @foreach ($collections as $key => $collection)
                <div style="border-bottom:1px solid grey; padding: 10px; margin-bottom: 10px; display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px;">
                   <div>
                       <p style="font-weight: bold; padding: 0px;">সংগ্রহের তারিখঃ </p>
                       <p style="font-weight: normal; padding: 0px;">{{ date('j F Y (l)', strtotime($key)) }}</p>
                   </div>
                   <div>
                       <p style="font-weight: bold; padding: 0px;">সংগ্রহযোগ্য পরিমাণঃ  </p>
                       <p style="font-weight: normal; padding: 0px;">{{ $collection['collectable_amount'] ?? '0' }} টাকা</p>
                   </div>
                   <div>
                       <p style="font-weight: bold; padding: 0px;">সংগ্রহকৃত পরিমাণঃ   </p>
                       <p style="font-weight: normal; padding: 0px;">{{ $collection['collected_amount'] ?? '0' }} টাকা</p>
                   </div>
                </div>
            
            @endforeach
        </div>
    </div>
    
    <!-- total_remaining_payable -->
    
</body>
</html>