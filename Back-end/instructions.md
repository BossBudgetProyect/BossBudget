# 🚀 BossBudget API - Guía de Configuración

Esta guía te llevará paso a paso para configurar el proyecto BossBudget API desde cero.

## 📋 Prerrequisitos

- Node.js 16+ instalado
- MySQL 8.0+ (opcional)
- Git

## 🛠️ Configuración Inicial

### 1. Estructura de Carpetas

```bash
# Crear estructura de carpetas
mkdir -p bossbudget-api/src/{config,models,repositories,services,controllers,middlewares,routes,utils} bossbudget-api/scripts bossbudget-api/uploads
```
# Navegar al proyecto
```bash
cd bossbudget-api
```
### 2. Inicializar proyecto de node.js

```bash
# Inicializar package.json
npm init -y
```
### 3. Instalar Dependencias

```bash
# Dependencias principales
npm install express mysql2 bcryptjs jsonwebtoken cors dotenv express-rate-limit fetch crypto nodemailer axios cookie-parser
```
```bash
# Dependencias de desarrollo
npm install --save-dev nodemon
```
### 4. Configurar package.json
Editar package.json y agregar estos scripts:

```json
{
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js",
    "setup:db": "node scripts/setup-database.js",
    "setup:mysql": "./scripts/setup-codespace.sh",
    "setup:all": "npm run setup:mysql && npm run setup:db"
  }
}
```
### 5. Crear Archivo de Variables de Entorno
Crear archivo .env en la raíz:

```env
# Server
PORT=5000
NODE_ENV=development

# Database
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=password
DB_NAME=bossbudget

# JWT
JWT_SECRET=tu_jwt_secret_super_seguro

# CORS
FRONTEND_URL=http://localhost:3000
```

## CONFIGURACIÓN DE BASE DE DATOS MYSQL EN GITHUB CODESPACE
### Para Entorno Local (MySQL ya instalado)
Si ya tienes MySQL instalado localmente, solo ejecuta:

```bash
npm run setup:db
```
## Para GitHub Codespaces (Instalar MySQL)

### Ejecutar el script de instalación de MySQL
```bash
npm run setup:mysql
```
### Luego crear la base de datos (scripts/setup-database.js)
```bash
npm run setup:db
```
### Script de Instalación de MySQL (setup-codespace.sh)
```bash
#!/bin/bash
echo "🔧 Configurando MySQL en Codespaces..."

# Instalar MySQL
sudo apt update
sudo apt install mysql-server -y

# Iniciar servicio
sudo service mysql start

# Configurar usuario root
sudo mysql -e "ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'password';"
sudo mysql -e "FLUSH PRIVILEGES;"

echo "✅ MySQL configurado"
```
Hacer ejecutable:
```bash
chmod +x scripts/setup-codespace.sh
```

# Configuración de Base de Datos
## scripts/setup-database.js
Este script crea automáticamente:

* Base de datos bossbudget

* Todas las tablas necesarias

* Datos básicos de configuración

Ejecutar con:

```bash
npm run setup:db
```

## Verificar si esta corriendo mysql
```bash
sudo service mysql status
```

## Ejecutar mysql
```bash
sudo service mysql start
```

## Consultar tablas en mysql

```bash
mysql -h 127.0.0.1 -u root -ppassword -e "SHOW DATABASES;"
```

## Verificar tablas de bossbudget
```bash
mysql -h 127.0.0.1 -u root -ppassword bossbudget -e "SHOW TABLES;"
```