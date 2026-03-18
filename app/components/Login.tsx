"use client";
import { useState, useEffect } from "react";
import { db } from "../../lib/client/db";
import Image from "next/image";

type Props = {
  onLogin: (id: number, nombre: string) => void;
};

export default function Login({ onLogin }: Props) {
  const [usuario, setUsuario] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const descargarUsuariosMySQL = async () => {
      try {
        // 1. Buscamos si ya tenemos una fecha de sincronización previa
        const lastSync = localStorage.getItem("ultima_sinc_usuarios") || "";

        // 2. Armamos la URL. Si hay fecha, la agregamos; si no, pedimos todo.
        const url = lastSync
          ? `/api/usuarios?lastSync=${lastSync}`
          : "/api/usuarios";

        const res = await fetch(url);

        if (!res.ok) throw new Error(`Error del servidor: ${res.status}`);

        const { ok, data } = await res.json();

        if (ok && Array.isArray(data)) {
          if (data.length > 0) {
            // 3. Solo interactuamos con Dexie si realmente llegaron datos nuevos
            await db.usuarios.bulkPut(data);

            // 4. Guardamos la fecha y hora actual para la próxima vez
            localStorage.setItem(
              "ultima_sinc_usuarios",
              new Date().toISOString(),
            );
            console.log(
              `Éxito: Se sincronizaron ${data.length} usuarios nuevos/modificados.`,
            );
          } else {
            console.log("Éxito: Los usuarios ya estaban 100% actualizados.");
          }
        }
      } catch (error) {
        if (error instanceof TypeError && error.message === "Failed to fetch") {
          console.log("Modo offline: Usando datos locales.");
        } else {
          console.error("Error en sincronización:", error);
        }
      }
    };

    descargarUsuariosMySQL();
  }, []);
  const handleLogin = async () => {
    if (!usuario.trim()) {
      setError("ingresa un nombre de usuario.");
      return;
    }

    try {
      // 1. Buscamos en Dexie (Offline)
      const usuarioEncontrado = await db.usuarios
        .where("usuario_slug")
        .equals(usuario.trim())
        .first();

      if (usuarioEncontrado) {
        onLogin(usuarioEncontrado.id, usuarioEncontrado.usuario_slug);
      } else {
        setError("Usuario no encontrado en la memoria del celular.");
      }
    } catch (error) {
      console.error("Error al buscar en Dexie:", error);
      setError("Error interno al intentar iniciar sesión.");
    }
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-white pt-16 px-6 p-8">
      <div className="mb-60 mt-10 flex justify-center w-full">
        <Image
          src="/logoASE.png"
          alt="Logo ASE Chiapas"
          width={320}
          height={140}
          className="object-contain"
          priority
        />
      </div>

      <div className="flex flex-col gap-5 w-full max-w-sm">
        <input
          className="w-full pb-10 bg-gray-50 border-gray-800 text-gray-800 text-lg p-4 rounded-xl focus:border-red-500
          focus:bg-white outline-none transition-all"
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
