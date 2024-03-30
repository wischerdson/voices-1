<?php

namespace App;

use Exception;
use Illuminate\Support\Facades\Log;
use Ratchet\ConnectionInterface;
use Ratchet\MessageComponentInterface;
use SplObjectStorage;

class WebsocketWorker implements MessageComponentInterface
{
	protected SplObjectStorage $connections;

	protected array $clients = [];

	private int $writing = 0;

	public function __construct()
	{
		$this->connections = new SplObjectStorage();
	}

	public function onOpen(ConnectionInterface $conn)
	{
		$this->connections->attach($conn);

		$clientId = $this->getClientId($conn);

		if (isset($this->clients[$clientId])) {
			$this->clients[$clientId]++;
		} else {
			$this->clients[$clientId] = 1;
			$this->sendToAllConnectionsExceptCurrent($conn, 'online', count($this->clients));
		}
	}

	public function onMessage(ConnectionInterface $from, $msg) {
		$jsonMsg = json_decode($msg);

		switch ($jsonMsg->type) {
			case 'online':
				$this->sendToCurrentConnection($from, 'online', count($this->clients));
				break;
			case 'writing':
				$this->writing += $jsonMsg->payload ? 1 : -1;
				$this->sendToAllConnectionsExceptCurrent($from, 'writing', $this->writing);
				break;
		}
	}

	public function onClose(ConnectionInterface $conn) {
		$this->detach($conn);
	}

	public function onError(ConnectionInterface $conn, Exception $e) {
		Log::error($e->getMessage());
		$this->detach($conn);
	}

	private function detach(ConnectionInterface $connection)
	{
		$connection->close();
		$this->connections->detach($connection);

		$clientId = $this->getClientId($connection);

		if (isset($this->clients[$clientId])) {
			$this->clients[$clientId]--;

			if ($this->clients[$clientId] <= 0) {
				unset($this->clients[$clientId]);
				$this->sendToAllConnections('online', count($this->clients));
			}
		}
	}

	private function getClientId(ConnectionInterface $connection)
	{
		$url = $connection->httpRequest->getUri()->getPath();

		return ltrim($url, '/client/');
	}

	private function sendToCurrentConnection(ConnectionInterface $currentConnection, string $type, mixed $payload)
	{
		$currentConnection->send($this->toJson($type, $payload));
	}

	private function sendToAllConnectionsExceptCurrent(ConnectionInterface $currentConnection, string $type, mixed $payload)
	{
		$json = $this->toJson($type, $payload);

		foreach ($this->connections as $conn) {
			if ($currentConnection !== $conn) {
				$conn->send($json);
			}
		}
	}

	private function sendToAllConnections(string $type, mixed $payload)
	{
		$json = $this->toJson($type, $payload);

		foreach ($this->connections as $conn) {
			$conn->send($json);
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
