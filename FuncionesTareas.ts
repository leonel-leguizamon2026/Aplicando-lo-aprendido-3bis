
import { Tarea } from "./Tarea";
import { guardarTareasArchivo } from "./persistencia";

// BUSCAR TAREA
export async function BuscarTarea(
    tareas: Tarea[],
    rl: typeof import("readline-sync")
): Promise<void> {

    if (tareas.length === 0) {
        console.log("NO HAY TAREAS");
        return;
    }

    const busqueda = rl.question("Introduce el titulo de una Tarea para buscarla: ");
    let encontrada = false;

    console.log(" ");
    console.log("RESULTADOS DE LA BUSQUEDA: ");

    for (let i = 0; i < tareas.length; i++) {
        if (tareas[i].nombre.toLowerCase().includes(busqueda.toLowerCase())) {
            console.log("TAREA [", i + 1, "] ", tareas[i].nombre);
            encontrada = true;
        }
    }

    if (encontrada) {
        console.log(" ");
        console.log("¿Deseas ver los detalles de alguna?");

        const detalle = rl.questionInt("Introduce el numero para verla o 0 para volver: ");

        if (detalle !== 0) {
            await MostrarDetalles(detalle, tareas, rl);
        }

    } else {
        console.log(" ");
        console.log("No hay tareas relacionadas con la búsqueda.");
    }
}


// MOSTRAR DETALLES
export async function MostrarDetalles(
    Indice: number,
    tareas: Tarea[],
    rl: typeof import("readline-sync")
): Promise<void> {

    if (Indice === 0) {
        return;
    }

    if (tareas.length === 0) {
        console.log("NO HAY TAREAS");

    } else if (Indice < 1 || Indice > tareas.length) {
        console.log("Valor invalido.");

    } else {

        const tarea = tareas[Indice - 1];

        console.log("Nombre: ", tarea.nombre);

        if (tarea.descripcion === null || tarea.descripcion === "") {
            console.log("DESCRIPCION: No hay descripcion");
        } else {
            console.log("DESCRIPCION: ", tarea.descripcion);
        }

        console.log("ESTADO: ", tarea.estado);
        console.log("DIFICULTAD: ", tarea.dificultad);
        console.log("CREACION: ", tarea.creacion);
        console.log("ULTIMA MODIFICACION: ", tarea.ultimaModificacion);

        if (tarea.vencimiento === null || tarea.vencimiento === "") {
            console.log("VENCIMIENTO: No hay fecha de vencimiento");
        } else {
            console.log("VENCIMIENTO: ", tarea.vencimiento);
        }
    }

    console.log("Si desea editar la tarea presione E, sino 0 para volver");

    const edit = rl.question("Ingrese una opcion: ");

    if (edit === "E" || edit === "e") {
        await EditarTarea(Indice, tareas, rl);
    }
}


// INDICE
export async function Indice(
    Indice: number,
    Estado: string | null,
    tareas: Tarea[],
    rl: typeof import("readline-sync")
): Promise<void> {

    if (Indice === 0) {
        return;
    }

    if (Indice < 1 || Indice > tareas.length) {
        console.log("Valor invalido. Ingrese uno de los numeros mostrados en pantalla.");

    } else if (Estado !== null && tareas[Indice - 1].estado !== Estado) {
        console.log("Valor invalido. Ingrese uno de los numeros mostrados en pantalla.");

    } else {
        await MostrarDetalles(Indice, tareas, rl);
    }
}


