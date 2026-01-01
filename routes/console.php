<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

Schedule::command('app:task-one-command')->dailyAt('00:00');
Schedule::command('app:task-two-command')->dailyAt('00:02');
Schedule::command('app:task-three-command')->dailyAt('00:02');