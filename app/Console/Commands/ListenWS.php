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
	protected $signature = 'ws:listen';

	/**
	 * Execute the console command.
	 */
	public function handle()
	{
		$ws = new WsServer(new Online());

		$server = IoServer::factory(new HttpServer($ws), 2007);

		$sigHandler = function ($sig) use ($server) {
			$server->loop->stop();
		};

		$this->trap(SIGTERM, $sigHandler);
		$this->trap(SIGINT, $sigHandler);
		$this->trap(SIGHUP, $sigHandler);

		echo 'WS server listening 2007 port';

		$server->run();

		return self::SUCCESS;
	}
}
