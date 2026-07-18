<?php

namespace App\Entity;

use App\Entity\Enum\ShopType;
use App\Repository\ShopRepository;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: ShopRepository::class)]
class Shop
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 255, nullable: false)]
    private ?string $name = null;

    #[ORM\Column(length: 255, nullable: false)]
    private ?string $owner = null;

    #[ORM\Column(length: 255, nullable: false)]
    private ?string $address = null;

    #[ORM\Column(length: 5, nullable: false)]
    private ?string $zipCode = null;

    #[ORM\Column(length: 255, nullable: false)]
    private ?string $city = null;

    #[ORM\Column(type: 'string', enumType: ShopType::class, nullable: false)]
    private ShopType $shopType;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getName(): ?string
    {
        return $this->name;
    }

    public function setName(string $name): static
    {
        $this->name = $name;

        return $this;
    }

    public function getAddress(): ?string
    {
        return $this->address;
    }

    public function setAddress(string $address): static
    {
        $this->address = $address;

        return $this;
    }

    public function getOwner(): ?string
    {
        return $this->owner;
    }

    public function setOwner(string $owner): static
    {
        $this->owner = $owner;

        return $this;
    }

    public function getZipCode(): ?string
    {
        return $this->zipCode;
    }

    public function setZipCode(string $zipCode): static
    {
        $this->zipCode = $zipCode;

        return $this;
    }

    public function getCity(): ?string
    {
        return $this->city;
    }

    public function setCity(string $city): static
    {
        $this->city = $city;

        return $this;
    }

    public function getShopType(): ?string
    {
        return $this->shopType?->value;
    }

    public function setShopType(string|ShopType $shopType): self
    {
        if (is_string($shopType)) {
            $shopType = ShopType::from($shopType);
        }
        $this->shopType = $shopType;

        return $this;
    }

    public function toArray(): array
    {
        return [
            'id' => $this->getId(),
            'name' => $this->getName(),
            'owner' => $this->getOwner(),
            'address' => $this->getAddress(),
            'city' => $this->getCity(),
            'zipcode' => $this->getZipCode(),
            'shoptype' => $this->getShopType(),
        ];
    }
}
