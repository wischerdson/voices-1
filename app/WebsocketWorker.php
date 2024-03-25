<?php

namespace App;

use Exception;
use Illuminate\Support\Facades\Log;
use Ratchet\ConnectionInterface;
use Ratchet\MessageComponentInterface;
use SplObjectStorage;

class WebsocketWorker implements MessageComponentInterface
{
	protected $clients;

	private int $writing = 0;

	public function __construct()
	{
		$this->clients = new SplObjectStorage();
	}

	public function onOpen(ConnectionInterface $conn)
	{
		$this->clients->attach($conn);

		$this->sendToAllConnectionsExceptCurrent($conn, 'online', count($this->clients));
	}

	public function onMessage(ConnectionInterface $from, $msg) {
		$jsonMsg = json_decode($msg);

		switch ($jsonMsg->type) {
			case 'online':
				$this->sendToCurrentConnection($from, 'online', count($this->clients));
				break;
			case 'writing_on':
				$this->writing++;
				$this->sendToAllConnectionsExceptCurrent($from, 'writing', $this->writing);
				break;
			case 'writing_off':
				$this->writing--;
				$this->sendToAllConnectionsExceptCurrent($from, 'writing', $this->writing);
				break;
		}
	}

	public function onClose(ConnectionInterface $conn) {
		$this->clients->detach($conn);

		$this->sendToAllConnections('online', count($this->clients));
	}

	public function onError(ConnectionInterface $conn, Exception $e) {
		Log::error($e->getMessage());

		$conn->close();
		$this->clients->detach($conn);
		$this->sendToAllConnections('online', count($this->clients));
	}

	private function sendToCurrentConnection(ConnectionInterface $currentConnection, string $type, mixed $payload)
	{
		$currentConnection->send($this->toJson($type, $payload));
	}

	private function sendToAllConnectionsExceptCurrent(ConnectionInterface $currentConnection, string $type, mixed $payload)
	{
		$json = $this->toJson($type, $payload);

		foreach ($this->clients as $client) {
			if ($currentConnection !== $client) {
				$client->send($json);
			}
		}
	}

	private function sendToAllConnections(string $type, mixed $payload)
	{
		$json = $this->toJson($type, $payload);

		foreach ($this->clients as $client) {
			$client->send($json);
		}
	}

	private function toJson(string $type, $payload)
	{
		return json_encode([
			'type' => $type,
			'payload' => $payload
		], JSON_THROW_ON_ERROR);
	}
}
