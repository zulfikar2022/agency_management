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
        $leanUser = request()->get('user');
        return Inertia::render('Admin/Dashboard', [
            'user' => $leanUser
        ]);
    }

    // create product page
    public function createProduct()
    {
        $leanUser = request()->get('user');
        
        return Inertia::render('Admin/Products/CreateProduct', [
                'user' => $leanUser
            ]);
    }

    // store product
    public function storeProduct(Request $request){}

    // show all products
    public function showProducts(){
        $leanUser = request()->get('user');
        $products = Product::paginate(100);
          return Inertia::render('Admin/Products/ShowAllProducts', [
                'user' => $leanUser, 
                'products' => $products
            ]);      
    }

    // show product by id
    public function showProductById($id){
       $leanUser = request()->get('user');
         $product = Product::find($id);
        return Inertia::render('Admin/Products/ShowProductDetails', [
                'user' => $leanUser, 
                'product' => $product

            ]);
    }

    // show available products
    public function showAvailableProducts(){
        $leanUser = request()->get('user');
        $availableProducts = Product::where('is_available', true)->paginate(100); 
        return Inertia::render('Admin/Products/AvailableProducts', [
                'user' => $leanUser, 
                'products' => $availableProducts

            ]);
    }

    // show unavailable products
    public function showUnavailableProducts(){
        $leanUser = request()->get('user');
        $unavailableProducts = Product::where('is_available', false)->paginate(100);
        
        return Inertia::render('Admin/Products/UnAvailableProducts', [
                'user' => $leanUser, 
                'products' => $unavailableProducts

            ]);
    }
}
