<?php

namespace App\Tests;

use App\Entity\ShopImport;
use App\Repository\ShopImportRepository;
use App\Service\ImportService;
use Doctrine\ORM\EntityManager;
use Symfony\Bundle\FrameworkBundle\Test\KernelTestCase;
use Symfony\Component\HttpFoundation\File\UploadedFile;

class ImportTest extends KernelTestCase
{
    private ?EntityManager $entityManager;
    private ?ShopImportRepository $importRepository;
    private ?ImportService $importService;
    private string $baseDir;

    protected function setUp(): void
    {
        $kernel = self::bootKernel();
        $container = static::getContainer();

        $this->entityManager = $kernel->getContainer()
            ->get('doctrine')
            ->getManager();
        $this->importRepository = $this->entityManager->getRepository(ShopImport::class);
        $this->importService = $container->get(ImportService::class);
        $this->baseDir = self::getContainer()->getParameter('kernel.project_dir');
    }

    public function testImportFullSuccess()
    {
        $fileimport = $this->processTestFile('test_success.csv');
        $this->assertEquals($fileimport->getSuccess(), 50);
    }

    public function testImportWithErrors()
    {
        $fileimport = $this->processTestFile('test_with_errors.csv');
        $this->assertEquals($fileimport->getSuccess(), 48);
        $this->assertEquals($fileimport->getFailures(), 2);
    }

    private function getTestFile(string $filename): UploadedFile
    {
        $path = $this->baseDir.'/var/files/test/'.$filename;
        $tmpPath = $this->baseDir.'/var/files/test/test_'.$filename;
        copy($path, $tmpPath);

        return new UploadedFile(
            $tmpPath,
            $filename,
            'text/csv',
            null,
            true
        );
    }

    private function processTestFile($filename): ShopImport
    {
        $testfile = $this->getTestFile($filename);
        // Traiter le fichier de test
        $fileimport = $this->importService->importFile($testfile);
        $this->importService->processFile($fileimport->getId());
        // Supprimer le fichier déplacé
        unlink($this->baseDir.'/public/uploads/'.$fileimport->getStoredFilename());

        return $fileimport;
    }

    protected function tearDown(): void
    {
        parent::tearDown();
        $this->entityManager->close();
        $this->entityManager = null;
        $this->importRepository = null;
        $this->importService = null;
    }
}
