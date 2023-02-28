<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ClipboardSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('clipboards')->insert(
            [
                [
                    'column_name' => 'ID',
                    'column_number' => 0
                ], 
                [
                    'column_name' => '日付',
                    'column_number' => 1
                ], 
                [
                    'column_name' => 'サイト種別',
                    'column_number' => 2
                ], 
                [
                    'column_name' => '経路',
                    'column_number' => 3
                ], 
                [
                    'column_name' => '社名',
                    'column_number' => 4
                ], 
                [
                    'column_name' => '電話番号',
                    'column_number' => 5
                ], 
                [
                    'column_name' => '都道府県',
                    'column_number' => 6
                ], 
                
            ]
        );
    }
}
