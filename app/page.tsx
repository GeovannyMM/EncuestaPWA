"use client";
import { useState, useEffect } from "react";
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
  useEffect(() => {
    const sesionGuardada = localStorage.getItem("encuesta_sesion");
    if (sesionGuardada) {
      const datos = JSON.parse(sesionGuardada);
      setEntrevistadorId(datos.id);
      setEntrevistadorNombre(datos.nombre);
      setStep("dashboard");
    }
    setCargandoSesion(false); // Ya revisamos, quitamos la pantalla blanca
  }, []);

  // Si apenas está buscando en la memoria, no dibujamos nada
  if (cargandoSesion) return null;

  return (
    <div>
      {step === "login" && (
        <Login
          onLogin={(id, nombre) => {
            setEntrevistadorId(id);
            setEntrevistadorNombre(nombre);
            // Guardamos en la memoria del celular para siempre
            localStorage.setItem(
              "encuesta_sesion",
              JSON.stringify({ id, nombre })
            );
            setStep("dashboard");
          }}
        />
      )}
      {step === "dashboard" && (
        <Dashboard
          onNuevaEncuesta={() => setStep("survey")}
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
      {step === "success" && <Success onVolver={() => setStep("dashboard")} />}
    </div>
  );
}
