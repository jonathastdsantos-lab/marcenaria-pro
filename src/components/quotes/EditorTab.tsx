import React, { useRef } from "react";
import { useQuote } from "@/contexts/QuoteContext";
import { formatCurrency, MODULE_CATALOG } from "@/lib/quote-types";
import {
  User, Save, Phone, Mail, MapPin, Hammer, Calendar, Plus, Trash2, Wallet, Truck, Percent, Camera, ImagePlus, Info, BookOpen
} from "lucide-react";

export function EditorTab({ onSaveClient, onChangeTab }: { onSaveClient: () => void, onChangeTab: (tab: string) => void }) {
  const {
    quoteId,
    logo, setLogo,
    client, setClient,
    project, setProject,
    items, setItems,
    financials, setFinancials,
    payment, setPayment,
    mediaFiles, setMediaFiles,
    resetContext
  } = useQuote();

  const logoInput = useRef<HTMLInputElement>(null);
  const mediaInput = useRef<HTMLInputElement>(null);

  const subtotal = items.reduce((t, i) => t + i.quantity * i.unitPrice, 0);
  const total = subtotal + Number(financials.freight || 0) - Number(financials.discount || 0);

  const handleClientChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setClient({ ...client, [e.target.name]: e.target.value });

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    const newMedia = files.map((file) => ({
      id: `${Date.now()}-${Math.random()}`,
      url: URL.createObjectURL(file),
      type: (file.type.startsWith("video/") ? "video" : "image") as "video" | "image",
      name: file.name,
    }));
    setMediaFiles([...mediaFiles, ...newMedia]);
    e.target.value = "";
  };

  const addFromCatalog = (catalogItem: { description: string; unitPrice: number }) => {
    setItems([
      ...items,
      {
        id: Date.now().toString(),
        description: catalogItem.description,
        quantity: 1,
        unitPrice: catalogItem.unitPrice
      }
    ]);
  };

  const handleSaveQuote = () => {
    const q: import("@/lib/quote-types").Quote = {
      id: quoteId,
      createdAt: new Date().toISOString(),
      logo,
      client,
      financials,
      payment,
      project,
      items,
      mediaFiles,
    };
    const quotes = import("@/lib/quote-types").then(m => {
      const existing = m.loadQuotes();
      const updated = existing.filter(x => x.id !== quoteId);
      m.saveQuotes([...updated, q]);
      alert("Orçamento salvo com sucesso!");
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between flex-wrap gap-3">
        <button onClick={resetContext} className="flex items-center gap-2 rounded-lg bg-secondary px-6 py-3 font-medium text-secondary-foreground shadow-panel hover:bg-secondary/80">
          Novo Orçamento (Limpar)
        </button>
        <button onClick={handleSaveQuote} className="flex items-center gap-2 rounded-lg bg-green-600 px-6 py-3 font-medium text-white shadow-panel hover:bg-green-700">
          <Save className="h-5 w-5" /> Salvar Orçamento no Histórico
        </button>
      </div>
      
      {/* Logo */}
      <section className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-border bg-card p-5 shadow-panel">
        <div className="flex items-center gap-4">
          <img src={logo} alt="Logo atual" className="h-16 w-16 rounded-md border border-border object-contain p-1" />
          <div>
            <h2 className="font-semibold">Logo da marcenaria</h2>
            <p className="text-sm text-muted-foreground">Aparece no cabeçalho do documento.</p>
          </div>
        </div>
        <input
          ref={logoInput}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) setLogo(URL.createObjectURL(file));
          }}
        />
        <button onClick={() => logoInput.current?.click()} className="flex items-center gap-2 rounded-md border border-border px-4 py-2 text-sm font-medium hover:bg-secondary">
          <ImagePlus className="h-4 w-4" /> Trocar logo
        </button>
      </section>

      {/* Cliente */}
      <section className="rounded-xl border border-border bg-card p-5 shadow-panel">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <h2 className="flex items-center gap-2 text-lg font-semibold"><User className="h-5 w-5 text-accent" /> Dados do cliente</h2>
          <button
            onClick={onSaveClient}
            className="flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90 disabled:opacity-40"
            disabled={!client.name?.trim()}
          >
            <Save className="h-4 w-4" /> Salvar cliente
          </button>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="label-sm">Nome / Empresa</label>
            <input name="name" value={client.name} onChange={handleClientChange} className="field" placeholder="Ex: João Silva" />
          </div>
          <div>
            <label className="label-sm">CPF / CNPJ</label>
            <input name="document" value={client.document} onChange={handleClientChange} className="field" placeholder="000.000.000-00" />
          </div>
          <div>
            <label className="label-sm"><Phone className="mr-1 inline h-3 w-3" /> Telefone</label>
            <input name="phone" value={client.phone} onChange={handleClientChange} className="field" placeholder="(11) 90000-0000" />
          </div>
          <div>
            <label className="label-sm"><Mail className="mr-1 inline h-3 w-3" /> E-mail</label>
            <input name="email" value={client.email} onChange={handleClientChange} className="field" placeholder="cliente@email.com" />
          </div>
          <div className="md:col-span-2">
            <label className="label-sm"><MapPin className="mr-1 inline h-3 w-3" /> Endereço da obra / entrega</label>
            <input name="address" value={client.address} onChange={handleClientChange} className="field" placeholder="Rua, número, bairro, cidade" />
          </div>
        </div>
      </section>

      {/* Projeto e itens */}
      <section className="rounded-xl border border-border bg-card p-5 shadow-panel">
        <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold"><Hammer className="h-5 w-5 text-accent" /> Detalhes do projeto</h2>
        <div className="grid gap-4 md:grid-cols-3">
          <div className="md:col-span-2">
            <label className="label-sm">Descrição geral</label>
            <textarea value={project.description} onChange={(e) => setProject({ ...project, description: e.target.value })} rows={3} className="field" placeholder="Ex: Cozinha planejada em MDF..." />
          </div>
          <div className="space-y-4">
            <div>
              <label className="label-sm">Nº do orçamento</label>
              <input value={project.number} onChange={(e) => setProject({ ...project, number: e.target.value })} className="field" />
            </div>
            <div>
              <label className="label-sm"><Calendar className="mr-1 inline h-3 w-3" /> Prazo de entrega</label>
              <input value={project.deliveryDate} onChange={(e) => setProject({ ...project, deliveryDate: e.target.value })} className="field" placeholder="Ex: 30 dias úteis" />
            </div>
          </div>
        </div>

        <h3 className="mt-6 mb-3 font-semibold">Itens do orçamento</h3>
        <div className="space-y-3">
          {items.map((item, idx) => (
            <div key={item.id} className="grid items-end gap-3 rounded-lg border border-border bg-secondary/40 p-3 md:grid-cols-[1fr_80px_130px_130px_40px]">
              <div>
                <label className="label-sm">Descrição do móvel / serviço</label>
                <input
                  value={item.description}
                  onChange={(e) => setItems(items.map((i) => (i.id === item.id ? { ...i, description: e.target.value } : i)))}
                  className="field" placeholder={`Item ${idx + 1}`}
                />
              </div>
              <div>
                <label className="label-sm">Qtd.</label>
                <input
                  type="number" min={1} value={item.quantity}
                  onChange={(e) => setItems(items.map((i) => (i.id === item.id ? { ...i, quantity: Number(e.target.value) } : i)))}
                  className="field"
                />
              </div>
              <div>
                <label className="label-sm">Valor unitário</label>
                <input
                  type="number" min={0} step="0.01" value={item.unitPrice}
                  onChange={(e) => setItems(items.map((i) => (i.id === item.id ? { ...i, unitPrice: Number(e.target.value) } : i)))}
                  className="field"
                />
              </div>
              <div className="text-right font-semibold">{formatCurrency(item.quantity * item.unitPrice)}</div>
              <button onClick={() => setItems(items.filter((i) => i.id !== item.id))} className="rounded-md p-2 text-destructive hover:bg-destructive/10" title="Remover item">
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
        
        <div className="mt-3 flex flex-wrap gap-2">
          <button
            onClick={() => setItems([...items, { id: Date.now().toString(), description: "", quantity: 1, unitPrice: 0 }])}
            className="flex items-center gap-2 rounded-md border border-dashed border-accent px-4 py-2 text-sm font-medium text-accent hover:bg-accent/10"
          >
            <Plus className="h-4 w-4" /> Adicionar novo item em branco
          </button>
          
          <div className="group relative">
            <button className="flex items-center gap-2 rounded-md bg-secondary px-4 py-2 text-sm font-medium hover:opacity-90">
              <BookOpen className="h-4 w-4" /> Catálogo Rápido
            </button>
            <div className="absolute top-full left-0 mt-1 hidden w-64 rounded-md border border-border bg-popover p-2 shadow-panel group-hover:block z-10">
              <div className="space-y-1">
                {MODULE_CATALOG.map((cat, idx) => (
                  <button
                    key={idx}
                    onClick={() => addFromCatalog(cat)}
                    className="w-full rounded-sm px-2 py-1.5 text-left text-sm hover:bg-accent hover:text-accent-foreground"
                  >
                    {cat.description} - {formatCurrency(cat.unitPrice)}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <button
            onClick={() => onChangeTab("calculator")}
            className="flex items-center gap-2 rounded-md bg-accent/20 px-4 py-2 text-sm font-medium text-accent hover:bg-accent/30"
          >
            Calculadora de Custos
          </button>
        </div>

        <div className="mt-5 flex items-center justify-between rounded-lg bg-primary px-5 py-4 text-primary-foreground">
          <span className="font-medium">Valor total</span>
          <span className="font-display text-2xl font-bold">{formatCurrency(total)}</span>
        </div>
      </section>

      {/* Valores e pagamento */}
      <section className="rounded-xl border border-border bg-card p-5 shadow-panel">
        <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold"><Wallet className="h-5 w-5 text-accent" /> Valores adicionais e pagamento</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="label-sm"><Truck className="mr-1 inline h-3 w-3" /> Frete / instalação (R$)</label>
            <input type="number" step="0.01" value={financials.freight} onChange={(e) => setFinancials({ ...financials, freight: Number(e.target.value) })} className="field" />
          </div>
          <div>
            <label className="label-sm"><Percent className="mr-1 inline h-3 w-3" /> Desconto (R$)</label>
            <input type="number" step="0.01" value={financials.discount} onChange={(e) => setFinancials({ ...financials, discount: Number(e.target.value) })} className="field" />
          </div>
          <div>
            <label className="label-sm">Forma de pagamento</label>
            <input value={payment.method} onChange={(e) => setPayment({ ...payment, method: e.target.value })} className="field" placeholder="Ex: 50% PIX, 50% cartão" />
          </div>
          <div>
            <label className="label-sm">Chave PIX (opcional)</label>
            <input value={payment.pixKey} onChange={(e) => setPayment({ ...payment, pixKey: e.target.value })} className="field font-mono" placeholder="Sua chave PIX" />
          </div>
        </div>
      </section>

      {/* Mídias */}
      <section className="rounded-xl border border-border bg-card p-5 shadow-panel">
        <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold"><Camera className="h-5 w-5 text-accent" /> Fotos e vídeos do projeto</h2>
        <input ref={mediaInput} type="file" accept="image/*,video/*" multiple className="hidden" onChange={handleFileUpload} />
        <button onClick={() => mediaInput.current?.click()} className="flex w-full flex-col items-center gap-2 rounded-lg border-2 border-dashed border-border py-10 text-center hover:border-accent hover:bg-accent/5">
          <ImagePlus className="h-8 w-8 text-accent" />
          <span className="font-medium">Clique para inserir fotos ou vídeos</span>
          <span className="text-xs text-muted-foreground">Imagens (JPG, PNG) e vídeos (MP4, WebM)</span>
        </button>

        {mediaFiles.length > 0 && (
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {mediaFiles.map((media) => (
              <div key={media.id} className="group relative overflow-hidden rounded-lg border border-border bg-secondary/40 flex flex-col">
                <div className="relative">
                  {media.type === "image" ? (
                    <img src={media.url} alt={media.name} className="h-48 w-full object-cover" />
                  ) : (
                    <video src={media.url} controls className="h-48 w-full bg-black object-cover" />
                  )}
                  <button onClick={() => setMediaFiles(mediaFiles.filter((m) => m.id !== media.id))} className="absolute top-2 right-2 rounded-full bg-destructive p-2 text-destructive-foreground opacity-0 transition-opacity group-hover:opacity-100 shadow-md" title="Remover">
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
                <div className="p-3 border-t border-border flex flex-col gap-2 flex-grow">
                  <p className="truncate text-xs text-muted-foreground" title={media.name}>{media.name}</p>
                  <input 
                    type="text" 
                    placeholder="Observações / Condições" 
                    className="field text-sm" 
                    value={media.notes || ""}
                    onChange={(e) => {
                      setMediaFiles(mediaFiles.map(m => m.id === media.id ? { ...m, notes: e.target.value } : m));
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Observações */}
      <section className="rounded-xl border border-border bg-card p-5 shadow-panel">
        <h2 className="mb-2 flex items-center gap-2 text-lg font-semibold"><Info className="h-5 w-5 text-accent" /> Observações e condições</h2>
        <textarea value={project.notes} onChange={(e) => setProject({ ...project, notes: e.target.value })} rows={6} className="field" />
      </section>
    </div>
  );
}
