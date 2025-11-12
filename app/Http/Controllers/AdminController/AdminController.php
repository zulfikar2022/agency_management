<?php 

namespace App\Http\Controllers\AdminController;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
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
}