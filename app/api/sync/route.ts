import { NextRequest, NextResponse } from "next/server";
import pool from "../../../lib/server/mysql";

export async function POST(req: NextRequest) {
  try {
    const encuesta = await req.json();

    await pool.execute(
      `INSERT IGNORE INTO encuestas 
        (folio, entrevistador_id, nombre_encuestado, nombre, apellido_paterno, 
         apellido_materno, edad, sexo, fecha_hora, lat, lng, lugar,
         p1, p2, p2cual, p3, p3lengua, p4, p4escrito, p5, p6, p6cuantos, estado_sinc, sincronizado_en)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, NOW())`,
      [
        encuesta.folio ?? null,
        encuesta.entrevistador ?? null,
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
        encuesta.respuestas?.p4escrito ?? null,
        encuesta.respuestas?.p5 ?? null,
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
