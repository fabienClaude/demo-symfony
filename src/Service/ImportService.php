<?php

namespace App\Service;

use App\Entity\Enum\ImportFileStructure;
use App\Entity\Enum\ShopType;
use App\Entity\Shop;
use App\Entity\ShopImport;
use App\Repository\ShopImportRepository;
use App\Repository\ShopRepository;
use Doctrine\ORM\EntityManagerInterface;
use Psr\Log\LoggerInterface;
use Symfony\Component\DependencyInjection\Attribute\Autowire;
use Symfony\Component\HttpFoundation\File\UploadedFile;
use Symfony\Contracts\Translation\TranslatorInterface;

class ImportService
{
    public function __construct(
        #[Autowire('%kernel.project_dir%')]
        private readonly string $baseDir,
        private readonly ShopImportRepository $importRepository,
        private readonly ShopRepository $shopRepository,
        private readonly LoggerInterface $logger,
        private readonly TranslatorInterface $translator,
    ) {
    }

    public function importFile(UploadedFile $file): ShopImport
    {
        $splFile = new \SplFileObject($file->getPathname());
        $splFile->setFlags(\SplFileObject::SKIP_EMPTY | \SplFileObject::DROP_NEW_LINE);

        // compter le noimbre de lignes et rajouter les informations de suivi de l'import
        $count = 0;
        foreach ($splFile as $line) {
            if ((0 == $count && $line == implode(',', ImportFileStructure::HEADER)) || empty($line)) {
                continue;
            }
            ++$count;
        }

        $filename = pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME).'.'.$file->getClientOriginalExtension();

        $emImp = $this->importRepository->getEntityManager();
        $fileimport = new ShopImport();
        $fileimport->setFilename($filename);
        $fileimport->setNblines($count);
        $emImp->persist($fileimport);
        $emImp->flush();
        $file->move($this->baseDir.'/public/uploads', $fileimport->getStoredFilename());

        return $fileimport;
    }

    public function processFile(int $importId): void
    {
        // Nombre de lignes de fichiers à traiter par paquet
        $batch = 50;

        $emImp = $this->importRepository->getEntityManager();
        $emShop = $this->shopRepository->getEntityManager();
        $import = $this->importRepository->find($importId);

        if (!$import) {
            throw new \Exception('Import introuvable');
        }

        $import->setState('process');
        $emImp->flush();

        // Préparation des types de magasin pour lier la traduction à l'import
        $shop_types = [];
        foreach (ShopType::cases() as $type) {
            $shop_types[$this->translator->trans('shop.'.$type->value)] = $type->value;
        }

        try {
            // Traiter le fichier et compter le nombre de succès/echecs
            if (($handle = fopen($this->baseDir.'/public/uploads/'.$import->getStoredFilename(), 'r')) !== false) {
                $nb_processed = 0;
                $success = 0;
                $fails = 0;
                while (($data = fgetcsv($handle, null, ',', '"', '\\')) !== false) {
                    if ((implode(',', $data) == implode(',', ImportFileStructure::HEADER)) || empty($data)) {
                        continue;
                    }
                    try {
                        $shop = new Shop();
                        $shop->setName($data[0]);
                        $shop->setOwner($data[1]);
                        $shop->setAddress($data[2]);
                        $shop->setZipCode($data[3]);
                        $shop->setCity($data[4]);
                        if (array_key_exists($data[5], $shop_types)) {
                            $shop->setShopType($shop_types[$data[5]]);
                        } else {
                            throw new \Exception('Type de magasin incorrect ou non défini.');
                        }
                        $emShop->persist($shop);
                        ++$success;
                    } catch (\Throwable $ex) {
                        ++$fails;
                        $this->logger->error('Échec ajout magasin', [
                            'id' => $importId,
                            'error' => $ex->getMessage(),
                        ]);
                    }
                    ++$nb_processed;
                    if ($nb_processed == $batch) {
                        // Enregistrer les magasins
                        $this->flushAndUpdateStats($emShop, $emImp, $import, $success, $fails, $nb_processed);
                        $nb_processed = 0;
                        $success = 0;
                        $fails = 0;
                    }
                }
                fclose($handle);
                // Enregistrer les derniers magasins
                $this->flushAndUpdateStats($emShop, $emImp, $import, $success, $fails, $nb_processed);
            }

            $import->setState('success');
            $emImp->flush();
        } catch (\Throwable $e) {
            $import->setState('fail');
            $emImp->flush();
            $this->logger->error('Échec traitement import', [
                'id' => $importId,
                'error' => $e->getMessage(),
            ]);
            throw $e;
        }
    }

    private function flushAndUpdateStats(EntityManagerInterface $emShop, EntityManagerInterface $emImp, ShopImport $import, int $success, int $fails, int $nb_processed)
    {
        $nb_success = $success;
        $nb_fails = $fails;

        // Enregistrer les magasins
        try {
            $emShop->flush();
        } catch (\Throwable $ex) {
            $nb_success = 0;
            $nb_fails = $nb_processed;
            $this->logger->error('Échec ajout batch', [
                'id' => $importId,
                'error' => $ex->getMessage(),
            ]);
        }

        // Mettre à jour les statistiques d'import
        $import->setSuccess($import->getSuccess() + $nb_success);
        $import->setFailures($import->getFailures() + $nb_fails);
        $emImp->flush();
    }
}
