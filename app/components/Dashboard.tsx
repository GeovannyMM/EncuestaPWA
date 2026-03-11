"use client";
import { useState, useEffect } from "react";
import { db } from "../../lib/client/db";

type Encuesta = {
  folio: string;
  encuestado: string;
  fecha: string;
  lugar: string;
  sincronizada: boolean;
};

type Props = {
  onNuevaEncuesta: () => void;
  nombreEntrevistador: string;
  entrevistadorId: number;
};

export default function Dashboard({
  onNuevaEncuesta,
  nombreEntrevistador,
  entrevistadorId,
}: Props) {
  {
    /*datos temporales en lo que conecto a Dexie*/
  }

  // se guardan las encuestas que se traen de DEXIEs
  const [encuestasReales, setEncuestasReales] = useState<any[]>([]);

  //se muestra el total de encuestas guardadas
  const [totalEncuestas, setTotalEncuestas] = useState(0);

  //funcion que se activa junto al dashboard
  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const todas = await db.encuestas
          .where("entrevistador")
          .equals(entrevistadorId)
          .reverse()
          .sortBy("fechaHora");

        setTotalEncuestas(todas.length);
        setEncuestasReales(todas.slice(0, 20));
      } catch (error) {
        console.error("error al cargar DEXIE", error);
      }
    };
    cargarDatos();
  }, [entrevistadorId]);

  return (
    <div className="flex flex-col min-h-screen p-6 gap-6">
      <p className="text-2xl">
        Bienvenido, <strong>{nombreEntrevistador}</strong>
      </p>
      {/*titulo de la seccion con total real*/}
      <h1 className="text-3xl font-bold">
        Encuestas Realizadas
        <span className="text-gray-400 text-xl"> ({totalEncuestas}) </span>
      </h1>
      {/*scroll horizontal*/}
      <div className="flex gap-4 overflow-x-auto pb-2">
        {encuestasReales.length === 0 ? (
          <p className="text-gray-400 italic">
            {" "}
            Aún no hay encuestas realizadas
          </p>
        ) : (
          encuestasReales.map((enc) => (
            <div
              key={enc.folio}
              className="min-w-[220px] border border-gray-200 rounded-xl p-4 flex flex-col gap-2 shadow-sm bg-white"
            >
              <p className="text-lg font-bold truncate">{enc.folio}</p>
              <p className="text-base text-gray-700 font-medium truncate">
                {enc.nombreEncuestado}
              </p>
              <p className="text-sm text-gray-400">
                {new Date(enc.fechaHora).toLocaleDateString("es-MX", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
              <p className="text-sm text-gray-400 truncate">
                {enc.ubicacion.lat === 0 ? "sin GPS" : "Con ubicación de GPS"}
              </p>
              {/* status: verde si sincronizada, naranja si pendiente */}
              <span
                className={`text-sm font-bold mt-2 ${enc.estado_sinc ? "text-green-500" : "text-orange-500"}`}
              >
                {enc.estado_sinc ? "✅ Sincronizada" : "🟠 Pendiente"}
              </span>
            </div>
          ))
        )}
      </div>
      {/* botón principal, mt-auto lo empuja hasta abajo */}
      <button
        className="bg-black text-white text-2xl rounded-xl p-6 w-full mt-auto mb-4 font-bold shadow-lg"
        onClick={onNuevaEncuesta}
      >
        Nueva Encuesta +
      </button>
    </div>
  );
}
