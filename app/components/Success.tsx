"use client";

type Props = {
  onVolver: () => void; // al presionar vuelve al dashboard
};

export default function Success({ onVolver }: Props) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-8 gap-6">
      {/* ========================================================= */}
      {/* MAGIA NEGRA CSS PARA LA PALOMITA APPLE PAY */}
      {/* ========================================================= */}
      <style>{`
        /* 1. Dibuja el círculo exterior */
        .success-circle {
          stroke-dasharray: 166;
          stroke-dashoffset: 166;
          animation: trazo 0.6s cubic-bezier(0.65, 0, 0.45, 1) forwards;
        }
        /* 2. Dibuja la palomita de adentro después de un respiro */
        .success-check {
          stroke-dasharray: 48;
          stroke-dashoffset: 48;
          animation: trazo 0.3s cubic-bezier(0.65, 0, 0.45, 1) 0.6s forwards;
        }
        /* 3. Escala y rebota (Pop) después de dibujarse */
        .success-wrapper {
          animation: escalar 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards,
                     botar 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275) 0.9s forwards;
        }
        /* 4. Suelta el "¡Poof!" (Onda verde) hacia atrás */
        .success-poof {
          animation: explotar 0.8s ease-out 0.8s forwards;
        }
        @keyframes trazo {
          100% { stroke-dashoffset: 0; }
        }
        @keyframes escalar {
          0% { transform: scale(0); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes botar {
          0% { transform: scale(1); }
          50% { transform: scale(1.15); }
          100% { transform: scale(1); }
        }
        @keyframes explotar {
          0% { transform: scale(0.8); opacity: 1; }
          100% { transform: scale(2.8); opacity: 0; border-width: 0px; }
        }
      `}</style>

      {/* ========================================================= */}
      {/* EL ÍCONO ANIMADO GIGANTE REACONDICIONADO */}
      {/* ========================================================= */}
      <div className="relative flex items-center justify-center w-40 h-40 mb-4">
        {/* El halo verde fantasma que explota simulando el 'Poof' */}
        <div className="absolute inset-0 rounded-full border-[6px] border-green-400 success-poof opacity-0 bg-green-100/50"></div>

        {/* El círculo y la palomita dibujándose a mano sobre una tarjeta redonda blanca */}
        <div className="relative z-10 bg-white rounded-full p-4 shadow-2xl success-wrapper opacity-0">
          <svg className="w-28 h-28" viewBox="0 0 52 52">
            <circle
              className="success-circle"
              cx="26"
              cy="26"
              r="25"
              fill="none"
              stroke="#22c55e"
              strokeWidth="4"
            />
            <path
              className="success-check"
              fill="none"
              stroke="#22c55e"
              strokeWidth="5"
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M14.1 27.2l7.1 7.2 16.7-16.8"
            />
          </svg>
        </div>
      </div>

      {/* ========================================================= */}
      {/* TEXTOS Y BOTÓN (Con una sutil animación de entrada) */}
      {/* ========================================================= */}
      <h1
        className="text-4xl font-black text-gray-800 text-center tracking-tight animate-pulse"
        style={{
          animationIterationCount: 1,
          animationDuration: "1s",
          animationDelay: "1s",
        }}
      >
        ¡Encuesta Guardada!
      </h1>

      <p className="text-xl text-center font-bold text-gray-500 mb-4">
        Alojada segura en el dispositivo
      </p>

      <button
        className="bg-red-600 hover:bg-black text-white text-2xl font-bold rounded-2xl py-6 min-h-[80px] w-full max-w-sm shadow-xl shadow-red-900/20 transition-all hover:scale-105 active:scale-95"
        onClick={onVolver}
      >
        Volver al inicio
      </button>
    </div>
  );
}
