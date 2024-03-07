<?php

namespace App\Console\Commands;

use App\Ratchet\Online;
use Illuminate\Console\Command;
use Ratchet\Http\HttpServer;
use Ratchet\Server\IoServer;
use Ratchet\WebSocket\WsServer;

class ListenWS extends Command
{
	/**
	 * The name and signature of the console command.
	 *
	 * @var string
	 */
	protected $signature = 'listen-ws';

	/**
	 * Execute the console command.
	 */
	public function handle()
	{
		$ws = new WsServer(new Online());

		$server = IoServer::factory(new Online(), 1999);
		$server->run();
	}
}
