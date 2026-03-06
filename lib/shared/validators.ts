import { z } from "zod";



// La palabra 'export' es CLAVE para que otros archivos lo vean
export const encuestaSchema = z.object({
    entrevistador: z.string().min(5),
    folio: z.string(),
    nombreEncuestado: z.string().min(5),
    ubicacion: z.object({
        lat: z.number(),
        lng: z.number(),
    }).optional(),
    respuestas: z.record(z.string(), z.any()),
    fechaHora: z.string(),
});

// Exportamos el Tipo para que Dexie sepa qué forma tienen los datos
export type Encuesta = z.infer<typeof encuestaSchema>;