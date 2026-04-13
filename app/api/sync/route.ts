import { NextRequest, NextResponse } from "next/server";
import pool from "../../../lib/server/mysql";
import { encuestaSchema } from "../../../lib/shared/validators";


export async function POST(req: NextRequest) {
  try {
    const datosRecibidos = await req.json();

    // AQUÍ ES DONDE ZOD TRABAJA DE VERDAD:
    const validacion = encuestaSchema.safeParse(datosRecibidos);
    
    if (!validacion.success) {
      console.error("Zod bloqueó una encuesta corrupta:", validacion.error.issues);
      return NextResponse.json({ ok: false, error: "Datos inválidos", detalles: validacion.error.issues }, { status: 400 });
    }

    const encuesta = validacion.data;

    await pool.execute(
      `INSERT IGNORE INTO encuestas 
        (folio, encuestador_id, nombre_encuestado, nombre, apellido_paterno, 
         apellido_materno, edad, sexo, fecha_hora, lat, lng, lugar,
         p1, p2, p2cual, p3, p3lengua, p4, p4_folio, p5_folio, p6, p6cuantos, estado_sinc, sincronizado_en)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, NOW())`,
      [
        encuesta.folio ?? null,
        encuesta.encuestador ?? null,
        encuesta.nombreEncuestado ?? null,
        encuesta.nombre ?? null,
        encuesta.apellidoPaterno ?? null,
        encuesta.apellidoMaterno ?? null,
        encuesta.edad ?? null,
        encuesta.sexo ?? null,
        encuesta.fechaHora?.slice(0, 19).replace("T", " ") ?? null,
        encuesta.ubicacion?.lat ?? null,
        encuesta.ubicacion?.lng ?? null,
        encuesta.lugar ?? null,
        encuesta.respuestas?.p1 ?? null,
        encuesta.respuestas?.p2 ?? null,
        encuesta.respuestas?.p2cual ?? null,
        encuesta.respuestas?.p3 ?? null,
        encuesta.respuestas?.p3lengua ?? null,
        encuesta.respuestas?.p4 ?? null,
        encuesta.respuestas?.p4_folio ?? null,
        encuesta.respuestas?.p5_folio ?? null,
        encuesta.respuestas?.p6 ?? null,
        encuesta.respuestas?.p6cuantos ?? null,
      ],
    );

    return NextResponse.json({ ok: true });
  } catch (error: any) {
    console.error("Error al sincronizar:", error);
    return NextResponse.json(
      { ok: false, error: error.message },
      { status: 500 },
    );
  }
}
