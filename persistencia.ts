
import { readFile, writeFile } from "fs/promises";
import { Tarea } from "./Tarea";

// Estados permitidos en el archivo JSON
const estadosValidos = [
    "PENDING",
    "IN-PROGRESS",
    "FINISHED",
    "CANCELED"
];

// Verifica que una fecha sea válida
function fechaValida(fecha: any): boolean {
    if (typeof fecha !== "string") {
        return false;
    }

    const valor = new Date(fecha);

    return !isNaN(valor.getTime());
}

// Valida una tarea del JSON
function validarTarea(tarea: any, indice: number): boolean {

    if (typeof tarea !== "object" || tarea === null || Array.isArray(tarea)) {
        console.log(`La tarea ${indice + 1} no es un objeto válido.`);
        return false;
    }

    let valida = true;

    if (typeof tarea.titulo !== "string" || tarea.titulo.trim() === "") {
        console.log(`Tarea ${indice + 1}: titulo inválido.`);
        valida = false;
    }

    if (tarea.descripcion !== null && typeof tarea.descripcion !== "string") {
        console.log(`Tarea ${indice + 1}: descripcion inválida.`);
        valida = false;
    }

    if (!estadosValidos.includes(tarea.estado)) {
        console.log(`Tarea ${indice + 1}: estado inválido.`);
        valida = false;
    }

    if (!fechaValida(tarea.creacion)) {
        console.log(`Tarea ${indice + 1}: fecha de creación inválida.`);
        valida = false;
    }

    if (tarea.ultimaEdicion !== null && !fechaValida(tarea.ultimaEdicion)) {
        console.log(`Tarea ${indice + 1}: ultimaEdicion inválida.`);
        valida = false;
    }

    if (tarea.vencimiento !== null && !fechaValida(tarea.vencimiento)) {
        console.log(`Tarea ${indice + 1}: vencimiento inválido.`);
        valida = false;
    }

    if (![1, 2, 3].includes(tarea.dificultad)) {
        console.log(`Tarea ${indice + 1}: dificultad inválida.`);
        valida = false;
    }

    return valida;
}

// Convierte una tarea del JSON al formato interno
function convertirTarea(tarea: any): Tarea {

    let estado: string;

    if (tarea.estado === "PENDING") {
        estado = "Pendiente";
    } else if (tarea.estado === "IN-PROGRESS") {
        estado = "En curso";
    } else if (tarea.estado === "FINISHED") {
        estado = "Terminada";
    } else {
        estado = "Cancelada";
    }

    let dificultad: string;

    if (tarea.dificultad === 1) {
        dificultad = "Facil *";
    } else if (tarea.dificultad === 2) {
        dificultad = "Medio **";
    } else {
        dificultad = "Dificil ***";
    }

    return {
        nombre: tarea.titulo,
        descripcion: tarea.descripcion,
        estado: estado,
        dificultad: dificultad,
        creacion: new Date(tarea.creacion),
        ultimaModificacion: tarea.ultimaEdicion === null
            ? null
            : new Date(tarea.ultimaEdicion),
        vencimiento: tarea.vencimiento
    };
}

// CARGAR TAREAS
export async function cargarTareasArchivo(): Promise<Tarea[]> {

    try {

        const contenido = await readFile("./tasks.json", "utf-8");

        const tareasJSON = JSON.parse(contenido);

        if (!Array.isArray(tareasJSON)) {
            throw new Error("El archivo debe contener un array de tareas.");
        }

        let todasValidas = true;

        for (let i = 0; i < tareasJSON.length; i++) {

            if (!validarTarea(tareasJSON[i], i)) {
                todasValidas = false;
            }
        }

        if (!todasValidas) {
            throw new Error("Hay tareas con datos inválidos.");
        }

        const tareas: Tarea[] = tareasJSON.map(convertirTarea);

        console.log(`Se cargaron ${tareas.length} tareas correctamente.`);

        return tareas;

    } catch (error) {

        console.log("Error al cargar el archivo tasks.json.");

        if (error instanceof Error) {
            console.log(error.message);
        }

        return [];
    }
}

// GUARDAR TAREAS
export async function guardarTareasArchivo(tareas: Tarea[]): Promise<void> {

    try {

        // Convierte las tareas al formato original del JSON
        const tareasJSON = tareas.map(tarea => {

            let estado: string;

            if (tarea.estado === "Pendiente") {
                estado = "PENDING";
            } else if (tarea.estado === "En curso") {
                estado = "IN-PROGRESS";
            } else if (tarea.estado === "Terminada") {
                estado = "FINISHED";
            } else {
                estado = "CANCELED";
            }

            let dificultad: number;

            if (tarea.dificultad === "Facil *") {
                dificultad = 1;
            } else if (tarea.dificultad === "Medio **") {
                dificultad = 2;
            } else {
                dificultad = 3;
            }

            return {
                titulo: tarea.nombre,
                descripcion: tarea.descripcion,
                estado: estado,
                creacion: tarea.creacion.toISOString(),
                ultimaEdicion: tarea.ultimaModificacion === null
                    ? null
                    : tarea.ultimaModificacion.toISOString(),
                vencimiento: tarea.vencimiento,
                dificultad: dificultad
            };
        });

        const contenido = JSON.stringify(tareasJSON, null, 4);

        await writeFile("./tasks.json", contenido, "utf-8");

        console.log("Tareas guardadas correctamente.");

    } catch (error) {

        console.log("Error al guardar las tareas.");

        if (error instanceof Error) {
            console.log(error.message);
        }

        throw error;
    }
}
