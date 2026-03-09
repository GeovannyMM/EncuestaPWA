"use client";
import { useState } from "react";

type Props = {
  onTerminar: () => void;
};

export default function Survey({ onTerminar }: Props) {
  const [lat, setLat] = useState<number | null>(null); // latitud del GPS
  const [lng, setLng] = useState<number | null>(null); // longitud del GPS
  const [lugar, setLugar] = useState(""); // nombre del lugar en texto
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

  // pide la ubicación al navegador y la convierte a nombre de lugar
  const capturarGPS = async () => {
    navigator.geolocation.getCurrentPosition(async (pos) => {
      const latitud = pos.coords.latitude;
      const longitud = pos.coords.longitude;
      setLat(latitud);
      setLng(longitud);

      // convierte coordenadas a nombre de lugar con Nominatim
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
    });
  };

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
        <input
          className="border p-4 text-2xl rounded mt-2"
          placeholder="Escriba su nombre completo y su edad"
          value={p4nombre}
          onChange={(e) => setP4nombre(e.target.value)}
        />
      </div>

      {/* PREGUNTA 5 */}
      <div className="flex flex-col gap-3">
        <p className="text-2xl">5. Escriba las vocales</p>
        <input
          className="border p-4 text-2xl rounded"
          placeholder="a, e, i, o, u"
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
        onClick={onTerminar}
      >
        Finalizar Encuesta ✓
      </button>
    </div>
  );
}
