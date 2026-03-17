"use client";
import { useState, useEffect } from "react";
import { db } from "../../lib/client/db";

type Props = {
  onNuevaEncuesta: () => void;
  nombreEntrevistador: string;
  entrevistadorId: number;
  onCerrarSesion: () => void;
};

export default function Dashboard({
  onNuevaEncuesta,
  nombreEntrevistador,
  entrevistadorId,
  onCerrarSesion,
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

  //con conexion

  useEffect(() => {
    const resolverLugaresPendientes = async () => {
      if (!navigator.onLine) return;
      const pendientes = encuestasReales.filter(
        (e) => !e.lugar && e.ubicacion.lat !== 0,
      );
      if (pendientes.length == 0) return;

      for (const enc of pendientes) {
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${enc.ubicacion.lat}&lon=${enc.ubicacion.lng}&format=json`,
          );
          const data = await res.json();
          const nombreLugar =
            data.address.city ||
            data.address.town ||
            data.address.village ||
            "Lugar desconocido";
          await db.encuestas.update(enc.id, { lugar: nombreLugar });
          setEncuestasReales((prev) =>
            prev.map((e) =>
              e.id === enc.id ? { ...e, lugar: nombreLugar } : e,
            ),
          );
        } catch {}
      }
    };
    resolverLugaresPendientes();
  }, [encuestasReales]);

  const borrarEncuesta = async (id: number) => {
    const confirmar = window.confirm(
      "¿Seguro que quieres borrar esta encuesta?",
    );
    if (confirmar) {
      await db.encuestas.delete(id);
      // Recarga la lista quitando la borrada
      setEncuestasReales((prev) => prev.filter((e) => e.id !== id));
      setTotalEncuestas((prev) => prev - 1);
    }
  };

  return (
    <div className="flex flex-col min-h-screen p-6 gap-6">
      <p className="text-2xl">
        Bienvenido, <strong>{nombreEntrevistador}</strong>
      </p>
      <button
        onClick={onCerrarSesion}
        className="text-red-500 text-sm underline"
      >
        Cerrar Sesión
      </button>
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
                {enc.lugar ||
                  (enc.ubicacion.lat === 0
                    ? "Sin ubicación"
                    : `${enc.ubicacion.lat.toFixed(4)}, ${enc.ubicacion.lng.toFixed(4)}`)}
              </p>
              {/* status: verde si sincronizada, naranja si pendiente */}
              <span
                className={`text-sm font-bold mt-2 ${enc.estado_sinc ? "text-green-500" : "text-orange-500"}`}
              >
                {enc.estado_sinc ? "✅ Sincronizada" : "🟠 Pendiente"}
              </span>
              <button
                onClick={() => borrarEncuesta(enc.id)}
                className="text-red-400 text-sm underline mt-1"
              >
                Borrar
              </button>
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
