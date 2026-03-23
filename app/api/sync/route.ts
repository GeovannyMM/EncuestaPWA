import { NextRequest, NextResponse } from "next/server";
import pool from "../../../lib/server/mysql";

export async function POST(req: NextRequest) {
  try {
    const encuesta = await req.json();

    await pool.execute(
      `INSERT IGNORE INTO encuestas 
        (folio, entrevistador_id, nombre_encuestado, nombre, apellido_paterno, 
         apellido_materno, edad, fecha_hora, lat, lng, lugar,
         p1, p2, p2cual, p3, p3lengua, p4, p4escrito, p5, p6, p6cuantos)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        encuesta.folio,
        encuesta.entrevistador,
        encuesta.nombreEncuestado,
        encuesta.nombre,
        encuesta.apellidoPaterno,
        encuesta.apellidoMaterno,
        encuesta.edad,
        encuesta.fechaHora.slice(0, 19).replace("T", " "),
        encuesta.ubicacion?.lat ?? null,
        encuesta.ubicacion?.lng ?? null,
        encuesta.lugar ?? null,
        encuesta.respuestas?.p1,
        encuesta.respuestas?.p2,
        encuesta.respuestas?.p2cual,
        encuesta.respuestas?.p3,
        encuesta.respuestas?.p3lengua,
        encuesta.respuestas?.p4,
        encuesta.respuestas?.p4escrito,
        encuesta.respuestas?.p5,
        encuesta.respuestas?.p6,
        encuesta.respuestas?.p6cuantos,
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
