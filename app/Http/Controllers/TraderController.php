<?php

namespace App\Http\Controllers;

use App\Models\Trader;
use App\Models\Routing;
use Illuminate\Http\Request;
use Illuminate\Pagination\Paginator;

class TraderController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        if($request){
            $rows_per_page = $request-> rowsPerPage;
            $page = $request -> page;

            $site_type = $request->site_type;
            $company_name = $request->company_name;
            $routing_id = $request->routing_id;
            $prefecture = $request->prefecture;
            $mobilephone_number = $request->mobilephone_number;
            $telephone_number = $request->telephone_number;
            
            $traders = Trader::where(function ($query) use ($site_type, $company_name, $routing_id, $prefecture, $mobilephone_number, $telephone_number, $page, $rows_per_page) {
                if($site_type)
                   $query->where('site_type', 'LIKE', '%'.$site_type.'%');
                if($company_name)
                   $query->where('company_name', 'LIKE', '%'.$company_name.'%');
                if($routing_id && $routing_id != 0 )
                   $query->where('routing_id', $routing_id);
                if($prefecture && $prefecture != 'All')
                    $query->where('prefecture', $prefecture);
                if($mobilephone_number)
                    $query->where('mobilephone_number', 'LIKE', '%'.$mobilephone_number.'%');
                if($telephone_number)
                    $query->where('telephone_number', 'LIKE', '%'.$telephone_number.'%');
                if($page)
                    $query->skip($rows_per_page * $page);
            })->paginate($rows_per_page);

            return response()->json([
                'success' => true,
                'data' => $traders
            ]);
        
        }
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
        $trader = Trader::create($data);

        return response()->json([
            'success' => true,
            'data' => $trader,
            'message' => '業者を登録しました。'
        ]);
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\Trader  $trader
     * @return \Illuminate\Http\Response
     */
    public function show(Trader $trader)
    {
        
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\Trader  $trader
     * @return \Illuminate\Http\Response
     */
    public function edit(Trader $trader)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Trader  $trader
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Trader $trader)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\Trader  $trader
     * @return \Illuminate\Http\Response
     */
    public function destroy(Trader $trader)
    {
        $trader->delete();
        return response()->json([ 'success' => true ]);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function check(Request $request)
    {
        $traders = Trader::where('company_name', $request->company_name)
                           ->orWhere('telephone_number', $request->telephone_number)
                           ->orWhere('mobilephone_number', $request->telephone_number)
                           ->get();

        if(count($traders) > 0)
            return response()->json(['success' => false, 'data' => $traders]);
        else
            return response()->json(['success' => true, 'data' => $traders]);
    }

    /**
     * trader list update from CSV
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function addFromCsv(Request $request)
    {
        try{
            if (($open = fopen($request->file, "r"))) {
                while (($data = fgetcsv($open, 2000, ",")) !== FALSE) {
                    // $data = array_map("utf8_encode", $data);
                    $traders[] = $data;
                }
                fclose($open);
            }
        } catch(Exception $ex){
            return response()->json([
                'message' => $ex,
            ], 400);
        }

        array_shift($traders);
        $new_traders = [];
        if($traders){
            foreach ($traders as $trader) {
                $item = array(
                    'tid' => isset($trader[0]) ? $trader[0] : '',
                    'date' => isset($trader[1]) ? $trader[1] : '',
                    'site_type' => isset($trader[2]) ? $trader[2] : '',
                    'routing' => isset($trader[3]) ? $trader[3] : '',
                    'membership_type' => isset($trader[4]) ? $trader[4] : '',
                    'prefecture' => isset($trader[5]) ? $trader[5] : '',
                    'cell_content' => isset($trader[6]) ? $trader[6] : '',
                    'company_name' => isset($trader[7]) ? $trader[7] : '',
                    'first_representative' => isset($trader[8]) ? $trader[8] : '',
                    'correspondence_situation' => isset($trader[9]) ? $trader[9] : '',
                    'mobilephone_number' => isset($trader[10]) ? $trader[10] : '',
                    'telephone_number' => isset($trader[11]) ? $trader[11] : '',
                );
                array_push($new_traders, $item);
            }

            foreach ($new_traders as $item) {
                $trader_exist = Trader::where('tid', $item['tid'])->first();
                if($trader_exist == null) {
                    $routing_id = 0;
                    $prefecture = '';
                    $mobilephone_number = "";
                    $telephonephone_number = "";
                    if($item['routing']) {
                        $routing_item = Routing::where('path_name', $item['routing'])->first();
                        if($routing_item)
                            $routing_id = $routing_item['id'];
                    }
                    if($item['prefecture']) {
                        $prefecture = $item['prefecture'];
                    }
                    if($item['mobilephone_number']){
                        $mobilephone_number = str_replace('-', '', $item['mobilephone_number']);
                    }
                    if($item['telephone_number']){
                        $telephonephone_number = str_replace('-', '', $item['telephone_number']);
                    }
                    Trader::create([
                        'tid' =>$item['tid'], 
                        'date' =>$item['date'], 
                        'site_type' =>$item['site_type'], 
                        'routing_id' =>$routing_id, 
                        'membership_type' =>$item['membership_type'], 
                        'prefecture' =>$prefecture,
                        'cell_content' =>$item['cell_content'], 
                        'company_name' =>$item['company_name'], 
                        'first_representative' =>$item['first_representative'], 
                        'correspondence_situation' =>$item['correspondence_situation'], 
                        'mobilephone_number' =>$mobilephone_number,
                        'telephone_number' =>$telephonephone_number 
                    ]); 
                }
                else {
                    $routing_id = 0;
                    $prefecture = "";
                    $mobilephone_number = "";
                    $telephonephone_number = "";

                    if($item['routing']) {
                        $routing_item = Routing::where('path_name', $item['routing'])->first();
                        if($routing_item)
                            $routing_id = $routing_item['id'];
                    }
                    if($item['prefecture']) {
                        $prefecture = $item['prefecture'];
                    }
                    if($item['mobilephone_number']){
                        $mobilephone_number = str_replace('-', '', $item['mobilephone_number']);
                    }
                    if($item['telephone_number']){
                        $telephonephone_number = str_replace('-', '', $item['telephone_number']);
                    }
                    $trader_exist->update([
                        'date' =>$item['date'], 
                        'site_type' =>$item['site_type'], 
                        'routing_id' =>$routing_id, 
                        'membership_type' =>$item['membership_type'], 
                        'prefecture' =>$prefecture, 
                        'cell_content' =>$item['cell_content'], 
                        'company_name' =>$item['company_name'], 
                        'first_representative' =>$item['first_representative'], 
                        'correspondence_situation' =>$item['correspondence_situation'], 
                        'mobilephone_number' =>$mobilephone_number,
                        'telephone_number' =>$telephonephone_number 
                    ]);
                }
            }
            return response()->json([
                'success' => true,
                'message' => '正常に作成されました。'
            ], 200);
        }
        else {
            return response()->json([
                'success' => false,
                'message' => 'csv ファイルが空です。',
            ], 400);
        }
    }
}
