"use client";

type Encuesta = {
  folio: string;
  encuestado: string;
  fecha: string;
  lugar: string;
  sincronizada: boolean;
};

type Props = {
  onNuevaEncuesta: () => void;
};

export default function Dashboard({ onNuevaEncuesta }: Props) {
  {
    /*datos temporales en lo que conecto a Dexie*/
  }
  const encuestas: Encuesta[] = [
    {
      folio: "1-lx3k2a-ab12",
      encuestado: "Juan Pérez",
      fecha: "08/03/2026",
      lugar: "San Cristóbal",
      sincronizada: true,
    },
    {
      folio: "1-lx3k2b-cd34",
      encuestado: "María López",
      fecha: "08/03/2026",
      lugar: "Tuxtla Gutiérrez",
      sincronizada: false,
    },
    {
      folio: "1-lx3k2c-ef56",
      encuestado: "Carlos Ruiz",
      fecha: "08/03/2026",
      lugar: "Comitán",
      sincronizada: false,
    },
  ];

  return (
    <div className="flex flex-col min-h-screen p-6 gap-6">
      <p className="text-2xl">
        Bienvenido, <strong>Entrevistador</strong>
      </p>
      {/*titulo de la seccion*/}
      <h1 className="text-3xl fond-bold">Encuestas Realizadas</h1>
      {/*scroll horizontal*/}
      <div className="flex gap-4 overflow-x-auto pb-2">
        {encuestas.map((enc) => (
          <div
            key={enc.folio}
            className="min-w-[220px] bordder rounded-xl px-4 flex flex-col gap-4 shadow"
          >
            <p className="text-lg font-bold">{enc.folio}</p>
            <p className="text-base text-gray-500">{enc.encuestado}</p>
            <p className="text-sm text-gray-400">{enc.fecha}</p>
            <p className="text-sm text-gray-400">{enc.lugar}</p>
            {/* status: verde si sincronizada, naranja si pendiente */}
            <span
              className={`text-sm font-bold mt-2 ${enc.sincronizada ? "text-green-500" : "text-orange-500"}`}
            >
              {enc.sincronizada ? "✅ Sincronizada" : "🟠 Pendiente"}
            </span>
          </div>
        ))}
      </div>
      {/* botón principal, mt-auto lo empuja hasta abajo */}
      <button
        className="bg-black text-white text-2xl rounded-xl p-6 min-h-[80px] w-full mt-auto"
        onClick={onNuevaEncuesta}
      >
        Nueva Encuesta +
      </button>
    </div>
  );
}
