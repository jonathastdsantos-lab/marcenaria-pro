import React, { useState, useEffect } from "react";
import { type Quote, loadQuotes, saveQuotes, formatCurrency } from "@/lib/quote-types";
import { FileText, Trash2, Edit } from "lucide-react";
import { useQuote } from "@/contexts/QuoteContext";

export function HistoryTab({ onOpenQuote }: { onOpenQuote: () => void }) {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const { loadFromQuote } = useQuote();

  useEffect(() => {
    setQuotes(loadQuotes().sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
  }, []);

  const handleDelete = (id: string) => {
    if (!confirm("Tem certeza que deseja excluir este orçamento?")) return;
    const newQuotes = quotes.filter(q => q.id !== id);
    setQuotes(newQuotes);
    saveQuotes(newQuotes);
  };

  const handleOpen = (quote: Quote) => {
    loadFromQuote(quote);
    onOpenQuote();
  };

  return (
    <section className="rounded-xl border border-border bg-card p-5 shadow-panel">
      <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold">
        <FileText className="h-5 w-5 text-accent" /> Meus Orçamentos (Histórico)
      </h2>
      
      <div className="space-y-3">
        {quotes.length === 0 && (
          <p className="rounded-lg border border-dashed border-border py-10 text-center text-sm text-muted-foreground">
            Você ainda não salvou nenhum orçamento.
          </p>
        )}
        {quotes.map((q) => {
          const total = q.items.reduce((t, i) => t + i.quantity * i.unitPrice, 0) 
            + Number(q.financials.freight || 0) - Number(q.financials.discount || 0);
          
          return (
            <div key={q.id} className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border bg-secondary/40 p-4">
              <div>
                <p className="font-semibold">Orçamento nº {q.project.number} - {q.client.name || "Sem nome"}</p>
                <p className="text-sm text-muted-foreground">
                  Data: {new Date(q.createdAt).toLocaleDateString("pt-BR")} · Total: {formatCurrency(total)}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleDelete(q.id)}
                  className="rounded-md p-2 text-destructive hover:bg-destructive/10"
                  title="Excluir"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleOpen(q)}
                  className="flex items-center gap-2 rounded-md bg-accent px-3 py-2 text-sm font-medium text-accent-foreground hover:opacity-90"
                >
                  <Edit className="h-4 w-4" /> Abrir Orçamento
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
