<?php

namespace App\Tests;

use App\Entity\Enum\ShopType;
use App\Entity\Shop;
use App\Repository\ShopRepository;
use Doctrine\ORM\EntityManager;
use Symfony\Bundle\FrameworkBundle\Test\KernelTestCase;

class ShopTest extends KernelTestCase
{
    private ?EntityManager $entityManager;
    private ?ShopRepository $shopRepository;

    protected function setUp(): void
    {
        $kernel = self::bootKernel();

        $this->entityManager = $kernel->getContainer()
            ->get('doctrine')
            ->getManager();
        $this->shopRepository = $this->entityManager->getRepository(Shop::class);
    }

    public function testCreateShop(): void
    {
        // Test création magasin
        $shop = new Shop();
        $shop->setName('Librairie Marcel Duchamp');
        $shop->setOwner('Marcel Duchamp');
        $shop->setAddress('3 rue Poule Dort');
        $shop->setCity('Toulouse');
        $shop->setZipCode('31000');
        $shop->setShopType(ShopType::BOOKSTORE);
        $this->entityManager->persist($shop);
        $this->entityManager->flush();
        $shops = $this->shopRepository->findAll();
        $this->assertCount(1, $shops);
    }

    public function testUpdateShop(): void
    {
        // Test mise à jour magasin
        $shop = new Shop();
        $shop->setName('Librairie René Laporte');
        $shop->setOwner('René Laporte');
        $shop->setAddress('8 avenue Pérel');
        $shop->setCity('Toulouse');
        $shop->setZipCode('31000');
        $shop->setShopType(ShopType::BOOKSTORE);
        $this->entityManager->persist($shop);
        $this->entityManager->flush();

        $shop->setAddress('6 rue Bruno Lopin');
        $shop->setShopType(ShopType::OTHER);
        $this->entityManager->flush();

        $this->assertEquals($shop->getAddress(), '6 rue Bruno Lopin');
        $this->assertEquals($shop->getShopType(), ShopType::OTHER->value);
        // On ne peut pas mettre à jour avec une valeur non incluse dans l'enum ShopType
        $this->expectException(\ValueError::class);
        $shop->setShopType('riendutout');
    }

    protected function tearDown(): void
    {
        parent::tearDown();

        // doing this is recommended to avoid memory leaks
        $this->entityManager->close();
        $this->entityManager = null;
        $this->shopRepository = null;
    }
}
