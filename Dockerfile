FROM php:8.2-apache

# Install system dependencies
RUN apt-get update && apt-get install -y \
    libzip-dev \
    zip \
    unzip \
    git \
    curl \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    libsqlite3-dev

# Install Node.js 20 (Dibutuhkan Vite untuk build frontend)
RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
    && apt-get install -y nodejs

# Install PHP extensions
# (mbstring dan dom biasanya sudah bawaan dari image php:8.2, kita pastikan yang lain terinstall)
RUN docker-php-ext-install pdo_mysql pdo_sqlite pcntl bcmath gd zip intl

# Enable Apache mod_rewrite
RUN a2enmod rewrite

# Konfigurasi DocumentRoot ke public/
ENV APACHE_DOCUMENT_ROOT=/var/www/html/public
RUN sed -ri -e 's!/var/www/html!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/sites-available/*.conf
RUN sed -ri -e 's!/var/www/!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/apache2.conf /etc/apache2/conf-available/*.conf

# Konfigurasi port Apache agar membaca $PORT dari Cloud Run
RUN sed -i 's/Listen 80/Listen ${PORT}/g' /etc/apache2/ports.conf
RUN sed -i 's/<VirtualHost \*:80>/<VirtualHost *:${PORT}>/g' /etc/apache2/sites-available/000-default.conf

# Set default port untuk Cloud Run
ENV PORT=8080

# Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Set working directory
WORKDIR /var/www/html

# Copy seluruh file project
COPY . .

# Buat dummy .env agar composer tidak error saat post-install-cmd
RUN cp .env.example .env

# Install PHP dependencies (tanpa dev package)
RUN composer install --optimize-autoloader --no-dev --no-interaction

# Generate APP_KEY untuk dummy .env
RUN php artisan key:generate

# Install Node dependencies dan build assets (Vite)
RUN npm ci
RUN npm run build

# Setup permissions
RUN chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache
RUN chmod -R 775 /var/www/html/storage /var/www/html/bootstrap/cache

# Start Apache
CMD ["apache2-foreground"]
