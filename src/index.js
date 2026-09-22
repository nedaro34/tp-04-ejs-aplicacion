const { leerArchivo } = require("./archivos.js");
const path = require("node:path");
const express = require("express");
const expressEjsLayouts = require("express-ejs-layouts");

const rutaArchivo = path.join(__dirname, "..", "datos", "mascotas.json")

const puerto = 3000;

async function main() {
    try {

        const mascotas = await leerArchivo(rutaArchivo);
        const aplicacion = express();

        aplicacion.set("view engine", "ejs");
        aplicacion.set("views", path.join(__dirname, "..", "views"));

        aplicacion.use(expressEjsLayouts);
        aplicacion.set("layout", "layouts/main");
        aplicacion.use(express.static(path.join(__dirname, "..", "public")));
        aplicacion.use(express.urlencoded({ extended: false }));

        console.log(rutaArchivo);
        console.log(mascotas);

        //borrar
        aplicacion.get("/api/mascotas", (request, response) => {
            response.json(mascotas);
        })

        //editar con datos modulares
        aplicacion.get("/", (request, response) => {
            response.render("inicio", {
                titulo: "Inicio - Mascotas alegres",
                titulo2: "Mascotas alegres",
                descripcion: "Aquí en esta página podrás ver las mascotas que tenemos disponible para adopción. Simplemente elige una y bríndale todo tu cariño."
            });
        })

        //editar con datos modulares
        aplicacion.get("/mascotas", (request, response) => {
            response.render("mascotas/lista", {
                titulo: "funcionando",
                mascotas
            });
        })

        //editar con datos modulares
        aplicacion.get("/mascotas/nueva", (request, response) => {
            response.render("mascotas/nueva", {
                titulo: "Nueva mascota",
                error: null,
                valores: {},
            })
        })

        //editar con datos modulares
        aplicacion.get("/mascotas/:id", (request, response) => {
            const id = Number(request.params.id);
            const mascota = mascotas.find((mascota) => mascota.id === id);

            if (!mascota) {
                return response.status(404).render("no-encontrado", {
                    titulo: "mascota no encontrada",
                    mensaje: "no existe una mascota con ese identificador"
                });
            }

            response.render("mascotas/detalle", {
                titulo: `Detalles de ${mascota.nombre}`,
                mascota
            })
        })

        //editar
        aplicacion.post("/mascotas", (request, response) => {
            const { nombre, especie, edad, descripcion, estado, imagen } = request.body;
            const nombreLimpio = String(nombre ?? "").trim();
            const especieLimpio = String(especie ?? "").trim();
            const edadLimpio = Number(edad);
            const descripcionLimpio = String(descripción ?? "").trim();
            const estadoLimpio = String(estado ?? "").trim();

            if (
                !nombreLimpio ||
                !especieLimpio ||
                !Number.isFinite(edadLimpio) ||
                edadLimpio <= 0 ||
                !descripcionLimpio ||
                !estadoLimpio
            ) {
                return response.status(400).render("mascotas/nueva", {
                    titulo: "Mascota nueva",
                    error: "Completa todos los campos con valores válidos",
                    valores: request.body,
                })
            }
            const nuevoID = mascotas.lentgh === 0 ? 0 : mascotas[mascotas.lentgh - 1].id + 1;

            mascotas.push({
                id: nuevoID,
                nombre: nombreLimpio,
                especie: especieLimpio,
                edad: edadLimpio,
                descripcion: descripcionLimpio,
                estado: estadoLimpio,
                imagen: "/img/mascota.svg"
            });

            response.redirect("/mascotas");
        })

        //listo
        aplicacion.listen(puerto, () => {
            console.log(`Aplicación disponible en http://localhost:${puerto}`);
        })

    }
    catch (error) {
        console.error(`Algo sucedió al iniciar la aplicación: ${error}`);
        process.exitCode = 1;
    }
}

main();