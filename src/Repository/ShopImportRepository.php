<?php

namespace App\Repository;

use App\Entity\ShopImport;
use App\Entity\Enum\ImportFileStructure;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;
use  Symfony\Component\HttpFoundation\File\UploadedFile;
/**
 * @extends ServiceEntityRepository<ShopImport>
 */
class ShopImportRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, ShopImport::class);
    }

    //Ajouter le fichier et le placer dans la file de traitement
    public function add(UploadedFile $file): ShopImport{
        $splFile = new \SplFileObject($file->getPathname());
        $splFile->setFlags(\SplFileObject::SKIP_EMPTY | \SplFileObject::DROP_NEW_LINE);

        $count = 0;
        foreach ($splFile as $line) {
            if(($count == 0 && $line == implode(',',ImportFileStructure::HEADER)) || empty($line)){
                continue;
            }
            $count++;
        }
        $filename =pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME) . '.' . $file->getClientOriginalExtension();
        $em = $this->getEntityManager();
        $fileimport = new ShopImport();
        $fileimport->setFilename($filename);
        $fileimport->setNblines($count);
        $em->persist($fileimport);
        $em->flush();
        $file->move('uploads', $fileimport->getStoredFilename());      
        return $fileimport;
    }
}
