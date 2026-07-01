FROM php:8.4-apache

# --- Dépendances système ---
RUN apt-get update && apt-get install -y \
    git \
    unzip \
    libicu-dev \
    libzip-dev \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    libpq-dev \
    openssl \
    && rm -rf /var/lib/apt/lists/*

# --- Extensions PHP nécessaires à Symfony ---
# (openssl est déjà intégré au cœur de PHP, pas besoin de la compiler)
RUN docker-php-ext-install \
    intl \
    zip \
    pdo \
    pdo_mysql \
    mbstring \
    xml \
    opcache

# --- Activation des modules Apache (rewrite, headers, ssl) ---
RUN a2enmod rewrite headers ssl

# --- Configuration du DocumentRoot vers /public (Symfony), HTTP + HTTPS ---
COPY docker/apache/vhost.conf /etc/apache2/sites-available/000-default.conf
COPY docker/apache/vhost-ssl.conf /etc/apache2/sites-available/000-default-ssl.conf
RUN a2ensite 000-default-ssl

# --- Certificat auto-signé pour le développement ---
# En production, montez vos vrais certificats sur /etc/apache2/ssl/ (voir README ci-dessous)
RUN mkdir -p /etc/apache2/ssl \
    && openssl req -x509 -nodes -days 365 \
       -newkey rsa:2048 \
       -keyout /etc/apache2/ssl/server.key \
       -out /etc/apache2/ssl/server.crt \
       -subj "/C=FR/ST=NA/L=Bordeaux/O=Dev/CN=localhost"

# --- Configuration PHP custom ---
COPY docker/php/php.ini /usr/local/etc/php/conf.d/symfony.ini

# --- Installation de Composer ---
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

# --- Installation du Symfony CLI (optionnel mais pratique) ---
RUN curl -sS https://get.symfony.com/cli/installer | bash \
    && mv /root/.symfony*/bin/symfony /usr/local/bin/symfony

WORKDIR /var/www/html

# --- Droits pour le user www-data ---
RUN chown -R www-data:www-data /var/www/html

EXPOSE 80 443