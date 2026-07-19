#!/bin/bash
set -e


echo "Suppression de la base de test précédente..."
php bin/console --env=test doctrine:database:drop --force --if-exists

echo "Création de la base de test..."
php bin/console --env=test doctrine:database:create

echo "Migrations..."
php bin/console --env=test doctrine:migrations:migrate --no-interaction

echo "Lancement des tests..."
php bin/phpunit