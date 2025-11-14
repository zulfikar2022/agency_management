<?php 

namespace App\Http\Controllers\AdminController;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\ProductUpdateLog;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AdminController extends Controller
{
     public function dashboard(){
        $leanUser = request()->get('user');
        return Inertia::render('Admin/Dashboard', [
            'user' => $leanUser
        ]);
    }

    // create product page
   
}
