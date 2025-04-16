
# Reto Técnico: Procesamiento de Transacciones Bancarias (CLI)

## Introducción:

   Este programa realiza la lectura de un archivo data.csv, para posteriormente procesar la información de las 3 columnas y obtener como resultado el balance final, la transaccion de mayor monto y el conteo de transacciones totales, este programa fue realizado con Node Js v18.20.8 y Javascript Moderno.
---
## Instrucciones de Ejecución:

   1. El IDE a usar es Visual Studio Code, o alguno que soporte Node js.

   2. Clonar el repositorio del reto.

   3. Inicializamos el proyecto con el siguiente comando  una vez ubicados en la carpeta del proyecto
   ```bash
   npm init -y
   ```

   4. Instalamos dependencias con el comando: 
   ```bash
   npm install
   ```
   5. para este caso usaremos:
   ```bash
   npm install csv-parser dotenv
   ```

## Enfoque y Solución:

   Para la solucion usé funciones para separar cada accion y asi modularizar de mejor forma el codigo, ademas esto me permite controlar errores de forma mas exacta, lo que se hizo dentro es primero una funcion principal que maneja todo, los pasos de ejecucion resumidos son:

   - Importamos modulos a usar como fs/promises, path, csv-parser y stream para usarlos en nuestro codigo.
   - Guardamos en la variable CSV_PATH la ruta del archivo csv, en este caso esta en la raiz del proyecto.
   - Definimos variables para almacenar el balance, la transaccion con el monto mayor, el conteo de transacciones como un objeto y la variable transactionIds para verificar si el ID de algun registro esta repetido.

   las funciones usadas son:
   - **verificarArchivo**, este verifica si el archivo existe o no.
   - **validarFila**, la cual revisa si la fila del archivo tiene los datos correctos a travez del ".trim" y la expresion regular que verifica que no tenga ningun caracter alfabetico en el numero ya sea en la parte entera o decimal, para evitar errores como monto=456.A58.
   - **procesarFila**, esta funcion verifica los id duplicados, ademas de validar que por alguna razon se haya escrito sin tilde el tipo de monto, que es un error frecuente en navegadores web.
   - **mostrarReporte**, esta funcion imprime en pantalla el balance redondeando a 2 decimales, la transaccion con el monto mayor y el conteo de transacciones.
   - **procesarCSV**, aqui es donde se orquesta todo el programa y sus funciones.
   Como ultima linea se llama a la funcion anterior y listo.

## Estructura del Proyecto:

```
INTERBANK-ACADEMY-25/
├── node_modules/
├── src/
│   └── index.js        # Código principal
├── .gitignore   
├── data.csv     # (Archivo csv)
├── package-lock.json
├── package.json
└── README.md
```

