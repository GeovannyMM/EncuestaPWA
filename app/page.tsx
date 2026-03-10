"use client";
import { useState } from "react";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import Survey from "./components/Survey";
import Success from "./components/Success";

type Step = "login" | "dashboard" | "survey" | "success";

export default function Home() {
  const [step, setStep] = useState<Step>("login");
  const [entrevistadorId, setEntrevistadorId] = useState<number>(0);
  const [entrevistadorNombre, setEntrevistadorNombre] = useState("");

  return (
    <div>
      {step === "login" && (
        <Login
          onLogin={(id, nombre) => {
            setEntrevistadorId(id);
            setEntrevistadorNombre(nombre);
            setStep("dashboard");
          }}
        />
      )}
      {step === "dashboard" && (
        <Dashboard
          onNuevaEncuesta={() => setStep("survey")}
          nombreEntrevistador={entrevistadorNombre}
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
