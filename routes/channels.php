<?php

use Illuminate\Support\Facades\Broadcast;

Broadcast::channel('messages', fn () => true);
