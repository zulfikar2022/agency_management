<?php
namespace App\Http\Controllers\SuperAdminController;

use App\Models\User;
use Inertia\Inertia;

class SuperAdminController
{
    // see all users (not deleted users);

    public function allUsers()
    {
        // dd("Inside all users");
        $users = User::where('is_deleted', false)->get();
        return Inertia::render('SuperAdmin/SuperAdminAllMembers', ['users' => $users]);
    }

    // see all deleted users

    public function allDeletedUsers()
    {
        // dd("Inside all deleted users");
        $deletedUsers = User::where('is_deleted', true)->get();
        return Inertia::render('SuperAdmin/SuperAdminDeletedMembers', ['users' => $deletedUsers]);
    }


    // delete a user (soft delete);
    public function toggleDeleteStatus(User $user)
    {
        if($user->is_super_admin){
            return redirect()->back()->with('error', 'Cannot delete a Super Admin user.');
        }

        if($user->is_deleted){
            $user->is_deleted = false;
        } else {
            $user->is_deleted = true;
        }

        $user->save();
        return redirect()->back()->with('success', 'User delete status toggled successfully.');
        
    }

    // restore a deleted user;

    // make a user as admin

    // make a user as employee

    // stop admin previlege

    // stop employee previlege

    

}