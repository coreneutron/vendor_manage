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
            $table->integer('tid')->nullable();
            $table->string('date')->nullable();
            $table->string('site_type')->nullable();
            $table->integer('routing_id')->nullable();
            $table->string('membership_type')->nullable();
            $table->string('prefecture')->nullable();
            $table->longtext('cell_content')->nullable();
            $table->string('company_name')->nullable();
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
