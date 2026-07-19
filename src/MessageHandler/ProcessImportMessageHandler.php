<?php

namespace App\MessageHandler;

use App\Message\ProcessImportMessage;
use App\Service\ImportService;
use Symfony\Component\Messenger\Attribute\AsMessageHandler;

#[AsMessageHandler]
final class ProcessImportMessageHandler
{
    public function __construct(
        private readonly ImportService $importService,
    ) {
    }

    public function __invoke(ProcessImportMessage $message): void
    {
        $this->importService->processFile($message->getImportId());
    }
}
