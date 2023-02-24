<?php

namespace App\Http\Controllers;

use App\Models\Routing;
use Illuminate\Http\Request;

class RoutingController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $routings = Routing::orderBy('display_order', 'ASC')->get();
        return response()->json([
            'success' => true,
            'data' => $routings
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
        $data = $request->data;
        $routing = Routing::create($data);

        return response()->json([
            'success' => true,
            'data' => $routing,
            'message' => '顧客情報を追加しました。'
        ]);
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\Routing  $routing
     * @return \Illuminate\Http\Response
     */
    public function show(Routing $routing)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\Routing  $routing
     * @return \Illuminate\Http\Response
     */
    public function edit(Routing $routing)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Routing  $routing
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Routing $routing)
    {
        $routing->update($request->data);

        return response()->json([
            'success' => true,
            'data' => $routing,
            'message' => '顧客情報を更新しました。'
        ]);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\Routing  $routing
     * @return \Illuminate\Http\Response
     */
    public function destroy(Routing $routing)
    {
        $routing->delete();
        return response()->json([
            'success' => true,
            'message' => '顧客情報を削除しました。'
        ]);
    }
}
