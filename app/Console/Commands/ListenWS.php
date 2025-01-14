<?php

namespace App\Console\Commands;

use App\WebsocketWorker;
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
	protected $signature = 'ws:listen';

	/**
	 * Execute the console command.
	 */
	public function handle()
	{
		$PORT = env('RATCHET_PORT', 2008);

		echo "WS server listening $PORT port\n";

		$ws = new WsServer(new WebsocketWorker());

		$server = IoServer::factory(new HttpServer($ws), $PORT);

		$sigHandler = function ($sig) use ($server) {
			$server->loop->stop();
		};

		$this->trap(SIGTERM, $sigHandler);
		$this->trap(SIGINT, $sigHandler);
		$this->trap(SIGHUP, $sigHandler);

		$server->run();

		return self::SUCCESS;
	}
}
