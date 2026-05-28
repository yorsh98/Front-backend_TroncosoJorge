FROM php:8.4-fpm-bookworm

WORKDIR /var/www/html

RUN apt-get update \
    && apt-get install -y --no-install-recommends \
        git \
        unzip \
        libzip-dev \
        libpng-dev \
        libjpeg-dev \
        libfreetype6-dev \
        libxml2-dev \
        default-mysql-client \
        libreoffice \
        poppler-utils \
        antiword \
    && docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install pdo_mysql zip gd bcmath \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

COPY --from=composer:2 /usr/bin/composer /usr/bin/composer
COPY docker/backend/php/php.ini /usr/local/etc/php/conf.d/proviemplea.ini

CMD ["php-fpm"]
