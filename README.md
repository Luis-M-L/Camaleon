# Camaleon
Prueba de concepto cacharrera de un detector de arbitrajes entre exchanges de criptomonedas

Requiere:
node.js
mariadb

1. 
MariaDB[Camaleon]> CREATE DATABASE Camaleon;

MariaDB[Camaleon]> CREATE USER 'test' IDENTIFIED BY 'test_pass';

MariaDB[Camaleon]> source <PROJECT_DIRECTORY>/database/init;

El usuario y contraseña del usuario debe coincidir con el que indicamos en las propiedades de /Camaleon/database/bbdd.js.

2. 
node <PROJECT_DIRECTORY>/server.js

3.
Lanza una petición GET localhost:8080/
