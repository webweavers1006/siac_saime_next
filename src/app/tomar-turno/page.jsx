"use client";

import { useState } from "react";
import TicketGeneratorForm from "@/features/tickets/components/TicketGeneratorForm";
import { CheckCircle, Ticket } from "lucide-react";

export default function TomarTurnoPage() {
  const [ticketData, setTicketData] = useState(null);

  if (ticketData) {
    return (
      <div className="min-h-screen bg-muted/30 flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-md bg-card border rounded-2xl shadow-lg p-8 text-center space-y-4">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto" />
          <h1 className="text-2xl font-bold">¡Turno Tomado!</h1>
          <div className="bg-muted rounded-xl p-4">
            <p className="text-sm text-muted-foreground">Tu número de turno es</p>
            <p className="text-5xl font-black text-primary mt-2">{ticketData.ticketNumber}</p>
          </div>
          <p className="text-sm text-muted-foreground">
            Espera a que tu número aparezca en la pantalla del lobby.
          </p>
          <button
            onClick={() => setTicketData(null)}
            className="text-sm text-primary hover:underline"
          >
            Tomar otro turno
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-card border rounded-2xl shadow-lg p-6 space-y-4">
        <div className="text-center">
          <Ticket className="h-8 w-8 text-primary mx-auto" />
          <h1 className="text-2xl font-bold tracking-tight mt-2">Tomar Turno</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Ingrese sus datos para tomar un turno
          </p>
        </div>

        <TicketGeneratorForm isPublic={true} onSuccess={setTicketData} />

        <p className="text-xs text-center text-muted-foreground">
          ¿Ya tienes tu turno?{" "}
          <a href="/turnos" className="underline hover:text-primary">
            Ver pantalla del lobby
          </a>
        </p>
      </div>
    </div>
  );
}
