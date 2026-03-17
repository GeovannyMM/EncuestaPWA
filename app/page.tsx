"use client";
import { useState, useEffect } from "react";
import Script from "next/script";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import Survey from "./components/Survey";
import Success from "./components/Success";

type Step = "login" | "dashboard" | "survey" | "success";

export default function Home() {
  const [step, setStep] = useState<Step>("login");
  const [entrevistadorId, setEntrevistadorId] = useState<number>(0);
  const [entrevistadorNombre, setEntrevistadorNombre] = useState("");
  const [cargandoSesion, setCargandoSesion] = useState(true);

  // Al abrir la app, buscamos si ya había alguien logueado en la memoria
  // Al abrir la app, buscamos si ya había alguien logueado en la memoria
  useEffect(() => {
    try {
      const sesionGuardada = localStorage.getItem("encuesta_sesion");
      if (sesionGuardada) {
        const datos = JSON.parse(sesionGuardada);
        // Validamos que 'datos' realmente sea un objeto con la propiedad id
        if (datos && datos.id) {
          setEntrevistadorId(datos.id);
          setEntrevistadorNombre(datos.nombre);
          setStep("dashboard");
        } else {
          localStorage.removeItem("encuesta_sesion"); // Limpiar basura
        }
      }
    } catch (error) {
      console.warn("Dato inválido en sesión, limpiando...", error);
      localStorage.removeItem("encuesta_sesion"); // Limpiamos la basura si JSON falla
    } finally {
      setCargandoSesion(false); // Siempre se debe quitar la pantalla de carga
    }
  }, []);

  if (cargandoSesion) return null;

  return (
    <main className="min-h-screen w-full flex flex-col bg-white text-black">
      {/* ... todo lo que sigue después se queda igual ... */}

      <div>
        {/* --- ERUDA PARA DESARROLLO CELULAR --- */}
        <Script
          src="//cdn.jsdelivr.net/npm/eruda"
          strategy="lazyOnload"
          onLoad={() => {
            if (typeof window !== "undefined" && (window as any).eruda) {
              (window as any).eruda.init();
            }
          }}
        />
        {/* ------------------------------------- */}
        {step === "login" && (
          <Login
            onLogin={(id, nombre) => {
              setEntrevistadorId(id);
              setEntrevistadorNombre(nombre);
              localStorage.setItem(
                "encuesta_sesion",
                JSON.stringify({ id, nombre }),
              );
              setStep("dashboard");
            }}
          />
        )}
        {step === "dashboard" && (
          <Dashboard
            onNuevaEncuesta={() => setStep("survey")}
            onCerrarSesion={() => {
              localStorage.removeItem("encuesta_sesion");
              setEntrevistadorId(0);
              setEntrevistadorNombre("");
              setStep("login");
            }}
            nombreEntrevistador={entrevistadorNombre}
            entrevistadorId={entrevistadorId}
          />
        )}
        {step === "survey" && (
          <Survey
            onTerminar={() => setStep("success")}
            onCancelar={() => setStep("dashboard")}
            entrevistadorId={entrevistadorId}
            entrevistadorNombre={entrevistadorNombre}
          />
        )}
        {step === "success" && (
          <Success onVolver={() => setStep("dashboard")} />
        )}
      </div>
    </main>
  );
}
