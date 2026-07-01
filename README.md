# Base Docker — Symfony + Apache + MySQL

## Contenu
- **app** : PHP 8.3 + Apache (mod_rewrite activé, DocumentRoot pointé sur `public/`)
- **database** : MySQL 8.0
- **phpmyadmin** : interface web pour gérer la base (optionnel)

## Arborescence

```
symfony-docker/
├── docker-compose.yml
├── Dockerfile
├── .env                  # variables docker-compose (mots de passe, etc.)
├── .dockerignore
└── docker/
    ├── apache/vhost.conf
    ├── php/php.ini
    └── mysql/conf.d/      # configs MySQL custom (vide pour l'instant)
```

## 1. Mettre votre projet Symfony dans ce dossier

Si vous n'avez pas encore de projet Symfony, créez-le d'abord à la racine de ce dossier :

```bash
composer create-project symfony/skeleton .
# ou pour une application web complète :
composer create-project symfony/webapp .
```

Si vous avez déjà un projet, copiez son contenu (dossier `src/`, `public/`, `composer.json`, etc.) à la racine de `symfony-docker/`, au même niveau que le `docker-compose.yml`.

## 2. Configurer la base de données

Dans le fichier `.env` de **Symfony** (pas celui de Docker), mettez :

```
DATABASE_URL="mysql://symfony:symfony@database:3306/symfony?serverVersion=8.0&charset=utf8mb4"
```

> Le host est `database` (nom du service docker-compose), pas `localhost` ni `127.0.0.1`.

Vous pouvez changer les identifiants dans le fichier `.env` à la racine (`DB_USER`, `DB_PASSWORD`, etc.).

## 3. Lancer l'environnement

```bash
docker compose up -d --build
```

## 4. Installer les dépendances et préparer la base

```bash
docker compose exec app composer install
docker compose exec app php bin/console doctrine:database:create
docker compose exec app php bin/console doctrine:migrations:migrate
```

## 5. Accéder à l'application

| Service     | URL                              |
|-------------|-----------------------------------|
| Application | http://localhost:8080            |
| phpMyAdmin  | http://localhost:8081            |
| MySQL       | localhost:3306 (depuis l'hôte)   |

## Commandes utiles

```bash
docker compose exec app bash              # ouvrir un shell dans le conteneur app
docker compose exec app symfony console list
docker compose logs -f app                # voir les logs Apache/PHP
docker compose down                       # arrêter les conteneurs
docker compose down -v                    # arrêter + supprimer le volume MySQL
```

## Notes
- Les droits sont donnés à `www-data` dans le conteneur ; sous Linux, si vous avez des soucis de permissions sur `var/cache` ou `var/log`, lancez :
  ```bash
  sudo chown -R $USER:$USER var/
  ```
- En production, désactivez `display_errors` dans `docker/php/php.ini` et utilisez un mot de passe MySQL fort.
