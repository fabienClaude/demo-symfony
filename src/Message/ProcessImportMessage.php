<?php

namespace App\Message;

final class ProcessImportMessage
{
    public function __construct(
        private readonly int $importId,
    ) {
    }

    public function getImportId(): int
    {
        return $this->importId;
    }
}
