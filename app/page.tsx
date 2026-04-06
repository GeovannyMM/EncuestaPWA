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

  useEffect(() => {
    try {
      const sesionGuardada = localStorage.getItem("encuesta_sesion");
      if (sesionGuardada) {
        const datos = JSON.parse(sesionGuardada);
        if (datos && datos.id) {
          setEntrevistadorId(datos.id);
          setEntrevistadorNombre(datos.nombre);
          setStep("dashboard");
        } else {
          localStorage.removeItem("encuesta_sesion");
        }
      }
    } catch (error) {
      console.warn("Dato inválido en sesión, limpiando...", error);
      localStorage.removeItem("encuesta_sesion");
    } finally {
      setCargandoSesion(false);
    }
  }, []);

  if (cargandoSesion) return null;

  return (
    <main className="h-full w-full max-w-md mx-auto flex flex-col bg-white text-black overflow-hidden relative sm:border-x sm:border-gray-200 sm:shadow-[0_0_60px_-15px_rgba(0,0,0,0.3)]">
      <div className="flex-1 overflow-y-auto h-full w-full">
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
