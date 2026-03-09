"use client";

type Props = {
  onVolver: () => void; // al presionar vuelve al dashboard
};

export default function Success({ onVolver }: Props) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 gap-8">
      <p className="text-8xl">✅</p>

      <h1 className="text-4xl font-bold text-center">¡Encuesta Guardada!</h1>

      <p className="text-2xl text-center text-gray-500">
        Los datos quedaron guardados en el dispositivo.
      </p>

      <button
        className="bg-red-600  text-white text-2xl rounded-xl p-6 min-h-[80px] w-full max-w-sm"
        onClick={onVolver} // regresa al dashboard
      >
        Volver al inicio
      </button>
    </div>
  );
}
