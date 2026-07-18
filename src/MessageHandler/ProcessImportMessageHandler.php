<?php
namespace App\MessageHandler;

use App\Message\ProcessImportMessage;
use App\Repository\ShopImportRepository;
use Psr\Log\LoggerInterface;
use Symfony\Component\Messenger\Attribute\AsMessageHandler;
use Symfony\Component\DependencyInjection\Attribute\Autowire;

#[AsMessageHandler]
final class ProcessImportMessageHandler
{
    public function __construct(
        #[Autowire('%kernel.project_dir%')]
        private readonly string $baseDir,
        private readonly ShopImportRepository $importRepository,
        private readonly LoggerInterface $logger,
    ) {}

    public function __invoke(ProcessImportMessage $message): void
    {
        $em = $this->importRepository->getEntityManager();
        $import = $this->importRepository->find($message->getImportId());

        if (!$import) {
            $this->logger->warning('Import introuvable', ['id' => $message->getImportId()]);
            return;
        }

        $import->setState('process');
        $em->flush();
        $this->importRepository->save($import, flush: true);

        try {
            $this->processFile($import);
            $import->setState('success');
            $em->flush();
        } catch (\Throwable $e) {
            $import->setState('fail');
            $em->flush();
            $this->logger->error('Échec traitement import', [
                'id' => $message->getImportId(),
                'error' => $e->getMessage(),
            ]);
            throw $e;
        } 
    }

    private function processFile($import): void
    {
        if (($handle = fopen($this->baseDir.'/public/uploads/'.$import->getStoredFilename(), "r")) !== FALSE) {
            while (($data = fgetcsv($handle, 50, ",")) !== FALSE) {
                $num = count($data);
                for ($c=0; $c < $num; $c++) {
                    //Traiter le magasin
                }
            }
            fclose($handle);
        }
    }
}