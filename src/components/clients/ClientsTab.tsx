import React, { useState, useEffect } from "react";
import { useQuote } from "@/contexts/QuoteContext";
import { type Client, loadClients, saveClients } from "@/lib/quote-types";
import { Users, Search, Trash2 } from "lucide-react";

export function ClientsTab({ onUseClient }: { onUseClient: (client: Client) => void }) {
  const [savedClients, setSavedClients] = useState<Client[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const { setClient } = useQuote();

  useEffect(() => {
    setSavedClients(loadClients());
  }, []);

  const persistClients = (next: Client[]) => {
    setSavedClients(next);
    saveClients(next);
  };

  const filteredClients = savedClients.filter(
    (c) => c.name.toLowerCase().includes(searchTerm.toLowerCase()) || c.document.includes(searchTerm)
  );

  const handleUseClient = (c: Client) => {
    setClient(c);
    onUseClient(c);
  };

  return (
    <section className="rounded-xl border border-border bg-card p-5 shadow-panel">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h2 className="flex items-center gap-2 text-lg font-semibold"><Users className="h-5 w-5 text-accent" /> Lista de clientes</h2>
        <div className="relative">
          <Search className="absolute top-2.5 left-3 h-4 w-4 text-muted-foreground" />
          <input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="field pl-9"
            placeholder="Buscar por nome ou documento"
          />
        </div>
      </div>
      <div className="space-y-3">
        {filteredClients.length === 0 && (
          <p className="rounded-lg border border-dashed border-border py-10 text-center text-sm text-muted-foreground">
            Nenhum cliente cadastrado ainda.
          </p>
        )}
        {filteredClients.map((c) => (
          <div key={c.id} className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border bg-secondary/40 p-4">
            <div>
              <p className="font-semibold">{c.name}</p>
              <p className="text-sm text-muted-foreground">
                {c.document || "Sem documento"} · {c.phone || "Sem telefone"}
              </p>
              {c.address && <p className="text-xs text-muted-foreground">{c.address}</p>}
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => persistClients(savedClients.filter((x) => x.id !== c.id))}
                className="rounded-md p-2 text-destructive hover:bg-destructive/10"
                title="Excluir"
              >
                <Trash2 className="h-4 w-4" />
              </button>
              <button
                onClick={() => handleUseClient(c)}
                className="rounded-md bg-accent px-3 py-2 text-sm font-medium text-accent-foreground hover:opacity-90"
              >
                Usar no orçamento
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
