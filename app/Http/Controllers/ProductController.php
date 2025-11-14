<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\ProductUpdateLog;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class ProductController extends Controller
{
     public function createProduct()
    {
        $leanUser = request()->get('user');
        
        return Inertia::render('Admin/Products/CreateProduct', [
                'user' => $leanUser
            ]);
    }

    // store product
    public function storeProduct(Request $request){
        $leanUser = request()->get('user');
        // dd($request->all());
        
        $validatedData = $request->validate([
            'name' => 'required|string|max:255',
            'supplier_name' => 'required|string',
            'quantity' => 'required|numeric|min:0', 
            'price_per_product' => 'required|numeric|min:0',
        ]);

        $product = new Product();
        $product->name = $validatedData['name'];
        $product->supplier_name = $validatedData['supplier_name'];
        $product->initial_quantity = $validatedData['quantity'];
        $product->current_quantity = $validatedData['quantity'];
        $product->buying_price_per_product = $validatedData['price_per_product'];
        $product->save();

        return redirect()->route('admin.createProduct')->with('success', 'Product created successfully.');
    }

    // show all products
    public function showProducts(){
        $leanUser = request()->get('user');
        
        $search = request()->query('search');
        $products = Product::orderBy('created_at', 'desc')->paginate(100);
        if ($search) {
            $products = Product::where('name', 'like', "%{$search}%")
                ->orWhere('supplier_name', 'like', "%{$search}%")
                ->orWhere('id', 'like', "%{$search}%")
                ->orderBy('created_at', 'desc')
                ->paginate(100);
        }
        return Inertia::render('Admin/Products/ShowAllProducts', [
            'user' => $leanUser,
            'products' => $products
        ]);
    }

    // show product by id
    public function showProductById($id){
       $leanUser = request()->get('user');
         $product = Product::find($id);
        // get all the update logs for this product in descending order of creation witht the user name who made the update my field name is updating_user_id which is a foreign key to users table
        $update_logs = ProductUpdateLog::where('product_id', $id)->orderBy('created_at', 'desc')->get();
        return Inertia::render('Admin/Products/ShowProductDetails', [
                'user' => $leanUser, 
                'product' => $product,
                'update_logs' => $update_logs
            ]);
    }

    // show available products
    public function showAvailableProducts(){
        $leanUser = request()->get('user');

        $search = request()->query('search');
        $availableProducts = Product::where('is_available', true)->orderBy('created_at', 'desc');

        if ($search) {
            $availableProducts = $availableProducts->where('name', 'like', "%{$search}%")
                ->orWhere('supplier_name', 'like', "%{$search}%")
                ->orWhere('id', 'like', "%{$search}%")->orderBy('created_at', 'desc');
        }

        $availableProducts = $availableProducts->paginate(100);
        return Inertia::render('Admin/Products/AvailableProducts', [
                'user' => $leanUser, 
                'products' => $availableProducts

            ]);
    }

    // show unavailable products
    public function showUnavailableProducts(){
        $leanUser = request()->get('user');
        
        $search = request()->query('search');
        $unavailableProducts = Product::where('is_available', false)->orderBy('created_at', 'desc');

        if ($search) {
            $unavailableProducts = Product::where('is_available', false);
            $unavailableProducts = $unavailableProducts->where('name', 'like', "%{$search}%")
                ->orWhere('supplier_name', 'like', "%{$search}%")
                ->orWhere('id', 'like', "%{$search}%")->orderBy('created_at', 'desc');
        }

        $unavailableProducts = $unavailableProducts->paginate(100);
        return Inertia::render('Admin/Products/UnAvailableProducts', [
                'user' => $leanUser, 
                'products' => $unavailableProducts

            ]);
    }

    public function showUpdateProductPage($id){
        $leanUser = request()->get('user');
        $product = Product::find($id);
        return Inertia::render('Admin/Products/UpdateProduct', [
                'user' => $leanUser, 
                'product' => $product

            ]);
    }

    public function updateProduct(Request $request, $id){
        
        $validatedData = $request->validate([
            'name' => 'required|string|max:255',
            'supplier_name' => 'required|string',
            'quantity' => 'required|numeric|min:0',
            'current_quantity' => 'required|numeric|min:0',
            'price_per_product' => 'required|numeric|min:0',
        ]);

        $productBeforeUpdate = Product::find($id);

        // saving the before state of update and update state of update into the product_update_logs table with the help of ProductUpdateLog model
        $log = new ProductUpdateLog();
        $log->product_id = $id;
        $log->name_before = $productBeforeUpdate->name;
        $log->name_after = $validatedData['name'];
        $log->supplier_name_before = $productBeforeUpdate->supplier_name;
        $log->supplier_name_after = $validatedData['supplier_name'];
        $log->initial_quantity_before = $productBeforeUpdate->initial_quantity;
        $log->initial_quantity_after = $validatedData['quantity'];
        $log->current_quantity_before = $productBeforeUpdate->current_quantity;
        $log->current_quantity_after = $validatedData['current_quantity'];
        $log->buying_price_per_product_before = $productBeforeUpdate->buying_price_per_product;
        $log->buying_price_per_product_after = $validatedData['price_per_product'];
        $log->updating_user_id = Auth::id();
        $log->save();    

        // updating the product
        $product = Product::find($id);
        $product->name = $validatedData['name'];
        $product->supplier_name = $validatedData['supplier_name'];
        $product->initial_quantity = $validatedData['quantity'];
        $product->current_quantity = $validatedData['current_quantity'];
        $product->buying_price_per_product = $validatedData['price_per_product'];
        $product->save();

        // get all the update logs for this product in descending order of creation
        $update_logs = ProductUpdateLog::where('product_id', $id)->orderBy('created_at', 'desc')->get();
        return redirect()->route('admin.showProductById', $id)->with('update_history', $update_logs)->with('success', 'Product updated successfully.');
    }

    // toggle product status
    public function toggleProductStatus($id){
        $product = Product::find($id);
        if ($product) {
            $product->is_available = !$product->is_available;
            $product->save();
            return redirect()->back()->with('success', 'Product availability status updated successfully.');
        } else {
            return redirect()->back()->with('error', 'Product not found.');
        }
    }
}
