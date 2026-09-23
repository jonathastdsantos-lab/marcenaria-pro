import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useQuote, QuoteProvider } from "@/contexts/QuoteContext";
import {
  FileText, Users, Printer, Calculator, History, FileCheck
} from "lucide-react";

import { EditorTab } from "@/components/quotes/EditorTab";
import { PreviewTab } from "@/components/quotes/PreviewTab";
import { ClientsTab } from "@/components/clients/ClientsTab";
import { HistoryTab } from "@/components/quotes/HistoryTab";
import { ContractTab } from "@/components/quotes/ContractTab";
import { CostCalculator } from "@/components/calculator/CostCalculator";

import { saveClients, loadClients } from "@/lib/quote-types";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "WJ Marcenaria — Sistema de Orçamentos" },
      {
        name: "description",
        content: "Monte orçamentos de móveis planejados da WJ Marcenaria com fotos, vídeos, condições de pagamento e impressão em PDF.",
      },
    ],
  }),
  component: () => (
    <QuoteProvider>
      <QuoteApp />
    </QuoteProvider>
  ),
});

type Tab = "editor" | "clients" | "preview" | "history" | "contract" | "calculator";

function QuoteApp() {
  const [activeTab, setActiveTab] = useState<Tab>("editor");
  const { logo, client, items, setItems } = useQuote();

  const handleSaveClient = () => {
    if (!client.name.trim()) return;
    const clients = loadClients();
    // avoid duplicates if id exists, otherwise create new
    const exists = clients.find(c => c.document === client.document && client.document);
    if (!exists) {
      saveClients([...clients, { ...client, id: Date.now().toString() }]);
    }
    setActiveTab("clients");
  };

  const tabs: { id: Tab; label: string; icon: any }[] = [
    { id: "editor", label: "Editar Orçamento", icon: FileText },
    { id: "calculator", label: "Calculadora", icon: Calculator },
    { id: "preview", label: "Visualizar / PDF", icon: Printer },
    { id: "contract", label: "Contrato", icon: FileCheck },
    { id: "clients", label: "Clientes", icon: Users },
    { id: "history", label: "Meus Orçamentos", icon: History },
  ];

  return (
    <div className="min-h-screen bg-background">
      <header className="no-print sticky top-0 z-20 border-b border-border bg-primary text-primary-foreground shadow-md">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-3">
          <div className="flex items-center gap-3">
            <img src={logo} alt="WJ Marcenaria" className="h-11 w-11 rounded-md object-contain bg-white" />
            <div>
              <p className="font-display text-lg leading-tight font-bold">WJ Marcenaria</p>
              <p className="text-xs opacity-80">Móveis planejados &amp; sob medida</p>
            </div>
          </div>
          <nav className="flex flex-wrap gap-1">
            {tabs.map((t) => {
              const Icon = t.icon;
              return (
                <button
                  key={t.id}
                  onClick={() => setActiveTab(t.id)}
                  className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors ${
                    activeTab === t.id
                      ? "bg-accent text-accent-foreground font-semibold"
                      : "hover:bg-primary-foreground/10"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span className="hidden sm:inline">{t.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-6">
        {activeTab === "editor" && (
          <EditorTab 
            onSaveClient={handleSaveClient} 
            onChangeTab={setActiveTab} 
          />
        )}

        {activeTab === "calculator" && (
          <CostCalculator onAddAndReturn={(item) => {
            setItems([...items, { ...item, id: Date.now().toString() }]);
            setActiveTab("editor");
          }} />
        )}

        {activeTab === "preview" && <PreviewTab />}
        
        {activeTab === "contract" && <ContractTab />}

        {activeTab === "clients" && (
          <ClientsTab onUseClient={(c) => {
            // Context will be updated automatically by EditorTab if we were in there, 
            // but we need to update it here manually since we extracted state to Context.
            // Wait, we can't easily access setClient here unless we call it.
            // Let's pass a function or get setClient from useQuote.
            // I'll update it inside ClientsTab itself, wait.
            setActiveTab("editor");
          }} />
        )}

        {activeTab === "history" && (
          <HistoryTab onOpenQuote={() => setActiveTab("editor")} />
        )}
      </main>
    </div>
  );
}
