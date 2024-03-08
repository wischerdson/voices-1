<?php

namespace App\Ratchet;

use Exception;
use Illuminate\Support\Facades\Redis;
use Ratchet\ConnectionInterface;
use Ratchet\MessageComponentInterface;

class Online implements MessageComponentInterface
{
	protected $clients;

	public function __construct()
	{
		$this->clients = new \SplObjectStorage;
	}

	public function onOpen(ConnectionInterface $conn)
	{
		$this->clients->attach($conn);

		$payload = [
			'online' => count($this->clients)
		];
		$json = ['type' => 'online', 'payload' => $payload];

		foreach ($this->clients as $client) {
			$client->send(json_encode($json, JSON_THROW_ON_ERROR));
		}
	}

	public function onMessage(ConnectionInterface $from, $msg) {
		$jsonMsg = json_decode($msg);

		$payload = [
			'online' => count($this->clients)
		];
		$json = ['type' => 'online', 'payload' => $payload];

		if ($jsonMsg->action === 'get_online') {
			$from->send(json_encode($json, JSON_THROW_ON_ERROR));

			return;
		}

		foreach ($this->clients as $client) {
			if ($from !== $client) {
				$client->send($msg);
			}
		}
	}

	public function onClose(ConnectionInterface $conn) {
		$this->clients->detach($conn);

		$payload = [
			'online' => count($this->clients)
		];
		$json = ['type' => 'online', 'payload' => $payload];

		foreach ($this->clients as $client) {
			$client->send(json_encode($json, JSON_THROW_ON_ERROR));
		}
	}

	public function onError(ConnectionInterface $conn, Exception $e) {
		echo "An error has occurred: {$e->getMessage()}\n";

		$conn->close();
	}
}
