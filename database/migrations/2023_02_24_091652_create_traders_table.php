<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateTradersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('traders', function (Blueprint $table) {
            $table->id();
            $table->string('date');
            $table->string('company_name');
            $table->integer('routing_id')->nullable();
            $table->integer('prefecture_id')->nullable();
            $table->string('site_type')->nullable();
            $table->string('membership_type')->nullable();
            $table->string('cell_content')->nullable();
            $table->string('first_representative')->nullable();
            $table->string('correspondence_situation')->nullable();
            $table->string('mobilephone_number')->nullable();
            $table->string('telephone_number')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('traders');
    }
}
