"use client";
import { useState } from "react";

type Props = {
  onLogin: () => void;
};

export default function Login({ onLogin }: Props) {
  const [usuario, setUsuario] = useState("");
  const [error, setError] = useState("");

  const handleLogin = () => {
    if (usuario.trim() !== "") {
      onLogin();
    } else {
      setError("Ingresa tu usuario para continuar");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8">
      <h1 className="text-4xl font-bold mb-8">Encuesta Alfabetismo</h1>
      <div className="flex flex-col gap-4 w-full max-w-sm">
        <input
          className="border p-4 text-2xl rounded"
          placeholder="Tu Usuario"
          value={usuario}
          onChange={(e) => setUsuario(e.target.value)}
        />
        {error && <p className="text-red-500 tx-xl">{error}</p>}

        <button
          className="bg-red-500 text-white p-6 text-2xl font-bold rounded min-h-[80px]"
          onClick={handleLogin}
        >
          Entrar
        </button>
      </div>
    </div>
  );
}
