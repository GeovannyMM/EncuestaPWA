import Dexie, { type Table } from "dexie";
import { type Encuesta, type Usuario } from "../shared/validators";

export { };
export class EncuestasDB extends Dexie {
    encuestas!: Table<Encuesta>;
    usuarios!: Table<Usuario>;

    constructor() {
        super("EncuestasDB");
        this.version(1).stores({
            encuestas:
                "++id, entrevistador, folio, nombreEncuestado, fechaHora, ubicacion, estado_sinc",
            usuarios: "id, nombre_completo, usuario_slug"
        });
    }
}

export const db = new EncuestasDB();
