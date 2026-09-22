const fileSystem = require("node:fs/promises");

async function leerArchivo(ruta) {
    const datos = await fileSystem.readFile(ruta);
    return JSON.parse(datos);
}

module.exports = { leerArchivo }