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

    // toggle activation status of a user 
    public function toggleActivationStatus(User $user){
           
        if($user->is_super_admin){
            return redirect()->back()->with('error', 'Cannot change activation status of a Super Admin user.');
        }

        if($user->is_activated){
            $user->is_activated = false;
        } else {
            $user->is_activated = true;
        }

        $user->save();
        return redirect()->back()->with('success', 'User activation status toggled successfully.');
    }

    // toggle admin status of a user
    public function toggleAdminStatus(User $user){
        if($user->is_super_admin){
            return redirect()->back()->with('error', 'Cannot change admin status of a Super Admin user.');
        }

        if($user->is_employee){
            return redirect()->back()->with('error', 'Cannot change admin status of an Employee user.');
        }

        if($user->is_admin){
            $user->is_admin = false;
        } else {
            $user->is_admin = true;
        }

        $user->save();
        return redirect()->back()->with('success', 'User admin status toggled successfully.');
    }

    // toggle employee status of a user
    public function toggleEmployeeStatus(User $user){
        if($user->is_super_admin){
            return redirect()->back()->with('error', 'Cannot change employee status of a Super Admin user.');
        }

        if($user->is_admin){
            return redirect()->back()->with('error', 'Cannot change employee status of an Admin user.');
        }

        if($user->is_employee){
            $user->is_employee = false;
        } else {
            $user->is_employee = true;
        }

        $user->save();
        return redirect()->back()->with('success', 'User employee status toggled successfully.');
    }

    public function showRegisterForm(){
        return Inertia::render('SuperAdmin/SuperAdminRegisterUser');
    }
    // restore a deleted user;

    // make a user as admin

    // make a user as employee

    // stop admin previlege

    // stop employee previlege

    

}