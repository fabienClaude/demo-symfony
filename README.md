# Démo Symfony 8.1 : gestion de magasins

## Pré-requis
Git
Docker

## Installation
### Cloner le repository
```bash
git clone https://github.com/fabienClaude/demo-symfony.git
```
### Se rendre dans le dossier et déployer le volume docker
```bash
cd demo-symfony
docker compose up -d  --build
```

### Déployer l'application en local
Se rendre dans le terminal du volume Docker
```bash
docker exec -it symfony_app bash
```
Installer les dépendances Symfony et Node
```bash
composer install
npm install
```
Créer les tables de la base de données
```bash
php bin/console doctrine:migrations:migrate
```
Compiler le frontend de l'applicaiton
```bash
npm run build
```

### Tests unitaires
Dans le terminal du volume Docker lancer la commande
```bash
./test.sh
```

## Stack
- **backend** : Symfony 8.1, PHP 8.3, Apache
- **frontend** : React, tailwind
- **database** : MySQL 8.0

## Accéder à l'application

| Service     | URL                              |
|-------------|-----------------------------------|
| Application | http://localhost:8080            |
| phpMyAdmin  | http://localhost:8081            |
| MySQL       | localhost:3306 (depuis l'hôte)   |