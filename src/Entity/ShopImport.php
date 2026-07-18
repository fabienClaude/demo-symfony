<?php

namespace App\Entity;

use App\Repository\ShopImportRepository;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Uid\Uuid;

#[ORM\Entity(repositoryClass: ShopImportRepository::class)]
class ShopImport
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    private ?string $filename = null;

    #[ORM\Column(type: Types::GUID)]
    private ?string $uuid = null;

    #[ORM\Column]
    private ?int $success = null;

    #[ORM\Column]
    private ?int $failures = null;

    #[ORM\Column]
    private ?int $nblines = null;

    #[ORM\Column(length: 255)]
    private ?string $state = null;

    public function __construct()
    {
        $this->uuid = Uuid::v4();
        $this->success = 0;
        $this->failures = 0;
        $this->state = 'wait';
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getFilename(): ?string
    {
        return $this->filename;
    }

    public function setFilename(string $filename): static
    {
        $this->filename = $filename;

        return $this;
    }

    public function getUuid(): ?string
    {
        return $this->uuid;
    }

    public function setUuid(string $uuid): static
    {
        $this->uuid = $uuid;

        return $this;
    }

    public function getSuccess(): ?int
    {
        return $this->success;
    }

    public function setSuccess(int $success): static
    {
        $this->success = $success;

        return $this;
    }

    public function getFailures(): ?int
    {
        return $this->failures;
    }

    public function setFailures(int $failures): static
    {
        $this->failures = $failures;

        return $this;
    }

    public function getNblines(): ?int
    {
        return $this->nblines;
    }

    public function setNblines(int $nblines): static
    {
        $this->nblines = $nblines;

        return $this;
    }

    public function getState(): ?string
    {
        return $this->state;
    }

    public function setState(string $state): static
    {
        $this->state = $state;

        return $this;
    }

    public function getStoredFilename() : string
    {
        return $this->uuid.'_'.$this->getFilename();
    }
}
