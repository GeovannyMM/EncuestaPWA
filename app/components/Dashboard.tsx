"use client";
import { useState, useEffect } from "react";
import { db } from "../../lib/client/db";
import { Montserrat } from "next/font/google";
import Image from "next/image";
import {
  LogOut,
  PlusCircle,
  CheckCircle2,
  Clock,
  MapPin,
  Trash2,
  Menu,
  User,
  NotebookPen,
  Hash,
  AlertCircle,
} from "lucide-react";

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400", "600", "800"],
});

type Props = {
  onNuevaEncuesta: () => void;
  nombreEncuestador: string;
  encuestadorId: number;
  onCerrarSesion: () => void;
};

export default function Dashboard({
  onNuevaEncuesta,
  nombreEncuestador,
  encuestadorId,
  onCerrarSesion,
}: Props) {
  const [encuestasReales, setEncuestasReales] = useState<any[]>([]);

  const [totalEncuestas, setTotalEncuestas] = useState(0);
  const [menuAbierto, setMenuAbierto] = useState(false);

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const todas = await db.encuestas
          .where("encuestador")
          .equals(encuestadorId)
          .reverse()
          .sortBy("fechaHora");

        setTotalEncuestas(todas.length);
        setEncuestasReales(todas.slice(0, 20));
      } catch (error) {
        console.error("error al cargar DEXIE", error);
      }
    };
    cargarDatos();
  }, [encuestadorId]);

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

    window.addEventListener("online", resolverLugaresPendientes);

    return () => {
      window.removeEventListener("online", resolverLugaresPendientes);
    };
  }, [encuestasReales]);

  const borrarEncuesta = async (id: number) => {
    const confirmar = window.confirm(
      "¿Seguro que quieres borrar esta encuesta?",
    );
    if (confirmar) {
      await db.encuestas.delete(id);

      setEncuestasReales((prev) => prev.filter((e) => e.id !== id));
      setTotalEncuestas((prev) => prev - 1);
    }
  };

  const sincronizarEncuestas = async () => {
    const pendientes = encuestasReales.filter(
      (e) => !e.estado_sinc && (e.lugar !== "" || e.ubicacion.lat === 0),
    );
    if (pendientes.length === 0) {
      return;
    }

    let exitosas = 0;
    for (const enc of pendientes) {
      try {
        const res = await fetch("/api/sync", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(enc),
        });
        const data = await res.json();
        if (data.ok) {
          await db.encuestas.update(enc.id, { estado_sinc: true });
          setEncuestasReales((prev) =>
            prev.map((e) =>
              e.id === enc.id ? { ...e, estado_sinc: true } : e,
            ),
          );

          exitosas++;
        }
      } catch {}
    }
  };

  useEffect(() => {
    if (navigator.onLine) {
      sincronizarEncuestas();
    }

    window.addEventListener("online", sincronizarEncuestas);

    return () => {
      window.removeEventListener("online", sincronizarEncuestas);
    };
  }, [encuestasReales]);

  return (
    <div className="flex flex-col h-full w-full overflow-hidden bg-white relative">
      <div className="flex items-center justify-between px-4 pt-3 relative z-50 mb-3">
        <div className="relative">
          <button
            onClick={() => setMenuAbierto(!menuAbierto)}
            className="p-2 -ml-2 rounded-xl active:bg-gray-100 transition-colors "
          >
            <Menu className="w-8 h-8 text-slate-800" />
          </button>
          {menuAbierto && (
            <div className="absolute left-0 mt-3 w-56 bg-white shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] border border-gray-100 rounded-2xl overflow-hidden py-2">
              <button
                onClick={onCerrarSesion}
                className="w-full flex items-center gap-3 px-5 py-4 text-red-600 font-bold hover:bg-red-50 transition-colors"
              >
                <LogOut className="w-5 h-5" />
                <span className="text-sm uppercase tracking-wider">
                  Cerrar Sesión
                </span>
              </button>
            </div>
          )}
        </div>

        {/* === LOGO === */}
        <div className="pr-2 drop-shadow-sm">
          <Image
            src="/corazonchiapas.svg"
            alt="Logo Corazón Chiapas"
            width={60}
            height={60}
            className="object-contain"
            priority
          />
        </div>
      </div>

      {/* -------TITULO INICIO----- */}
      <div className="flex flex-col px-6 pt-2 mb-10 mt-5">
        <h1
          className={`${montserrat.className} text-[30px] text-slate-900 font-extrabold 
          tracking-tighter uppercase leading-none`}
        >
          ¡Hola de nuevo, <br />
          <span className="text-red-600 font-extrabold">
            {nombreEncuestador}!
          </span>
        </h1>

        <div className="h-1 w-40 bg-green-700 mt-3 rounded-full" />
      </div>

      {/* -----------  TEXTO DE Encuestas Realizadas --------------------- */}

      <div className="px-7 pb-6 flex items-center justify-between">
        <h1 className="text-[25px] font-extrabold flex items-center gap-3 text-slate-900 tracking-tight">
          <NotebookPen className="w-8 h-8 text-black opacity-80" />
          Encuestas Realizadas
        </h1>
        <div className="bg-gray-100 text-gray-500 font-extrabold px-4 py-1.5 rounded-2xl text-lg border border-gray-200 shadow-sm">
          {totalEncuestas}
        </div>
      </div>
      {/*----------------------------------------cards contenedor de encuestas------------------------------*/}
      <div className="flex-1 overflow-y-auto px-6 pb-6 flex flex-col gap-6">
        {encuestasReales.length === 0 ? (
          <p className="text-gray-400 italic text-center mt-10">
            Aún no hay encuestas realizadas
          </p>
        ) : (
          encuestasReales.map((enc) => (
            <div
              key={enc.folio}
              className="bg-[#FF4D58] rounded-2xl p-6 flex flex-col shadow-xl shadow-red-200/50
          text-white relative"
            >
              <div className="flex justify-between items-center mb-3 gap-4">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="bg-white/20 p-2 rounded-full shrink-0">
                    <User className="w-5 h-5 text-white" />
                  </div>
                  <h2
                    className={`text-lg font-bold tracking-tighter truncate text-white ${montserrat.className}`}
                  >
                    {enc.nombreEncuestado}
                  </h2>
                </div>

                <div className="shrink-0">
                  {enc.estado_sinc ? (
                    <CheckCircle2 className="w-7 h-7 stroke-[3px] text-green-300 drop-shadow-md" />
                  ) : (
                    <AlertCircle
                      className="w-7 h-7 stroke-[3px] text-yellow-300 drop-shadow-md animate-pulse"
                      style={{
                        animationDuration: "4s",
                      }}
                    />
                  )}
                </div>
              </div>

              <p className="flex items-center gap-3 text-white/90 text-lg font-bold mb-1 tracking-wider">
                <Hash className="w-6 h-6 text-white shrink-0" />
                Folio: {enc.folio}
              </p>

              <div className="flex flex-col gap-3">
                <div className="flex item-center gap-3 text-white font-semibold text-lg">
                  <Clock className="w-6 h-6 fill-white text-[#FA5B5B]" />
                  {new Date(enc.fechaHora).toLocaleString("es-MX", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>

                <div className="flex items-center gap-3 text-white font-semibold text-lg w-10/12">
                  <MapPin className="w-6 h-6 fill-white text-[#FA5B5B] shrink-0" />
                  <span className="truncate leading-tight">
                    Lugar:{" "}
                    {enc.lugar ||
                      (enc.ubicacion.lat === 0
                        ? "Ubicación no disponible"
                        : "Guardado sin conexión (Buscando ciudad...)")}
                  </span>
                </div>
              </div>
              {/* === BOTÓN FLOTANTE ESQUINA INFERIOR DERECHA === */}
              <div className="absolute bottom-6 right-6">
                <button
                  onClick={() => borrarEncuesta(enc.id)}
                  className="bg-white/20 p-3 rounded-full hover:bg-white/40 hover:scale-105 transition-all text-white shadow-xl"
                  title="Eliminar Encuesta"
                >
                  <Trash2 className="w-6 h-6" />
                </button>
              </div>
              {/* ============================================== */}
            </div>
          ))
        )}
      </div>

      {/* === CONTENEDOR DEL BOTÓN PRINCIPAL === */}
      <div className="px-6 py-6 mt-auto bg-linear-to-t from-white via-white to-transparent">
        <button
          className="group bg-red-800 text-white text-2xl rounded-xl py-6 w-full font-bold shadow-2xl 
          shadow-red-900/30 hover:bg-black active:scale-90 active:bg-red-900 
          transition-all duration-300 ease-out flex justify-center items-center gap-3"
          onClick={onNuevaEncuesta}
        >
          <PlusCircle className="w-7 h-7 transition-transform duration-300 group-active:rotate-45 group-hover:scale-110" />
          Nueva Encuesta
        </button>
      </div>
    </div>
  );
}
