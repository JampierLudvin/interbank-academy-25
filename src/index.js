const fs = require('fs/promises');
const path = require('path');
const csv = require('csv-parser');
const { Readable } = require('stream');

const CSV_PATH = path.join(__dirname, '../data.csv');

let balance = 0;
let maxTransaction = { id: null, monto: 0 };
const transactionCount = { Credito: 0, Debito: 0 };
const transactionIds = new Set(); // Usamos Set para detectar duplicados de ID

// Valida si el archivo existe
async function verificarArchivo(ruta) {
    try {
        await fs.access(ruta);
        return true;
    } catch {
        return false;
    }
}

// Valida si la fila del CSV tiene datos correctos
function validarFila(row) {
    const id = row.id?.trim();
    const tipo = row.tipo?.trim();
    const montoStr = row.monto?.toString().trim();
    const esNumeroValido = /^-?\d+(\.\d+)?$/.test(montoStr);

    if (!id || !tipo || !esNumeroValido) {
        console.warn(`Fila inválida o incompleta (ID: ${id}, Tipo: ${tipo}, Monto: ${row.monto})`);
        return null;
    }

    return {
        id,
        tipo,
        monto: Number(montoStr)
    };
}

// Procesa cada fila válida
function procesarFila({ id, tipo, monto }) {
    if (transactionIds.has(id)) {
        console.error(`ID duplicado: ${id}`);
        return;
    }

    transactionIds.add(id);

    if (['Crédito', 'Credito'].includes(tipo)) {
        balance += monto;
        transactionCount.Credito++;
    } else if (['Débito', 'Debito'].includes(tipo)) {
        balance -= monto;
        transactionCount.Debito++;
    } else {
        console.warn(`Tipo de transacción desconocido (ID: ${id}): ${tipo}`);
        return;
    }

    if (monto > maxTransaction.monto) {
        maxTransaction = { id, monto };
    }
}

// Muestra el resumen final
function mostrarReporte() {
    console.log('\n Reporte de Transacciones');
    console.log('---------------------------------------------');
    console.log(`Balance Final: ${balance.toFixed(2)}`);
    console.log(`Transacción de Mayor Monto: ID ${maxTransaction.id} - ${maxTransaction.monto.toFixed(2)}`);
    console.log(`Conteo de Transacciones: Crédito: ${transactionCount.Credito} | Débito: ${transactionCount.Debito}\n`);
}

// Función principal que orquesta todo
async function procesarCSV() {
    const existe = await verificarArchivo(CSV_PATH);
    if (!existe) {
        console.error(` El archivo CSV no existe en ${CSV_PATH}`);
        return;
    }

    try {
        const contenido = await fs.readFile(CSV_PATH, 'utf-8');

        await new Promise((resolve, reject) => {
            Readable.from(contenido)
                .pipe(csv())
                .on('data', (row) => {
                    try {
                        const fila = validarFila(row);
                        if (fila) procesarFila(fila);
                    } catch (err) {
                        console.error(`Error procesando fila: ${err.message}`);
                    }
                })
                .on('end', resolve)
                .on('error', reject);
        });

        mostrarReporte();

    } catch (error) {
        console.error('Error leyendo el archivo:', error.message);
    }
}

procesarCSV();