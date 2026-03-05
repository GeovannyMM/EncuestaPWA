"use client";

import { useState } from "react";

export default function Home() {
  const [step, setStep] = useState<"welcome" | "survey" | "thanks">("welcome");

  return (
    <main className="min-h-screen bg-base-200 selection:bg-primary/30">
      {/* 1. PANTALLA DE BIENVENIDA */}
      {step === "welcome" && (
        <div className="flex items-center justify-center min-h-screen p-4">
          <div className="card w-full max-w-lg bg-base-100 shadow-2xl text-center">
            <div className="card-body items-center py-10">

              <div className="w-20 h-20 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-6 shadow-inner">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
              </div>

              <h1 className="text-3xl font-bold text-base-content tracking-tight">
                ¡Bienvenido a nuestra Encuesta!
              </h1>

              <p className="text-base-content/70 mt-4 mb-8 text-lg">
                Queremos conocerte mejor. Nos tomará solo un par de minutos y tus respuestas nos ayudarán a recabar información valiosa para ayudarte
              </p>

              <div className="w-full">
                <button
                  onClick={() => {
                    window.scrollTo(0, 0);
                    setStep("survey");
                  }}
                  className="btn btn-primary btn-block h-14 text-lg rounded-full shadow-lg shadow-primary/30"
                >
                  Comenzar Encuesta
                </button>
              </div>

              <p className="mt-6 text-sm text-base-content/50">
                Toma aproximadamente 2 minutos •  100%
              </p>

            </div>
          </div>
        </div>
      )}

      {/* 2. PANTALLA DEL FORMULARIO */}
      {step === "survey" && (
        <div className="max-w-3xl mx-auto py-12 px-4 pb-24">
          <div className="text-center mb-10">
            <h1 className="text-4xl font-extrabold text-base-content mb-3 tracking-tight">Queremos escucharte</h1>
            <p className="text-base-content/70 text-lg">Selecciona la respuesta que mejor te represente.</p>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              window.scrollTo(0, 0);
              setStep("thanks");
            }}
            className="space-y-6"
          >
            {/* PREGUNTA 1 */}
            <div className="card bg-base-100 shadow-sm border border-base-300">
              <div className="card-body">
                <h2 className="card-title text-xl mb-2">1. Oportunidad escolar en la infancia</h2>
                <p className="text-sm text-base-content/60 mb-4 font-italic">Lee en voz alta: "¿Tuviste oportunidad de ir a la escuela cuando eras niño/a?"</p>
                <div className="flex gap-4">
                  <label className="flex items-center space-x-3 cursor-pointer p-3 rounded-xl hover:bg-base-200 border border-transparent hover:border-base-300 w-full">
                    <input type="radio" name="fue_escuela" value="Sí" className="radio radio-primary" required />
                    <span className="text-base font-medium">Sí</span>
                  </label>
                  <label className="flex items-center space-x-3 cursor-pointer p-3 rounded-xl hover:bg-base-200 border border-transparent hover:border-base-300 w-full">
                    <input type="radio" name="fue_escuela" value="No" className="radio radio-primary" required />
                    <span className="text-base font-medium">No</span>
                  </label>
                </div>
              </div>
            </div>

            {/* PREGUNTA 2 */}
            <div className="card bg-base-100 shadow-sm border border-base-300">
              <div className="card-body">
                <h2 className="card-title text-xl mb-2">2. Razón por la que no fue a la escuela</h2>
                <p className="text-sm text-base-content/60 mb-4 font-italic">Si la respuesta anterior fue NO, lee en voz alta: "Si no fuiste a la escuela, ¿cuál fue la razón principal?"</p>
                <div className="flex flex-col space-y-3">
                  {['Tenías que trabajar', 'No había escuela cerca', 'Tu familia no podía pagar'].map((opcion, idx) => (
                    <label key={idx} className="flex items-center space-x-3 cursor-pointer p-3 rounded-xl hover:bg-base-200 transition-colors w-full border border-transparent hover:border-base-300">
                      <input type="radio" name="razon_no_escuela" value={opcion} className="radio radio-primary radio-sm sm:radio-md" />
                      <span className="text-base font-medium">{opcion}</span>
                    </label>
                  ))}
                  <label className="flex items-center space-x-3 cursor-pointer p-3 rounded-xl hover:bg-base-200 transition-colors w-full border border-transparent hover:border-base-300">
                    <input type="radio" name="razon_no_escuela" value="Otro motivo" className="radio radio-primary radio-sm sm:radio-md" />
                    <div className="flex w-full items-center gap-2">
                      <span className="text-base font-medium whitespace-nowrap">Otro motivo:</span>
                      <input type="text" className="input input-sm input-bordered w-full" placeholder="Especificar..." />
                    </div>
                  </label>
                </div>
              </div>
            </div>

            {/* PREGUNTA 3 */}
            <div className="card bg-base-100 shadow-sm border border-base-300">
              <div className="card-body">
                <h2 className="card-title text-xl mb-2">3. Escuela cercana a su comunidad</h2>
                <p className="text-sm text-base-content/60 mb-4 font-italic">Lee en voz alta: "¿En tu comunidad había una escuela cercana?"</p>
                <div className="flex gap-4">
                  <label className="flex items-center space-x-3 cursor-pointer p-3 rounded-xl hover:bg-base-200 border border-transparent hover:border-base-300 w-full">
                    <input type="radio" name="escuela_cercana" value="Sí" className="radio radio-primary" required />
                    <span className="text-base font-medium">Sí</span>
                  </label>
                  <label className="flex items-center space-x-3 cursor-pointer p-3 rounded-xl hover:bg-base-200 border border-transparent hover:border-base-300 w-full">
                    <input type="radio" name="escuela_cercana" value="No" className="radio radio-primary" required />
                    <span className="text-base font-medium">No</span>
                  </label>
                  <label className="flex items-center space-x-3 cursor-pointer p-3 rounded-xl hover:bg-base-200 border border-transparent hover:border-base-300 w-full">
                    <input type="radio" name="escuela_cercana" value="No recuerda" className="radio radio-primary" required />
                    <span className="text-base font-medium">No recuerda</span>
                  </label>
                </div>
              </div>
            </div>

            {/* PREGUNTA 4 */}
            <div className="card bg-base-100 shadow-sm border border-base-300">
              <div className="card-body">
                <h2 className="card-title text-xl mb-2">4. Alfabetización de los padres</h2>
                <p className="text-sm text-base-content/60 mb-4 font-italic">Lee en voz alta: "¿Tus padres o familiares sabían leer y escribir?"</p>
                <div className="flex flex-col sm:flex-row gap-4">
                  {['Sí, ambos sabían', 'Solo uno de ellos sabía', 'No, ninguno sabía', 'No sabe/No recuerda'].map((opcion, idx) => (
                    <label key={idx} className="flex items-center space-x-3 cursor-pointer p-3 rounded-xl hover:bg-base-200 border border-transparent hover:border-base-300 w-full sm:w-auto">
                      <input type="radio" name="padres_leen" value={opcion} className="radio radio-primary" required />
                      <span className="text-base font-medium whitespace-nowrap">{opcion}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* PREGUNTA 5 */}
            <div className="card bg-base-100 shadow-sm border border-base-300">
              <div className="card-body">
                <h2 className="card-title text-xl mb-2">5. Abandono escolar</h2>
                <p className="text-sm text-base-content/60 mb-4 font-italic">Lee en voz alta: "¿Tuviste que dejar la escuela antes de terminarla?"</p>
                <div className="flex gap-4">
                  <label className="flex items-center space-x-3 cursor-pointer p-3 rounded-xl hover:bg-base-200 border border-transparent hover:border-base-300 w-full">
                    <input type="radio" name="dejo_escuela" value="Sí" className="radio radio-primary" required />
                    <span className="text-base font-medium">Sí</span>
                  </label>
                  <label className="flex items-center space-x-3 cursor-pointer p-3 rounded-xl hover:bg-base-200 border border-transparent hover:border-base-300 w-full">
                    <input type="radio" name="dejo_escuela" value="No" className="radio radio-primary" required />
                    <span className="text-base font-medium">No, la terminé</span>
                  </label>
                  <label className="flex items-center space-x-3 cursor-pointer p-3 rounded-xl hover:bg-base-200 border border-transparent hover:border-base-300 w-full">
                    <input type="radio" name="dejo_escuela" value="N/A" className="radio radio-primary" required />
                    <span className="text-base font-medium">No aplica (nunca fui)</span>
                  </label>
                </div>
              </div>
            </div>

            {/* PREGUNTA 6 */}
            <div className="card bg-base-100 shadow-sm border border-base-300">
              <div className="card-body">
                <h2 className="card-title text-xl mb-2">6. Razón del abandono escolar</h2>
                <p className="text-sm text-base-content/60 mb-4 font-italic">Lee en voz alta: "¿Cuál fue la razón por la que dejaste la escuela?"</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {['Trabajo', 'Cuidado de familiares', 'Falta de recursos', 'No te dejaron continuar'].map((opcion, idx) => (
                    <label key={idx} className="flex items-center space-x-3 cursor-pointer p-3 rounded-xl hover:bg-base-200 transition-colors w-full border border-transparent hover:border-base-300">
                      <input type="radio" name="razon_abandono" value={opcion} className="radio radio-primary radio-sm sm:radio-md" />
                      <span className="text-base font-medium">{opcion}</span>
                    </label>
                  ))}
                  <label className="flex items-center space-x-3 cursor-pointer p-3 rounded-xl hover:bg-base-200 transition-colors w-full border border-transparent hover:border-base-300 sm:col-span-2">
                    <input type="radio" name="razon_abandono" value="Otro" className="radio radio-primary radio-sm sm:radio-md" />
                    <div className="flex w-full items-center gap-2">
                      <span className="text-base font-medium">Otro:</span>
                      <input type="text" className="input input-sm input-bordered w-full max-w-xs" placeholder="Especificar..." />
                    </div>
                  </label>
                </div>
              </div>
            </div>

            {/* PREGUNTA 7 */}
            <div className="card bg-base-100 shadow-sm border border-base-300">
              <div className="card-body">
                <h2 className="card-title text-xl mb-2 text-primary">7. Interés en alfabetización</h2>
                <p className="text-sm text-base-content/60 mb-4 font-italic">Lee en voz alta: "¿Actualmente te gustaría aprender a leer y escribir?"</p>
                <div className="flex gap-4">
                  <label className="flex items-center justify-center space-x-3 cursor-pointer p-4 rounded-xl hover:bg-primary/20 bg-base-100 border border-primary w-full shadow-sm transition-all focus-within:ring-2 focus-within:ring-primary">
                    <input type="radio" name="interes_aprender" value="Sí" className="radio radio-primary" required />
                    <span className="text-lg font-bold">¡Sí me gustaría!</span>
                  </label>
                  <label className="flex items-center justify-center space-x-3 cursor-pointer p-4 rounded-xl hover:bg-base-200 bg-base-100 border border-base-300 w-full transition-all focus-within:ring-2 focus-within:ring-base-content/20">
                    <input type="radio" name="interes_aprender" value="No" className="radio" required />
                    <span className="text-lg font-medium text-base-content/70">No por ahora</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Acciones */}
            <div className="flex flex-col-reverse sm:flex-row justify-between items-center sm:items-start pt-6 gap-4">
              <button
                type="button"
                onClick={() => {
                  window.scrollTo(0, 0);
                  setStep("welcome");
                }}
                className="btn btn-ghost w-full sm:w-auto text-base-content/70 hover:bg-base-200 btn-lg rounded-full"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="btn btn-primary w-full sm:w-auto btn-lg rounded-full shadow-lg shadow-primary/30 px-10 transition-transform active:scale-95"
              >
                Enviar Encuesta
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 1.414L10.586 9H7a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* 3. PANTALLA DE AGRADECIMIENTO */}
      {step === "thanks" && (
        <div className="flex items-center justify-center min-h-screen p-4">
          <div className="card w-full max-w-md bg-base-100 shadow-2xl text-center border-t-8 border-success">
            <div className="card-body items-center py-12">
              <div className="w-24 h-24 bg-success/10 text-success rounded-full flex items-center justify-center mb-6 shadow-inner">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-3xl font-extrabold text-base-content tracking-tight">¡Gracias por participar!</h2>
              <p className="text-base-content/70 mt-4 mb-8 text-lg">
                Tus respuestas han sido registradas. Nos ayudarán enormemente a seguir mejorando para ti.
              </p>
              <button
                onClick={() => {
                  window.scrollTo(0, 0);
                  setStep("welcome");
                }}
                className="btn btn-outline btn-success rounded-full px-10 h-12"
              >
                Volver al inicio
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}