<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::get('persona', function () {
    return Inertia::render('persona/dashboard');
})->name('persona.home');

Route::get('empresa', function () {
    return Inertia::render('empresa/dashboard');
})->name('empresa.home');

Route::get('admin', function () {
    return Inertia::render('admin/dashboard');
})->name('admin.home');

Route::middleware(['auth'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
