
import { Tarea } from "./Tarea";
import { guardarTareasArchivo } from "./persistencia";

export async function CrearTarea(
    tareas: Tarea[],
    rl: typeof import("readline-sync")
): Promise<void> {

    let nombre: string;
    let descripcion: string;
    let estado: string;
    let dificultad: string;
    let vencimiento: string | null = null;

    // INGRESA TITULO Y CONTROLA
    do {
        nombre = rl.question("Ingrese el nombre de la tarea: ");

        if (nombre === "") {
            console.log("El titulo es obligatorio");
        } else if (nombre.length > 100) {
            console.log("El titulo no puede superar los 100 caracteres");
        }

    } while (nombre === "" || nombre.length > 100);

    // INGRESA DESCRIPCION Y CONTROLA
    do {
        descripcion = rl.question("Ingrese la descripcion de la tarea: ");

        if (descripcion.length > 500) {
            console.log("La descripcion no puede superar los 500 caracteres");
        }

    } while (descripcion.length > 500);

    // INGRESA ESTADO
    let opcionEstado: number;

    do {
        console.log("Estado de la tarea");

        opcionEstado = rl.questionInt(
            "1=Pendiente, 2=En curso, 3=Terminada, 4=Cancelada: "
        );

        if (![1, 2, 3, 4].includes(opcionEstado)) {
            console.log("Valor invalido, ingrese de nuevo");
        }

    } while (![1, 2, 3, 4].includes(opcionEstado));

    if (opcionEstado === 1) {
        estado = "Pendiente";
    } else if (opcionEstado === 2) {
        estado = "En curso";
    } else if (opcionEstado === 3) {
        estado = "Terminada";
    } else {
        estado = "Cancelada";
    }

    // INGRESA DIFICULTAD
    let opcionDificultad: number;

    do {
        console.log("Dificultad");

        opcionDificultad = rl.questionInt(
            "1=Facil, 2=Medio, 3=Dificil: "
        );

        if (![1, 2, 3].includes(opcionDificultad)) {
            console.log("Valor invalido, ingrese de nuevo");
        }

    } while (![1, 2, 3].includes(opcionDificultad));

    if (opcionDificultad === 1) {
        dificultad = "Facil *";
    } else if (opcionDificultad === 2) {
        dificultad = "Medio **";
    } else {
        dificultad = "Dificil ***";
    }

    // CREACION Y ULTIMA MODIFICACION
    const creacion = new Date();
    const ultimaModificacion = creacion;

    // VENCIMIENTO
    do {
        const fechaIngresada = rl.question(
            "Ingrese la fecha de vencimiento (DD/MM/AAAA) o Enter para dejarla vacia: "
        );

        if (fechaIngresada === "") {
            vencimiento = null;
            break;
        }

        if (
            fechaIngresada.length !== 10 ||
            fechaIngresada[2] !== "/" ||
            fechaIngresada[5] !== "/"
        ) {
            console.log("Formato invalido. Use DD/MM/AAAA");
        } else {
            vencimiento = fechaIngresada;
            break;
        }

    } while (true);

    // AGREGA LA TAREA
    tareas.push({
        nombre: nombre,
        descripcion: descripcion === "" ? null : descripcion,
        estado: estado,
        dificultad: dificultad,
        creacion: creacion,
        ultimaModificacion: ultimaModificacion,
        vencimiento: vencimiento
    });

    console.log("TAREA CREADA");

    // GUARDA EN EL JSON
    await guardarTareasArchivo(tareas);
}
