<?php
namespace App\Model;

use App\Service\Config;
use PDO;

class PTZCamera
{
    private ?int $id = null;
    private ?string $name = null;
    private ?float $price = null;
    private ?string $description = null;
    private ?int $pan = null;
    private ?int $tilt = null;
    private ?int $zoom = null;

    public function getId(): ?int
    {
        return $this->id;
    }
    public function setId(?int $id): PTZCamera
    {
        $this->id = $id;

        return $this;
    }
    public function getName(): ?string
    {
        return $this->name;
    }
    public function setName(?string $name): PTZCamera
    {
        $this->name = $name;

        return $this;
    }
    public function getPrice(): ?float
    {
        return $this->price;
    }
    public function setPrice(?float $price): void
    {
        $this->price = $price;
    }
    public function getDescription(): ?string
    {
        return $this->description;
    }
    public function setDescription(?string $description): PTZCamera
    {
        $this->description = $description;

        return $this;
    }
    public function getPan(): ?int
    {
        return $this->pan;
    }
    public function setPan(?int $pan): PTZCamera
    {
        $this->pan = $pan;

        return $this;
    }
    public function getTilt(): ?int
    {
        return $this->tilt;
    }
    public function setTilt(?int $tilt): PTZCamera
    {
        $this->tilt = $tilt;

        return $this;
    }
    public function getZoom(): ?int
    {
        return $this->zoom;
    }
    public function setZoom(?int $zoom): PTZCamera
    {
        $this->zoom = $zoom;

        return $this;
    }
    public static function fromArray($array): PTZCamera
    {
        $camera = new self();
        $camera->fill($array);

        return $camera;
    }
    public function fill($array): PTZCamera
    {
        if (isset($array['id']) && ! $this->getId()) {
            $this->setId($array['id']);
        }
        if (isset($array['name'])) {
            $this->setName($array['name']);
        }
        if (isset($array['price'])) {
            $this->setPrice($array['price']);
        }
        if (isset($array['description'])) {
            $this->setDescription($array['description']);
        }
        if (isset($array['pan'])) {
            $this->setPan($array['pan']);
        }
        if (isset($array['tilt'])) {
            $this->setTilt($array['tilt']);
        }
        if (isset($array['zoom'])) {
            $this->setZoom($array['zoom']);
        }

        return $this;
    }
    public static function findAll(): array
    {
        $pdo = new PDO(Config::get('db_dsn'), Config::get('db_user'), Config::get('db_pass'));
        $sql = 'SELECT * FROM camera';
        $statement = $pdo->prepare($sql);
        $statement->execute();

        $cameras = [];
        $camerasArray = $statement->fetchAll(PDO::FETCH_ASSOC);
        foreach ($camerasArray as $cameraArray) {
            $cameras[] = self::fromArray($cameraArray);
        }

        return $cameras;
    }
    public static function find($id): ?PTZCamera
    {
        $pdo = new PDO(Config::get('db_dsn'), Config::get('db_user'), Config::get('db_pass'));
        $sql = 'SELECT * FROM camera WHERE id = :id';
        $statement = $pdo->prepare($sql);
        $statement->execute(['id' => $id]);

        $cameraArray = $statement->fetch(PDO::FETCH_ASSOC);
        if (!$cameraArray) {
            return null;
        }

        return PTZCamera::fromArray($cameraArray);
    }
    public function save(): void
    {
        $pdo = new PDO(Config::get('db_dsn'), Config::get('db_user'), Config::get('db_pass'));
        if (! $this->getId()) {
            $sql = "INSERT INTO camera (price, description, pan, tilt, zoom, name) VALUES (:price, :description, :pan, :tilt, :zoom, :name)";
            $statement = $pdo->prepare($sql);
            $statement->execute([
                'price' => $this->getPrice(),
                'description' => $this->getDescription(),
                'pan' => $this->getPan(),
                'tilt' => $this->getTilt(),
                'zoom' => $this->getZoom(),
                'name' => $this->getName(),
            ]);

            $this->setId($pdo->lastInsertId());
        } else {
            $sql = "UPDATE camera SET name = :name, price = :price, description = :description, pan = :pan, tilt = :tilt, zoom = :zoom WHERE id = :id";
            $statement = $pdo->prepare($sql);
            $statement->execute([
                ':name' => $this->getName(),
                ':price' => $this->getPrice(),
                ':description' => $this->getDescription(),
                ':pan' => $this->getPan(),
                ':tilt' => $this->getTilt(),
                ':zoom' => $this->getZoom(),
                ':id' => $this->getId(),
            ]);
        }
    }
    public function delete(): void
    {
        $pdo = new PDO(Config::get('db_dsn'), Config::get('db_user'), Config::get('db_pass'));
        $sql = "DELETE FROM camera WHERE id = :id";
        $statement = $pdo->prepare($sql);
        $statement->execute([
            ':id' => $this->getId(),
        ]);

        $this->setId(null);
        $this->setName(null);
        $this->setPrice(null);
        $this->setDescription(null);
        $this->setPan(null);
        $this->setTilt(null);
        $this->setZoom(null);
    }

}