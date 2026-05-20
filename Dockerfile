FROM php:8.2-apache

# Install system dependencies dasar yang dibutuhkan untuk git/zip/curl
RUN apt-get update && apt-get install -y \
    zip \
    unzip \
    git \
    curl

# Install Node.js 20 (Dibutuhkan Vite untuk build frontend)
RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
    && apt-get install -y nodejs

# Download & jalankan docker-php-extension-installer untuk menginstal ekstensi PHP secara aman & cepat
ADD https://github.com/mlocati/docker-php-extension-installer/releases/latest/download/install-php-extensions /usr/local/bin/

RUN chmod +x /usr/local/bin/install-php-extensions && \
    install-php-extensions pdo_mysql pdo_sqlite pcntl bcmath gd zip intl

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

# Install Node dependencies dan build assets (Vite), lalu hapus node_modules untuk memperkecil ukuran image
RUN npm ci && npm run build && rm -rf node_modules && npm cache clean --force

# Setup permissions
RUN chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache
RUN chmod -R 775 /var/www/html/storage /var/www/html/bootstrap/cache

# Start Apache
CMD ["apache2-foreground"]
