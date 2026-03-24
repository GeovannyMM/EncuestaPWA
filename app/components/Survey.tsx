"use client";
import { useState, useEffect } from "react";
import { db } from "../../lib/client/db";
import { generarFolio } from "../../lib/shared/utils";
import {
  User,
  FileUser,
  Hash,
  MapPin,
  ChevronDown,
  X,
  ArrowRight,
} from "lucide-react";

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
  const [guardando, setGuardando] = useState(false);
  const [p1, setP1] = useState("");
  const [p2, setP2] = useState("");
  const [p2cual, setP2cual] = useState("");
  const [p3, setP3] = useState("");
  const [p3lengua, setP3lengua] = useState("");
  const [p4, setP4] = useState("");
  const [nombre, setNombre] = useState("");
  const [apellidoPaterno, setApellidoPaterno] = useState("");
  const [apellidoMaterno, setApellidoMaterno] = useState("");
  const [edad, setEdad] = useState("");
  const [sexo, setSexo] = useState("");
  const [p4escrito, setP4escrito] = useState("");
  const [p5, setP5] = useState("");
  const [p6, setP6] = useState("");
  const [p6cuantos, setP6cuantos] = useState("");

  const handleEdadChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^\d*$/.test(value)) {
      setEdad(value);
    }
  };

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
            setLugar("Coordenadas guardas (sin conexión)");
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
    if (
      !nombre.trim() ||
      !apellidoPaterno.trim() ||
      !apellidoMaterno.trim() ||
      !edad.trim() ||
      !sexo
    ) {
      alert("Por favor, ingresa los datos del encuestado para comenzar.");
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
      setGuardando(true);
      //1.-se crea el folio
      const nuevoFolio = generarFolio(entrevistadorId);

      //2.- empaqueta todo el schema de zod de validators.tsx
      const encuestaData = {
        entrevistador: entrevistadorId,
        folio: nuevoFolio,
        nombreEncuestado:
          `${nombre} ${apellidoPaterno} ${apellidoMaterno}`.trim(),
        nombre,
        apellidoPaterno,
        apellidoMaterno,
        edad,
        sexo,
        fechaHora: new Date().toISOString(), //hora del dispositivo
        ubicacion: {
          lat: lat || 0,
          lng: lng || 0,
        },
        lugar: lugar,
        estado_sinc: false,
        respuestas: {
          p1,
          p2,
          p2cual,
          p3,
          p3lengua,
          p4,
          p4escrito,
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
      setGuardando(false);
    }
  };

  const cancelarEncuesta = () => {
    const confirmar = window.confirm(
      "¿Seguro que quieres cancelar la encuesta?? no se guardaran los datos",
    );
    if (confirmar) {
      setNombre("");
      setApellidoPaterno("");
      setApellidoMaterno("");
      setEdad("");
      setP1("");
      setP2("");
      setP2cual("");
      setP3("");
      setP3lengua("");
      setP4("");
      setP4escrito("");
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
      <div className="flex flex-col p-6 pt-20 bg-linear-to-b from-red-600 to-red-900 gap-8 pb-32 min-h-screen justify-center items-center">
        <div className="relative w-full max-w-sm flex flex-col gap-6 bg-white p-8 rounded-2xl shadow-lg border-white">
          <h1
            className="text-transparent bg-linear-to-r from-red-800 to-red-600 
          bg-clip-text text-4xl font-black text-center pt-3"
          >
            Nueva Encuesta
          </h1>

          {!cargandoGPS && (
            <button
              onClick={onCancelar}
              className="absolute font-bold top-3 right-3 p-2 text-gray-600 hover:text-red-500 hover:bg-red-50 
              rounded-full transition-all active:scale-90 shadow-sm border border-transparent 
              hover:border-red-100"
              title="Cancelar encuesta"
            >
              <X className="w-4 h-4 stroke-[3px]" />
            </button>
          )}
          <div className="relative flex items-center justify-center w-full">
            <div className="absolute left-0 pl flex items-center pointer-events-none">
              <FileUser className="h-6 w-6 text-gray-500" />
            </div>
            <p className="text-2xl text-gray-500 font-bold">
              Datos del encuestado
            </p>
          </div>

          {/* === CAMPO: NOMBRE === */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <User className="h-6 w-6 text-gray-400" />
            </div>
            <input
              className="w-full pl-12 pr-4 py-4 text-xl font-bold rounded-xl bg-gray-100 border 
              border-transparent text-gray-700 placeholder-gray-400 focus:bg-white focus:border-red-700 
              transition-all outline-none"
              placeholder="Nombre(s)"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              disabled={cargandoGPS}
            />
          </div>

          {/* === 2. CAMPO: APELLIDO PATERNO === */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <User className="h-6 w-6 text-gray-400 opacity-60" />
            </div>
            <input
              className="w-full pl-12 pr-4 py-4 text-xl font-bold rounded-xl bg-gray-100 border border-transparent text-gray-700 placeholder-gray-400 focus:bg-white focus:border-red-700 transition-all outline-none"
              placeholder="Apellido Paterno"
              value={apellidoPaterno}
              onChange={(e) => setApellidoPaterno(e.target.value)}
              disabled={cargandoGPS}
            />
          </div>
          {/* === 3. CAMPO: APELLIDO MATERNO === */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <User className="h-6 w-6 text-gray-400 opacity-60" />
            </div>
            <input
              className="w-full pl-12 pr-4 py-4 text-xl font-bold rounded-xl bg-gray-100 border border-transparent text-gray-700 placeholder-gray-400 focus:bg-white focus:border-red-700 transition-all outline-none"
              placeholder="Apellido Materno"
              value={apellidoMaterno}
              onChange={(e) => setApellidoMaterno(e.target.value)}
              disabled={cargandoGPS}
            />
          </div>
          {/* === 4. CAMPO: EDAD === */}
          <div className="flex gap-4">
            {/* 4a. EDAD (50% de ancho ancho "w-1/2") */}
            <div className="relative w-1/2">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Hash className="h-6 w-6 text-gray-400" />
              </div>
              <input
                type="number"
                className="w-full pl-12 pr-4 py-4 text-xl font-bold rounded-xl bg-gray-100 border border-transparent text-gray-700 placeholder-gray-400 focus:bg-white focus:border-red-700 transition-all outline-none"
                placeholder="Edad"
                min={1}
                max={120}
                value={edad}
                onChange={handleEdadChange}
                onKeyDown={(e) => {
                  if (["e", "E", "-", ".", "+"].includes(e.key)) {
                    e.preventDefault();
                  }
                }}
                disabled={cargandoGPS}
              />
            </div>
            {/* 4b. SEXO (Dropdown) (50% de ancho "w-1/2") */}
            <div className="relative w-1/2">
              <select
                className={`w-full px-4 py-4 text-xl font-bold rounded-xl bg-gray-100 border border-transparent transition-all outline-none focus:bg-white focus:border-red-700 appearance-none cursor-pointer ${
                  sexo === "" ? "text-gray-400" : "text-gray-700"
                }`}
                value={sexo}
                onChange={(e) => setSexo(e.target.value)}
                disabled={cargandoGPS}
              >
                {/* Opción fantasma de placeholder */}
                <option value="" disabled hidden>
                  Sexo
                </option>
                <option value="H" className="text-gray-700">
                  Masculino
                </option>
                <option value="M" className="text-gray-700">
                  Femenino
                </option>
              </select>

              {/* Ícono de flechita nativa para que se vea premium */}
              <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                <ChevronDown className="h-6 w-6 text-gray-400" />
              </div>
            </div>
          </div>

          {errorGPS && (
            <div className="bg-red-100 text-red-500 rounded-xl text-center font-bold">
              {errorGPS}
            </div>
          )}

          <button
            className={`relative flex items-center justify-center gap-1 ${
              cargandoGPS
                ? "opacity-90 cursor-not-allowed"
                : "hover:scale-[1.02] hover:shadow-lg active:scale-95 hover:bg-red-700"
            } bg-red-600 text-white text-xl rounded-2xl p-6 min-h-[80px] w-full mt-4 font-bold transition-all shadow-md`}
            onClick={handleComenzar}
            disabled={cargandoGPS}
          >
            {cargandoGPS ? (
              <>
                {/* Ícono anclado a la izquierda */}
                <div className="absolute left-6 flex items-center">
                  <MapPin className="w-7 h-7 animate-bounce" />
                </div>

                {/* Agregamos px-10 (padding horizontal) para que el texto no toque los bordes donde está el icono */}
                <div className="text-xl flex tracking-wide px-10 text-center justify-center w-full">
                  <span>Obteniendo ubicación</span>
                  <div className="flex">
                    <span
                      className="animate-pulse"
                      style={{ animationDelay: "0ms" }}
                    >
                      .
                    </span>
                    <span
                      className="animate-pulse"
                      style={{ animationDelay: "300ms" }}
                    >
                      .
                    </span>
                    <span
                      className="animate-pulse"
                      style={{ animationDelay: "600ms" }}
                    >
                      .
                    </span>
                  </div>
                </div>
              </>
            ) : errorGPS ? (
              <>
                <X className="w-7 h-7" />
                Intentar de nuevo
              </>
            ) : (
              <span className="flex items-center gap-1">
                Comenzar Cuestionario
                <ArrowRight className="w-7 h-7 stroke-[3px]" />
              </span>
            )}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col px-3 py-6  gap-8 pb-32 bg-gray-50 min-h-screen">
      <h1
        className="text-5xl font-black text-transparent pl-3 bg-linear-to-r from-red-800 to-red-600 
          bg-clip-text pt-5 pb-2"
      >
        Cuestionario
      </h1>

      {/* PREGUNTA 1 */}
      <div className="bg-white p-6 rounded-3xl border border-gray-100 flex flex-col gap-6">
        {/* Texto limpio y oscuro */}
        <p className="text-xl font-bold text-gray-700 leading-snug">
          1. ¿En los últimos años ha recibido algún programa de alfabetización?
        </p>

        {/* Reemplazamos los Radios Redondos por Cajas Anchas Mate */}
        <div className="flex gap-4">
          {/* BOTÓN SÍ */}
          <label
            className={`flex-1 rounded-2xl p-4 text-center text-xl font-bold cursor-pointer transition-all border-2 ${
              p1 === "si"
                ? "bg-red-50 border-red-500 text-red-600" // Brillará si lo seleccionan
                : "bg-gray-100 border-transparent text-gray-400 hover:bg-gray-200" // Apagado mate
            }`}
          >
            <input
              type="radio"
              name="p1"
              value="si"
              className="hidden" // <--- radio button cambio
              onChange={(e) => setP1(e.target.value)}
            />
            Sí
          </label>
          {/* BOTÓN NO */}
          <label
            className={`flex-1 rounded-2xl p-4 text-center text-xl font-bold cursor-pointer transition-all border-2 ${
              p1 === "no"
                ? "bg-red-50 border-red-500 text-red-600"
                : "bg-gray-100 border-transparent text-gray-400 hover:bg-gray-200"
            }`}
          >
            <input
              type="radio"
              name="p1"
              value="no"
              className="hidden" // Ocultamos la bolita de Radio
              onChange={(e) => setP1(e.target.value)}
            />
            No
          </label>
        </div>
      </div>
      {/* PREGUNTA 2 */}
      <div className="bg-white p-6 rounded-3xl border border-gray-100 flex flex-col gap-6">
        <p className="text-xl font-bold text-gray-700 leading-snug">
          2. ¿Ha recibido apoyo económico de algún programa de alfabetización?
        </p>
        {/* BOTONES SÍ / NO */}
        <div className="flex gap-4">
          <label
            className={`flex-1 rounded-2xl p-4 text-center text-xl font-bold cursor-pointer transition-all border-2 ${
              p2 === "si"
                ? "bg-red-50 border-red-500 text-red-600"
                : "bg-gray-100 border-transparent text-gray-400 hover:bg-gray-200"
            }`}
          >
            <input
              type="radio"
              name="p2"
              value="si"
              className="hidden"
              onChange={(e) => setP2(e.target.value)}
            />
            Sí
          </label>
          <label
            className={`flex-1 rounded-2xl p-4 text-center text-xl font-bold cursor-pointer transition-all border-2 ${
              p2 === "no"
                ? "bg-red-50 border-red-500 text-red-600"
                : "bg-gray-100 border-transparent text-gray-400 hover:bg-gray-200"
            }`}
          >
            <input
              type="radio"
              name="p2"
              value="no"
              className="hidden"
              onChange={(e) => setP2(e.target.value)}
            />
            No
          </label>
        </div>
        {/* SUB-PREGUNTA DINÁMICA (Solo sale si opres SÍ) */}
        {p2 === "si" && (
          <div className="flex flex-col gap-4 p-5 bg-gray-50 rounded-2xl border border-gray-200">
            <p className="text-lg font-bold text-gray-600 text-center">
              ¿De qué programa?
            </p>

            {/* Opciones en lista vertical tipo examen para leerlas bien */}
            <div className="flex flex-col gap-3">
              {["INEA", "Chiapas Puede", "Otro"].map((op) => (
                <label
                  key={op}
                  className={`rounded-xl p-4 text-center text-lg font-bold cursor-pointer transition-all border-2 ${
                    p2cual === op
                      ? "bg-red-50 border-red-500 text-red-600"
                      : "bg-white border-gray-200 text-gray-500 hover:bg-gray-100"
                  }`}
                >
                  <input
                    type="radio"
                    name="p2cual"
                    value={op}
                    className="hidden"
                    onChange={(e) => setP2cual(e.target.value)}
                  />
                  {op}
                </label>
              ))}
            </div>
          </div>
        )}
      </div>

      {/*------------ PREGUNTA 3 ------------*/}
      <div className="bg-white p-6 rounded-3xl border border-gray-100 flex flex-col gap-6">
        <p className="text-xl font-bold text-gray-700 leading-snug">
          3. ¿Sabe leer?
        </p>
        {/* BOTONES SÍ / NO */}
        <div className="flex gap-4">
          <label
            className={`flex-1 rounded-2xl p-4 text-center text-xl font-bold cursor-pointer transition-all border-2 ${
              p3 === "si"
                ? "bg-red-50 border-red-500 text-red-600"
                : "bg-gray-100 border-transparent text-gray-400 hover:bg-gray-200"
            }`}
          >
            <input
              type="radio"
              name="p3"
              value="si"
              className="hidden"
              onChange={(e) => setP3(e.target.value)}
            />
            Sí
          </label>
          <label
            className={`flex-1 rounded-2xl p-4 text-center text-xl font-bold cursor-pointer transition-all border-2 ${
              p3 === "no"
                ? "bg-red-50 border-red-500 text-red-600"
                : "bg-gray-100 border-transparent text-gray-400 hover:bg-gray-200"
            }`}
          >
            <input
              type="radio"
              name="p3"
              value="no"
              className="hidden"
              onChange={(e) => setP3(e.target.value)}
            />
            No
          </label>
        </div>
        {/* SUB-PREGUNTA DINÁMICA (Solo sale si es SÍ) */}
        {p3 === "si" && (
          <div className="flex flex-col gap-4 p-5 bg-gray-50 rounded-2xl border border-gray-200">
            <p className="text-lg font-bold text-gray-600 text-center">
              ¿En qué lengua?
            </p>
            <div className="flex flex-col gap-3">
              {["Español", "Tseltal", "Tsotsil", "Otro"].map((op) => (
                <label
                  key={op}
                  className={`rounded-xl p-4 text-center text-lg font-bold cursor-pointer transition-all border-2 ${
                    p3lengua === op
                      ? "bg-red-50 border-red-500 text-red-600"
                      : "bg-white border-gray-200 text-gray-500 hover:bg-gray-100"
                  }`}
                >
                  <input
                    type="radio"
                    name="p3lengua"
                    value={op}
                    className="hidden"
                    onChange={(e) => setP3lengua(e.target.value)}
                  />
                  {op}
                </label>
              ))}
            </div>
          </div>
        )}
      </div>

      {/*------------ PREGUNTA 4 ------------*/}
      <div className="bg-white p-6 rounded-3xl border border-gray-100 flex flex-col gap-6">
        <p className="text-xl font-bold text-gray-700 leading-snug">
          4. ¿Sabe escribir?
        </p>
        {/* BOTONES SÍ / NO */}
        <div className="flex gap-4">
          <label
            className={`flex-1 rounded-2xl p-4 text-center text-xl font-bold cursor-pointer transition-all border-2 ${
              p4 === "si"
                ? "bg-red-50 border-red-500 text-red-600"
                : "bg-gray-100 border-transparent text-gray-400 hover:bg-gray-200"
            }`}
          >
            <input
              type="radio"
              name="p4"
              value="si"
              className="hidden"
              onChange={(e) => setP4(e.target.value)}
            />
            Sí
          </label>
          <label
            className={`flex-1 rounded-2xl p-4 text-center text-xl font-bold cursor-pointer transition-all border-2 ${
              p4 === "no"
                ? "bg-red-50 border-red-500 text-red-600"
                : "bg-gray-100 border-transparent text-gray-400 hover:bg-gray-200"
            }`}
          >
            <input
              type="radio"
              name="p4"
              value="no"
              className="hidden"
              onChange={(e) => setP4(e.target.value)}
            />
            No
          </label>
        </div>
        {/* CAJA DE TEXTO DINÁMICA (Solo sale si es SÍ) */}
        {p4 === "si" && (
          <div className="flex flex-col gap-3 mt-1">
            <p className="text-sm font-bold text-gray-400 uppercase tracking-wider ml-1">
              Prueba de escritura
            </p>
            <input
              className="w-full p-4 text-xl font-bold rounded-2xl bg-gray-100 
              border border-transparent text-gray-700 placeholder-gray-400 
              focus:bg-white focus:border-red-400 transition-all outline-none"
              placeholder="Escriba su nombre y edad..."
              value={p4escrito}
              onChange={(e) => setP4escrito(e.target.value)}
            />
          </div>
        )}
      </div>

      {/* ---------- PREGUNTA 5 ---------- */}
      <div className="bg-white p-6 rounded-3xl border border-gray-100 flex flex-col gap-6">
        <p className="text-xl font-bold text-gray-700 leading-snug">
          5. Escriba las vocales
        </p>
        <div className="flex flex-col gap-3">
          <p className="text-sm font-bold text-gray-400 uppercase tracking-wider ml-1">
            Prueba de vocales
          </p>
          <input
            className="w-full p-4 text-xl font-bold rounded-2xl bg-gray-100 border border-transparent text-gray-700 placeholder-gray-400 focus:bg-white focus:border-red-400 transition-all outline-none"
            placeholder="A, E, I, O, U..."
            value={p5}
            onChange={(e) => setP5(e.target.value)}
          />
        </div>
      </div>

      {/* ----PREGUNTA 6 */}
      <div className="bg-white p-6 rounded-3xl border border-gray-100 flex flex-col gap-6">
        <p className="text-xl font-bold text-gray-700 leading-snug">
          6. ¿Conoce a alguien que no sepa leer y escribir?
        </p>
        {/* BOTONES SÍ / NO */}
        <div className="flex gap-4">
          <label
            className={`flex-1 rounded-2xl p-4 text-center text-xl font-bold cursor-pointer transition-all border-2 ${
              p6 === "si"
                ? "bg-red-50 border-red-500 text-red-600"
                : "bg-gray-100 border-transparent text-gray-400 hover:bg-gray-200"
            }`}
          >
            <input
              type="radio"
              name="p6"
              value="si"
              className="hidden"
              onChange={(e) => setP6(e.target.value)}
            />
            Sí
          </label>
          <label
            className={`flex-1 rounded-2xl p-4 text-center text-xl font-bold cursor-pointer transition-all border-2 ${
              p6 === "no"
                ? "bg-red-50 border-red-500 text-red-600"
                : "bg-gray-100 border-transparent text-gray-400 hover:bg-gray-200"
            }`}
          >
            <input
              type="radio"
              name="p6"
              value="no"
              className="hidden"
              onChange={(e) => setP6(e.target.value)}
            />
            No
          </label>
        </div>
        {/* CAJA DE TEXTO DINÁMICA (Solo sale si es SÍ) */}
        {p6 === "si" && (
          <div className="flex flex-col gap-3 mt-1">
            <p className="text-sm font-bold text-gray-400 uppercase tracking-wider ml-1">
              ¿Cuántas personas aproximadamente?
            </p>
            <input
              type="number"
              className="w-full p-4 text-xl font-bold rounded-2xl bg-gray-100 border border-transparent text-gray-700 placeholder-gray-400 focus:bg-white focus:border-red-400 transition-all outline-none"
              placeholder="Número de personas"
              value={p6cuantos}
              onChange={(e) => setP6cuantos(e.target.value)}
            />
          </div>
        )}
      </div>

      {/* BOTÓN FINALIZAR */}
      <button
        className={`${guardando ? "font-bold opacity-50 cursor-not-allowed" : ""} bg-red-600 text-white text-2xl rounded-xl p-6 min-h-[80px] w-full`}
        onClick={guardarEncuestaLocal}
        disabled={guardando}
      >
        {guardando ? "Guardando..." : "Guardar Encuesta ✓"}
      </button>

      <button
        className="bg-slate-700 text-white text-2xl font-bold rounded-xl p-6 min-h-[80px] w-full mb-4"
        onClick={cancelarEncuesta}
      >
        Cancelar Encuesta X
      </button>
    </div>
  );
}
