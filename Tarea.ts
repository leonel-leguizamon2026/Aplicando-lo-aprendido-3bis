export type Tarea = {
    nombre: string;
    descripcion: string | null;
    estado: string;
    dificultad: string;
    creacion: Date;
    ultimaModificacion: Date | null;
    vencimiento: string | null;
};