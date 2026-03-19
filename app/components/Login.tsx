"use client";
import { useState, useEffect } from "react";
import { db } from "../../lib/client/db";
import Image from "next/image";
import { User, ArrowRight } from "lucide-react";

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
            // 3. Dexie solo catua si hay datos nuevos
            await db.usuarios.bulkPut(data);

            // 4. Guarda la fecha y hora actual para la próxima vez
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
      // 1. Buscador Dexie (Offline)
      const usuarioEncontrado = await db.usuarios
        .where("usuario_slug")
        .equals(usuario.trim())
        .first();

      if (usuarioEncontrado) {
        onLogin(usuarioEncontrado.id, usuarioEncontrado.usuario_slug);
      } else {
        setError("Nombre de usuario inexistente.");
      }
    } catch (error) {
      console.error("Error al buscar en Dexie:", error);
      setError("Error interno al intentar iniciar sesión.");
    }
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-white py-12 px-6">
      <div className="flex justify-center w-full pt-20">
        <Image
          src="/logoASE.png"
          alt="Logo ASE Chiapas"
          width={320}
          height={140}
          className="object-contain"
          priority
        />
      </div>

      <div className="grow" />

      <div className="flex flex-col gap-6 w-full max-w-sm mb-20">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-extrabold tracking-[0.2em] bg-linear-to-r from-[#E31837] to-[#800d20] bg-clip-text text-transparent drop-shadow-sm">
            CHIAPAS PUEDE
          </h1>
          <p className="text-gray-400 font-semibold text-sm mt-3 tracking-wider">
            CUESTIONARIO DE CONFIRMACIÓN
          </p>
        </div>

        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-one">
            <User className="h-6 w-6 text-gray-400" />
          </div>
          <input
            className="w-full bg-gray-50 border border-gray-200 text-gray-800 text-lg p-5 pl-14 rounded-xl 
                       focus:border-gray-600 focus:bg-white outline-none transition-all shadow-sm"
            placeholder="Nombre de usuario"
            value={usuario}
            onChange={(e) => setUsuario(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleLogin()} // tecla enter
          />
        </div>

        {error && (
          <p className="text-red-500 text-center font-medium">{error}</p>
        )}

        <button
          className="group flex items-center justify-center gap-2 bg-red-600 hover:bg-red-900 active:scale-95 
                     text-white p-5 text-xl font-bold rounded-xl transition-all shadow-lg w-full"
          onClick={handleLogin}
        >
          Entrar
          <ArrowRight className="h-6 w-6 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

      <div className="grow" />
    </div>
  );
}