// EDITAR TAREA
export async function EditarTarea(
    Indice: number,
    tareas: Tarea[],
    rl: typeof import("readline-sync")
): Promise<void> {

    if (Indice < 1 || Indice > tareas.length) {
        console.log("Indice invalido");
        return;
    }

    const tarea = tareas[Indice - 1];

    console.log(" ");
    console.log("Si desea mantener los atributos de la tarea, presione Enter sin escribir nada");

    // EDITAR NOMBRE
    const NuevoNombre = rl.question("Ingrese el nuevo nombre de la tarea: ");

    if (NuevoNombre === "") {
        console.log("Se mantiene el nombre actual");

    } else if (NuevoNombre.trim() === "") {
        console.log("El titulo no puede quedar vacio. No se actualizo el nombre");

    } else if (NuevoNombre.length <= 100) {
        console.log("Nombre Actualizado");
        tarea.nombre = NuevoNombre;

    } else {
        console.log("El titulo no puede superar los 100 caracteres. No se actualizo el nombre");
    }


    // EDITAR DESCRIPCION
    const NuevaDescripcion = rl.question("Ingrese la nueva descripcion de la tarea: ");

    if (NuevaDescripcion === " ") {
        console.log("Descripcion eliminada");
        tarea.descripcion = null;

    } else if (NuevaDescripcion !== "") {

        if (NuevaDescripcion.length <= 500) {
            console.log("Descripcion Actualizada");
            tarea.descripcion = NuevaDescripcion;

        } else {
            console.log("La descripcion no puede superar los 500 caracteres. No se actualizo la descripcion");
        }
    }


    // EDITAR ESTADO
    let NuevoEstado: string;

    do {
        console.log(" ");
        console.log("Ingrese el nuevo estado de la tarea:");

        NuevoEstado = rl.question(
            "1=Pendiente, 2=En curso, 3=Terminada, 4=Cancelada: "
        );

        if (NuevoEstado === "") {
            console.log("Se mantiene el estado actual");
            break;

        } else if (NuevoEstado === " ") {
            console.log("El estado no puede quedar vacio");

        } else if (!["1", "2", "3", "4"].includes(NuevoEstado)) {
            console.log("Valor invalido. Ingrese 1, 2, 3 o 4.");
        }

    } while (!["", "1", "2", "3", "4"].includes(NuevoEstado));

    if (NuevoEstado === "1") {
        tarea.estado = "Pendiente";
        console.log("Estado Actualizado");

    } else if (NuevoEstado === "2") {
        tarea.estado = "En curso";
        console.log("Estado Actualizado");

    } else if (NuevoEstado === "3") {
        tarea.estado = "Terminada";
        console.log("Estado Actualizado");

    } else if (NuevoEstado === "4") {
        tarea.estado = "Cancelada";
        console.log("Estado Actualizado");
    }


    // EDITAR DIFICULTAD
    console.log(" ");
    console.log("Ingrese la nueva dificultad de la tarea:");

    const NuevaDificultad = rl.question(
        "1=Facil, 2=Medio, 3=Dificil: "
    );

    if (NuevaDificultad === "") {
        console.log("Se mantiene la dificultad actual");

    } else if (NuevaDificultad === " ") {
        console.log("La dificultad no puede quedar vacia. No se actualizo");

    } else if (NuevaDificultad === "1") {
        tarea.dificultad = "Facil *";
        console.log("Dificultad Actualizada");

    } else if (NuevaDificultad === "2") {
        tarea.dificultad = "Medio **";
        console.log("Dificultad Actualizada");

    } else if (NuevaDificultad === "3") {
        tarea.dificultad = "Dificil ***";
        console.log("Dificultad Actualizada");

    } else {
        console.log("Valor invalido. No se actualizo la dificultad.");
    }


    // EDITAR VENCIMIENTO
    console.log(" ");

    let NuevoVencimiento: string;

    do {
        NuevoVencimiento = rl.question(
            "Ingrese la fecha de vencimiento (DD/MM/AAAA), Enter para mantener o espacio para borrar: "
        );

        if (NuevoVencimiento === "") {
            break;

        } else if (NuevoVencimiento === " ") {
            tarea.vencimiento = null;
            console.log("Fecha de vencimiento eliminada");
            break;

        } else if (NuevoVencimiento.length !== 10) {
            console.log("Formato invalido. Use DD/MM/AAAA");

        } else if (
            NuevoVencimiento[2] !== "/" ||
            NuevoVencimiento[5] !== "/"
        ) {
            console.log("Formato invalido. Use DD/MM/AAAA");

        } else {
            tarea.vencimiento = NuevoVencimiento;
            console.log("Fecha de vencimiento actualizada");
            break;
        }

    } while (true);


    // ULTIMA MODIFICACION
    tarea.ultimaModificacion = new Date();

    console.log("Tarea modificada");


    // GUARDA LAS MODIFICACIONES EN EL JSON
    await guardarTareasArchivo(tareas);
}


// MOSTRAR TAREAS
export async function MostrarTareas(
    tareas: Tarea[],
    rl: typeof import("readline-sync"),
    Estado: string
): Promise<void> {

    if (tareas.length === 0) {
        console.log("NO HAY TAREAS");
        return;
    }

    if (Estado === "Todas") {

        for (let i = 0; i < tareas.length; i++) {
            console.log("TAREA [", i + 1, "] ", tareas[i].nombre);
        }

    } else {

        for (let i = 0; i < tareas.length; i++) {
            if (tareas[i].estado === Estado) {
                console.log("TAREA [", i + 1, "] ", tareas[i].nombre);
            }
        }
    }

    console.log("Desea ver los detalles de alguna");

    const Detalle = rl.questionInt("Introduce el numero para verla o 0 para volver: ");

    if (Detalle !== 0) {

        if (Estado === "Todas") {
            await MostrarDetalles(Detalle, tareas, rl);

        } else {
            await Indice(Detalle, Estado, tareas, rl);
        }
    }
}


// MOSTRAR TAREAS POR ESTADO
export async function MTEstado(
    Estado: string,
    tareas: Tarea[],
    rl: typeof import("readline-sync")
): Promise<void> {

    if (tareas.length === 0) {
        console.log("NO HAY TAREAS");
        return;
    }

    for (let i = 0; i < tareas.length; i++) {

        if (tareas[i].estado === Estado) {
            console.log("TAREA [", i + 1, "] ", tareas[i].nombre);
        }
    }

    console.log("Desea ver los detalles de alguna");

    const Detalle = rl.questionInt("Introduce el numero para verla o 0 para volver: ");

    if (Detalle !== 0) {
        await Indice(Detalle, Estado, tareas, rl);
    }
}
