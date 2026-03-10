"use client";
import { useState } from "react";

type Props = {
  onLogin: (id: number, nombre: string) => void;
};


// temporal login
const usuariosTemporales = [
  { id: 1, nombre_completo: "Juan Pérez", usuario_slug: "juanP" },
  { id: 2, nombre_completo: "María López", usuario_slug: "mariaL" },
  { id: 3, nombre_completo: "Carlos Ruiz", usuario_slug: "carlosR" },
];


export default function Login({ onLogin }: Props) {
  const [usuario, setUsuario] = useState("");
  const [error, setError] = useState("");

  const handleLogin = () => {
    const usuarioEncontrado = usuariosTemporales.find(
      (u) => u.usuario_slug === usuario.trim()
    );

    if (usuarioEncontrado) {
      onLogin(usuarioEncontrado.id, usuarioEncontrado.nombre_completo);
    } else {
      setError("Usuario no tiene acceso");
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
