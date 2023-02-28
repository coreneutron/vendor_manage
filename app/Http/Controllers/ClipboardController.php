<?php

namespace App\Http\Controllers;

use App\Models\Clipboard;
use Illuminate\Http\Request;

class ClipboardController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $clipboards = Clipboard::all();
		return response()->json([
            'success' => true,
            'data' => $clipboards
        ]);
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\Clipboard  $clipboard
     * @return \Illuminate\Http\Response
     */
    public function show(Clipboard $clipboard)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\Clipboard  $clipboard
     * @return \Illuminate\Http\Response
     */
    public function edit(Clipboard $clipboard)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Clipboard  $clipboard
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Clipboard $clipboard)
    {
        $count = Clipboard::where('column_number', $request->column_number)->count();
        if($count > 0)
            return response()->json([ 'success' => false,  'message' => 'column already exists!'  ]);
        else {
            $clipboard->update($request->all());
            return response()->json([
                'success' => true,
                'data' => $clipboard
            ]);
        }
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\Clipboard  $clipboard
     * @return \Illuminate\Http\Response
     */
    public function destroy(Clipboard $clipboard)
    {
        //
    }
}
