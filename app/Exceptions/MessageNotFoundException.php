<?php

namespace App\Exceptions;

class MessageNotFoundException extends BadRequestException
{
	public int $statusCode = 404;
}
