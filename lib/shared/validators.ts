import { z } from "zod";

export const usuarioSchema = z.object({
  id: z.number(),
  nombre_completo: z.string(),
  usuario_slug: z.string(),
});
export type Usuario = z.infer<typeof usuarioSchema>;

// La palabra 'export' es CLAVE para que otros archivos lo vean
export const encuestaSchema = z.object({
  entrevistador: z.number(),
  folio: z.string(),
  nombreEncuestado: z.string().min(5),
  ubicacion: z
    .object({
      lat: z.number(),
      lng: z.number(),
    })
    .optional(),
  lugar : z.string().optional(),
  respuestas: z.record(z.string(), z.any()),
  fechaHora: z.string(),
  estado_sinc: z.boolean(),
});

// Exportamos el Tipo para que Dexie sepa qué forma tienen los datos
export type Encuesta = z.infer<typeof encuestaSchema>;
