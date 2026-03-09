"use client";
import { useState } from "react";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import Survey from "./components/Survey";
import Success from "./components/Success";

type Step = "login" | "dashboard" | "survey" | "success";

export default function Home() {
  const [step, setStep] = useState<Step>("login");

  return (
    <div>
      {step === "login" &&
        <Login onLogin={() => setStep("dashboard")} />
      }
      {step === "dashboard" &&
        <Dashboard onNuevaEncuesta={() => setStep("survey")} />
      }
      {step === "survey" &&
        <Survey onTerminar={() => setStep("success")}
          onCancelar={() => setStep("dashboard")} />
      }
      {step === "success" &&
        <Success onVolver={() => setStep("dashboard")} />
      }
    </div>
  );
}
