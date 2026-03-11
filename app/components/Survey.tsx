"use client";
import { useState, useEffect } from "react";
import { db } from "../../lib/client/db";
import { generarFolio } from "../../lib/shared/utils";

type Props = {
  onTerminar: () => void;
  onCancelar: () => void;

  //recibe el id del entrevistador
  entrevistadorId: number;
  entrevistadorNombre: string;
};

type EtapaInterna = "datos_iniciales" | "preguntas";

export default function Survey({
  onTerminar,
  onCancelar,
  entrevistadorId,
  entrevistadorNombre,
}: Props) {
  const [etapa, setEtapa] = useState<EtapaInterna>("datos_iniciales");
  const [lat, setLat] = useState<number | null>(null); // latitud del GPS
  const [lng, setLng] = useState<number | null>(null); // longitud del GPS
  const [lugar, setLugar] = useState(""); // nombre del lugar en texto
  const [cargandoGPS, setCargandoGPS] = useState(false);
  const [errorGPS, setErrorGPS] = useState("");
  const [p1, setP1] = useState("");
  const [p2, setP2] = useState("");
  const [p2cual, setP2cual] = useState("");
  const [p3, setP3] = useState("");
  const [p3lengua, setP3lengua] = useState("");
  const [p4, setP4] = useState("");
  const [p4nombre, setP4nombre] = useState("");
  const [p5, setP5] = useState("");
  const [p6, setP6] = useState("");
  const [p6cuantos, setP6cuantos] = useState("");

  // pide la ubicación al navegador, espera y avisa si tuvo exito

  const capturarGPS = (): Promise<boolean> => {
    return new Promise((resolve) => {
      setErrorGPS("");
      if (!navigator.geolocation) {
        setErrorGPS("Tu navegador no soporta la geolocalización");
        resolve(false);
        return;
      }
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const latitud = pos.coords.latitude;
          const longitud = pos.coords.longitude;
          setLat(latitud);
          setLng(longitud);

          try {
            const res = await fetch(
              `https://nominatim.openstreetmap.org/reverse?lat=${latitud}&lon=${longitud}&format=json`,
            );
            const data = await res.json();
            setLugar(
              data.address.city ||
                data.address.town ||
                data.address.village ||
                "Lugar desconocido",
            );
          } catch (error) {
            setLugar("Error de conexión al mapa");
          }
          resolve(true); //GPS exitoso
        },
        //el usuario rechazo los permisos o el GPS esta desactivado
        (error) => {
          console.error("Error GPS:", error);
          setErrorGPS(
            "Atención: No podemos iniciar sin ubicación. Por favor, ENCIENDE tu GPS",
          );
          resolve(false);
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 },
      );
    });
  };

  // se ejecuta cuando se oprime comfirmar datos
  const handleComenzar = async () => {
    if (!p4nombre.trim()) {
      alert("Por favor, ingresa el Nombre del Encuestado para comenzar.");
      return;
    }
    //1.- pantalla "cargando..." y se deshabilita el boton de comfirmar datos
    setCargandoGPS(true);
    //2.- La promesa de la antena regresa verdad o falso
    const gpsExitoso = await capturarGPS();
    // se apaga la pantalla
    setCargandoGPS(false);

    if (gpsExitoso === true) {
      setEtapa("preguntas");
    }
  };

  const guardarEncuestaLocal = async () => {
    try {
      //1.-se crea el folio
      const nuevoFolio = generarFolio(entrevistadorId);

      //2.- empaqueta todo el schema de zod de validators.tsx
      const encuestaData = {
        entrevistador: entrevistadorId,
        folio: nuevoFolio,
        nombreEncuestado: p4nombre,
        fechaHora: new Date().toISOString(), //hora del dispositivo
        ubicacion: {
          lat: lat || 0,
          lng: lng || 0,
        },
        estado_sinc: false,
        respuestas: {
          p1,
          p2,
          p2cual,
          p3,
          p3lengua,
          p4,
          p5,
          p6,
          p6cuantos,
        },
      };

      //3.- mandamos a la base de datos interna Dexie
      await db.encuestas.add(encuestaData);

      //4.- si Dexie lo guadó, muestra un mensaje de exito
      onTerminar();
    } catch (error) {
      console.error("Error al guardar la encuesta:", error);
      alert("Error al guardar la encuesta. Intenta de nuevo.");
    }
  };

  const cancelarEncuesta = () => {
    const confirmar = window.confirm(
      "¿Seguro que quieres cancelar la encuesta?? no se guardaran los datos",
    );
    if (confirmar) {
      setP4nombre("");
      setP1("");
      setP2("");
      setP2cual("");
      setP3("");
      setP3lengua("");
      setP4("");
      setP5("");
      setP6("");
      setP6cuantos("");
      setLat(null);
      setLng(null);
      setLugar("");
      setEtapa("datos_iniciales");
      onCancelar();
    }
  };

  if (etapa === "datos_iniciales") {
    return (
      <div className="flex flex-col p-6 gap-8 pb-32 min-h-screen justify-center items-center">
        <div className="w-full max-w-sm flex flex-col gap-6 bg-white p-8 rounded-2xl shadow-lg border">
          <h1 className="text-gray-500 text-3xl font-bold text-center">
            Nueva Encuesta
          </h1>
          <p className="text-xl text-gray-500 text-center">
            Datos del encuestado
          </p>

          <div className="flex flex-col gap-2">
            <label className="text-gray-500 text-xl font-bold">
              Nombre Completo y edad:
            </label>
            <input
              className="border-gray-400 p-4 text-2xl rounded text-gray-500"
              placeholder="Escribe el nombre aquí"
              value={p4nombre}
              onChange={(e) => setP4nombre(e.target.value)}
              disabled={cargandoGPS}
            />
          </div>

          {errorGPS && (
            <div className="bg-red-100 text-red-500 rounded-xl text-center font-bold">
              {errorGPS}
            </div>
          )}

          <button
            className={`${cargandoGPS ? "opacity-50 cursor-not-allowed" : ""}  bg-red-500 text-white text-2xl rounded-xl 
            p-6 min-h-[80px] w-full mt-4 font-bold transition-all`}
            onClick={handleComenzar}
            disabled={cargandoGPS}
          >
            {cargandoGPS
              ? "Obteniendo ubicación..."
              : errorGPS
                ? "Intentar de nuevo"
                : "Comenzar Cuestionario"}
          </button>
          {!cargandoGPS && (
            <button
              className="bg-gray-400 text-taupe-950 tetx-xl rounded-xl p-4 w-full mt-2 font-bold"
              onClick={onCancelar}
            >
              Cancelar y regresar
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col p-6 gap-8 pb-32">
      <h1 className="text-3xl font-bold">Cuestionario</h1>

      {/* PREGUNTA 1 */}
      <div className="flex flex-col gap-3">
        <p className="text-2xl">
          1. ¿En los últimos años ha recibido algún programa de alfabetización?
        </p>
        <div className="flex gap-6">
          <label className="flex items-center gap-2 text-2xl">
            <input
              type="radio"
              name="p1"
              value="si"
              onChange={(e) => setP1(e.target.value)}
            />{" "}
            Sí
          </label>
          <label className="flex items-center gap-2 text-2xl">
            <input
              type="radio"
              name="p1"
              value="no"
              onChange={(e) => setP1(e.target.value)}
            />{" "}
            No
          </label>
        </div>
      </div>

      {/* PREGUNTA 2 */}
      <div className="flex flex-col gap-3">
        <p className="text-2xl">
          2. ¿Ha recibido apoyo económico de algún programa de alfabetización?
        </p>
        <div className="flex gap-6">
          <label className="flex items-center gap-2 text-2xl">
            <input
              type="radio"
              name="p2"
              value="si"
              onChange={(e) => setP2(e.target.value)}
            />{" "}
            Sí
          </label>
          <label className="flex items-center gap-2 text-2xl">
            <input
              type="radio"
              name="p2"
              value="no"
              onChange={(e) => setP2(e.target.value)}
            />{" "}
            No
          </label>
        </div>
        {p2 === "si" && (
          <div className="flex flex-col gap-2 mt-2">
            <p className="text-xl">Si la respuesta es sí, ¿cuál?</p>
            <div className="flex gap-4 flex-wrap">
              {["INEA", "Chiapas Puede", "Otro"].map((op) => (
                <label key={op} className="flex items-center gap-2 text-xl">
                  <input
                    type="radio"
                    name="p2cual"
                    value={op}
                    onChange={(e) => setP2cual(e.target.value)}
                  />{" "}
                  {op}
                </label>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* PREGUNTA 3 */}
      <div className="flex flex-col gap-3">
        <p className="text-2xl">3. ¿Sabe leer?</p>
        <div className="flex gap-6">
          <label className="flex items-center gap-2 text-2xl">
            <input
              type="radio"
              name="p3"
              value="si"
              onChange={(e) => setP3(e.target.value)}
            />{" "}
            Sí
          </label>
          <label className="flex items-center gap-2 text-2xl">
            <input
              type="radio"
              name="p3"
              value="no"
              onChange={(e) => setP3(e.target.value)}
            />{" "}
            No
          </label>
        </div>
        {p3 === "si" && (
          <div className="flex flex-col gap-2 mt-2">
            <p className="text-xl">
              Si la respuesta es sí, especifique en qué lengua
            </p>
            <div className="flex gap-4 flex-wrap">
              {["Español", "Tseltal", "Tsotsil", "Otro"].map((op) => (
                <label key={op} className="flex items-center gap-2 text-xl">
                  <input
                    type="radio"
                    name="p3lengua"
                    value={op}
                    onChange={(e) => setP3lengua(e.target.value)}
                  />{" "}
                  {op}
                </label>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* PREGUNTA 4 */}
      <div className="flex flex-col gap-3">
        <p className="text-2xl">4. ¿Sabe escribir?</p>
        <div className="flex gap-6">
          <label className="flex items-center gap-2 text-2xl">
            <input
              type="radio"
              name="p4"
              value="si"
              onChange={(e) => setP4(e.target.value)}
            />{" "}
            Sí
          </label>
          <label className="flex items-center gap-2 text-2xl">
            <input
              type="radio"
              name="p4"
              value="no"
              onChange={(e) => setP4(e.target.value)}
            />{" "}
            No
          </label>
        </div>

        {p4 === "si" && (
          <input
            className="border p-4 text-2xl rounded mt-2"
            placeholder="Escribe tu nombre y edad"
          />
        )}
      </div>

      {/* PREGUNTA 5 */}
      <div className="flex flex-col gap-3">
        <p className="text-2xl">5. Escriba las vocales</p>
        <input
          className="border p-4 text-2xl rounded"
          placeholder="Vocales"
          value={p5}
          onChange={(e) => setP5(e.target.value)}
        />
      </div>

      {/* PREGUNTA 6 */}
      <div className="flex flex-col gap-3">
        <p className="text-2xl">
          6. ¿Conoce a alguien que no sepa leer y escribir?
        </p>
        <div className="flex gap-6">
          <label className="flex items-center gap-2 text-2xl">
            <input
              type="radio"
              name="p6"
              value="si"
              onChange={(e) => setP6(e.target.value)}
            />{" "}
            Sí
          </label>
          <label className="flex items-center gap-2 text-2xl">
            <input
              type="radio"
              name="p6"
              value="no"
              onChange={(e) => setP6(e.target.value)}
            />{" "}
            No
          </label>
        </div>
        {p6 === "si" && (
          <input
            className="border p-4 text-2xl rounded mt-2"
            placeholder="¿Cuántos?"
            type="number"
            value={p6cuantos}
            onChange={(e) => setP6cuantos(e.target.value)}
          />
        )}
      </div>

      {/* BOTÓN FINALIZAR */}
      <button
        className="bg-red-600 text-white text-2xl rounded-xl p-6 min-h-[80px] w-full"
        onClick={guardarEncuestaLocal}
      >
        Guardar Encuesta ✓
      </button>

      <button
        className="bg-gray-500 tetx-black text-2xl font-bold rounded-xl p-6 min-h-[80px] w-full mb-4"
        onClick={cancelarEncuesta}
      >
        Cancelar Encuesta X
      </button>
    </div>
  );
}
