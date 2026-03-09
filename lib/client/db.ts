import Dexie, { type Table } from "dexie";
import { type Encuesta } from "../shared/validators";

export {};
export class EncuestasDB extends Dexie {
  encuestas!: Table<Encuesta>;

  constructor() {
    super("EncuestasDB");
    this.version(1).stores({
      encuestas:
        "++id, entrevistador, folio, nombreEncuestado, fechaHora, ubicacion",
    });
  }
}
