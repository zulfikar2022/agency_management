<?php 

namespace App\Http\Controllers\AdminController;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AdminController extends Controller
{
     public function dashboard(){
        
        $user = Auth::guard('web')->user();
        
        if($user && $user['is_activated'] && $user['is_admin'] && !$user['is_deleted']) {
            $leanUser = User::getLeanUser($user->email);
        
            return Inertia::render('Admin/Dashboard', [
                'user' => $leanUser
            ]);
        } else {
            return redirect()->route('login');
        }
    }

    // create product page
    public function createProduct()
    {
        $user = Auth::guard('web')->user();
        
        
        if($user && $user['is_activated'] && $user['is_admin'] && !$user['is_deleted']) {
            $leanUser = User::getLeanUser($user->email);
            // dd("before return");

            return Inertia::render('Admin/Products/CreateProduct', [
                'user' => $leanUser
            ]);
        } else {
            return redirect()->route('login');
        }
    }

    // store product
    public function storeProduct(Request $request){}

    // show all products
    public function showProducts(){
        $user = Auth::guard('web')->user();
        
         if($user && $user['is_activated'] && $user['is_admin'] && !$user['is_deleted']) {
            $leanUser = User::getLeanUser($user->email);
            // dd("before return");
            $products = Product::paginate(100);

            return Inertia::render('Admin/Products/ShowAllProducts', [
                'user' => $leanUser, 
                'products' => $products

            ]);
        } else {
            return redirect()->route('login');
        }       
    }

    // show product by id
    public function showProductById($id){
        $user = Auth::guard('web')->user();
         if($user && $user['is_activated'] && $user['is_admin'] && !$user['is_deleted']) {
            $leanUser = User::getLeanUser($user->email);
            $product = Product::find($id);

            return Inertia::render('Admin/Products/ShowProductDetails', [
                'user' => $leanUser, 
                'product' => $product

            ]);
        } else {
            return redirect()->route('login');
        } 
    }

    // show available products
    public function showAvailableProducts(){
         $user = Auth::guard('web')->user();
        
         if($user && $user['is_activated'] && $user['is_admin'] && !$user['is_deleted']) {
            $leanUser = User::getLeanUser($user->email);
            // dd("before return");
            $availableProducts = Product::where('is_available', true)->paginate(100);

            return Inertia::render('Admin/Products/AvailableProducts', [
                'user' => $leanUser, 
                'products' => $availableProducts

            ]);
        } else {
            return redirect()->route('login');
        }  
    }

    // show unavailable products
    public function showUnavailableProducts(){
         $user = Auth::guard('web')->user();
        
         if($user && $user['is_activated'] && $user['is_admin'] && !$user['is_deleted']) {
            $leanUser = User::getLeanUser($user->email);
            
            $unavailableProducts = Product::where('is_available', false)->paginate(100);

            return Inertia::render('Admin/Products/UnavailableProducts', [
                'user' => $leanUser, 
                'products' => $unavailableProducts

            ]);
        } else {
            return redirect()->route('login');
        }  
    }
}
