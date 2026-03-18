import { NextRequest, NextResponse } from "next/server";
import pool from "../../../lib/server/mysql";

// Fíjate que ahora dice (req: NextRequest)
export async function GET(req: NextRequest) {
  try {
    // 1. Atrapamos tu fecha
    const lastSync = req.nextUrl.searchParams.get("lastSync");

    let query = "SELECT id, nombre_completo, usuario_slug FROM usuarios WHERE activo = 1";
    const values: any[] = [];

    // 2. Si nos mandaste fecha, aplicamos el filtro en MySQL 
    if (lastSync) {
      const fechaMySQL = new Date(lastSync).toISOString().slice(0, 19).replace('T', ' ');
      query += " AND creado_en > ?";
      values.push(fechaMySQL);
    }

    // 3. Ejecutamos nuestra súper consulta
    const [rows] = await pool.query(query, values);

    return NextResponse.json({ ok: true, data: rows });

  } catch (error: any) {
    console.error("Error en GET /usuarios:", error);
    return NextResponse.json(
      { 
        ok: false, 
        message: "Error al obtener los usuarios",
        error: process.env.NODE_ENV === "development" ? error.message : undefined 
      },
      { status: 500 }
    );
  }
}
