<?php

use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', function () {
    return view('welcome');
});

Route::get('/traders', function () {
    return view('welcome');
});

Route::get('/routing', function () {
    return view('welcome');
});

Route::get('/clipboard', function () {
    return view('welcome');
});

Route::get('/users', function () {
    return view('welcome');
});