import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import {
  Printer,
  Plus,
  Trash2,
  FileVideo,
  User,
  MapPin,
  Phone,
  Mail,
  FileText,
  Calendar,
  Camera,
  Info,
  Wallet,
  Truck,
  Percent,
  ImagePlus,
  Users,
  Search,
  Save,
  Hammer,
} from "lucide-react";
import logoAsset from "@/assets/wj-logo.png.asset.json";
import {
  formatCurrency,
  loadClients,
  saveClients,
  type Client,
  type MediaFile,
  type QuoteItem,
} from "@/lib/quote-types";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "WJ Marcenaria — Sistema de Orçamentos" },
      {
        name: "description",
        content:
          "Monte orçamentos de móveis planejados da WJ Marcenaria com fotos, vídeos, condições de pagamento e impressão em PDF.",
      },
      { property: "og:title", content: "WJ Marcenaria — Sistema de Orçamentos" },
      {
        property: "og:description",
        content:
          "Orçamentos completos para marcenaria: clientes, itens, anexos e documento pronto para imprimir.",
      },
    ],
  }),
  component: QuoteApp,
});

type Tab = "editor" | "clients" | "preview";

const emptyClient = { name: "", document: "", phone: "", email: "", address: "" };

function QuoteApp() {
  const [activeTab, setActiveTab] = useState<Tab>("editor");
  const [logo, setLogo] = useState<string>(logoAsset.url);
  const [savedClients, setSavedClients] = useState<Client[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [client, setClient] = useState(emptyClient);
  const [financials, setFinancials] = useState({ discount: 0, freight: 0 });
  const [payment, setPayment] = useState({ method: "", pixKey: "" });
  const [project, setProject] = useState({
    number: "0001",
    description: "",
    deliveryDate: "",
    notes:
      "Validade do orçamento: 15 dias.\nCondições de pagamento: 50% no pedido, 50% na entrega.\nGarantia de 12 meses contra defeitos de fabricação.",
  });
  const [items, setItems] = useState<QuoteItem[]>([
    { id: "1", description: "", quantity: 1, unitPrice: 0 },
  ]);
  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([]);
  const logoInput = useRef<HTMLInputElement>(null);
  const mediaInput = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setSavedClients(loadClients());
  }, []);

  const persistClients = (next: Client[]) => {
    setSavedClients(next);
    saveClients(next);
  };

  const subtotal = items.reduce((t, i) => t + i.quantity * i.unitPrice, 0);
  const total = subtotal + Number(financials.freight || 0) - Number(financials.discount || 0);

  const filteredClients = savedClients.filter(
    (c) =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) || c.document.includes(searchTerm),
  );

  const handleClientChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setClient({ ...client, [e.target.name]: e.target.value });

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    const newMedia: MediaFile[] = files.map((file) => ({
      id: `${Date.now()}-${Math.random()}`,
      url: URL.createObjectURL(file),
      type: file.type.startsWith("video/") ? "video" : "image",
      name: file.name,
    }));
    setMediaFiles((prev) => [...prev, ...newMedia]);
    e.target.value = "";
  };

  const tabs: { id: Tab; label: string; icon: typeof User }[] = [
    { id: "editor", label: "Editar Orçamento", icon: FileText },
    { id: "clients", label: "Clientes", icon: Users },
    { id: "preview", label: "Visualizar / Imprimir", icon: Printer },
  ];

  return (
    <div className="min-h-screen bg-background">
      <header className="no-print sticky top-0 z-20 border-b border-border bg-primary text-primary-foreground">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-3">
          <div className="flex items-center gap-3">
            <img src={logo} alt="WJ Marcenaria" className="h-11 w-11 rounded-md object-contain" />
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
                  {t.label}
                </button>
              );
            })}
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-6">
        {activeTab === "editor" && (
          <div className="space-y-6">
            {/* Logo */}
            <section className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-border bg-card p-5 shadow-panel">
              <div className="flex items-center gap-4">
                <img
                  src={logo}
                  alt="Logo atual"
                  className="h-16 w-16 rounded-md border border-border object-contain p-1"
                />
                <div>
                  <h2 className="font-semibold">Logo da marcenaria</h2>
                  <p className="text-sm text-muted-foreground">
                    Aparece no cabeçalho do documento impresso.
                  </p>
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
              <button
                onClick={() => logoInput.current?.click()}
                className="flex items-center gap-2 rounded-md border border-border px-4 py-2 text-sm font-medium hover:bg-secondary"
              >
                <ImagePlus className="h-4 w-4" /> Trocar logo
              </button>
            </section>

            {/* Cliente */}
            <section className="rounded-xl border border-border bg-card p-5 shadow-panel">
              <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                <h2 className="flex items-center gap-2 text-lg font-semibold">
                  <User className="h-5 w-5 text-accent" /> Dados do cliente
                </h2>
                <button
                  onClick={() => {
                    if (!client.name.trim()) return;
                    persistClients([...savedClients, { ...client, id: Date.now().toString() }]);
                    setActiveTab("clients");
                  }}
                  className="flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90 disabled:opacity-40"
                  disabled={!client.name.trim()}
                >
                  <Save className="h-4 w-4" /> Salvar cliente
                </button>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="label-sm">Nome / Empresa</label>
                  <input
                    name="name"
                    value={client.name}
                    onChange={handleClientChange}
                    className="field"
                    placeholder="Ex: João Silva"
                  />
                </div>
                <div>
                  <label className="label-sm">CPF / CNPJ</label>
                  <input
                    name="document"
                    value={client.document}
                    onChange={handleClientChange}
                    className="field"
                    placeholder="000.000.000-00"
                  />
                </div>
                <div>
                  <label className="label-sm">
                    <Phone className="mr-1 inline h-3 w-3" /> Telefone
                  </label>
                  <input
                    name="phone"
                    value={client.phone}
                    onChange={handleClientChange}
                    className="field"
                    placeholder="(11) 90000-0000"
                  />
                </div>
                <div>
                  <label className="label-sm">
                    <Mail className="mr-1 inline h-3 w-3" /> E-mail
                  </label>
                  <input
                    name="email"
                    value={client.email}
                    onChange={handleClientChange}
                    className="field"
                    placeholder="cliente@email.com"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="label-sm">
                    <MapPin className="mr-1 inline h-3 w-3" /> Endereço da obra / entrega
                  </label>
                  <input
                    name="address"
                    value={client.address}
                    onChange={handleClientChange}
                    className="field"
                    placeholder="Rua, número, bairro, cidade"
                  />
                </div>
              </div>
            </section>

            {/* Projeto e itens */}
            <section className="rounded-xl border border-border bg-card p-5 shadow-panel">
              <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold">
                <Hammer className="h-5 w-5 text-accent" /> Detalhes do projeto
              </h2>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="md:col-span-2">
                  <label className="label-sm">Descrição geral</label>
                  <textarea
                    value={project.description}
                    onChange={(e) => setProject({ ...project, description: e.target.value })}
                    rows={3}
                    className="field"
                    placeholder="Ex: Cozinha planejada em MDF, 4 módulos..."
                  />
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="label-sm">Nº do orçamento</label>
                    <input
                      value={project.number}
                      onChange={(e) => setProject({ ...project, number: e.target.value })}
                      className="field"
                    />
                  </div>
                  <div>
                    <label className="label-sm">
                      <Calendar className="mr-1 inline h-3 w-3" /> Prazo de entrega
                    </label>
                    <input
                      value={project.deliveryDate}
                      onChange={(e) => setProject({ ...project, deliveryDate: e.target.value })}
                      className="field"
                      placeholder="Ex: 30 dias úteis"
                    />
                  </div>
                </div>
              </div>

              <h3 className="mt-6 mb-3 font-semibold">Itens do orçamento</h3>
              <div className="space-y-3">
                {items.map((item, idx) => (
                  <div
                    key={item.id}
                    className="grid items-end gap-3 rounded-lg border border-border bg-secondary/40 p-3 md:grid-cols-[1fr_80px_130px_130px_40px]"
                  >
                    <div>
                      <label className="label-sm">Descrição do móvel / serviço</label>
                      <input
                        value={item.description}
                        onChange={(e) =>
                          setItems(
                            items.map((i) =>
                              i.id === item.id ? { ...i, description: e.target.value } : i,
                            ),
                          )
                        }
                        className="field"
                        placeholder={`Item ${idx + 1} — Ex: Armário superior MDF branco`}
                      />
                    </div>
                    <div>
                      <label className="label-sm">Qtd.</label>
                      <input
                        type="number"
                        min={1}
                        value={item.quantity}
                        onChange={(e) =>
                          setItems(
                            items.map((i) =>
                              i.id === item.id ? { ...i, quantity: Number(e.target.value) } : i,
                            ),
                          )
                        }
                        className="field"
                      />
                    </div>
                    <div>
                      <label className="label-sm">Valor unitário</label>
                      <input
                        type="number"
                        min={0}
                        step="0.01"
                        value={item.unitPrice}
                        onChange={(e) =>
                          setItems(
                            items.map((i) =>
                              i.id === item.id ? { ...i, unitPrice: Number(e.target.value) } : i,
                            ),
                          )
                        }
                        className="field"
                      />
                    </div>
                    <div className="text-right font-semibold">
                      {formatCurrency(item.quantity * item.unitPrice)}
                    </div>
                    <button
                      onClick={() => setItems(items.filter((i) => i.id !== item.id))}
                      className="rounded-md p-2 text-destructive hover:bg-destructive/10"
                      title="Remover item"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
              <button
                onClick={() =>
                  setItems([
                    ...items,
                    {
                      id: `${Date.now()}`,
                      description: "",
                      quantity: 1,
                      unitPrice: 0,
                    },
                  ])
                }
                className="mt-3 flex items-center gap-2 rounded-md border border-dashed border-accent px-4 py-2 text-sm font-medium text-accent hover:bg-accent/10"
              >
                <Plus className="h-4 w-4" /> Adicionar novo item
              </button>

              <div className="mt-5 flex items-center justify-between rounded-lg bg-primary px-5 py-4 text-primary-foreground">
                <span className="font-medium">Valor total</span>
                <span className="font-display text-2xl font-bold">{formatCurrency(total)}</span>
              </div>
            </section>

            {/* Valores e pagamento */}
            <section className="rounded-xl border border-border bg-card p-5 shadow-panel">
              <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold">
                <Wallet className="h-5 w-5 text-accent" /> Valores adicionais e pagamento
              </h2>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="label-sm">
                    <Truck className="mr-1 inline h-3 w-3" /> Frete / instalação (R$)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={financials.freight}
                    onChange={(e) =>
                      setFinancials({ ...financials, freight: Number(e.target.value) })
                    }
                    className="field"
                  />
                </div>
                <div>
                  <label className="label-sm">
                    <Percent className="mr-1 inline h-3 w-3" /> Desconto (R$)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={financials.discount}
                    onChange={(e) =>
                      setFinancials({ ...financials, discount: Number(e.target.value) })
                    }
                    className="field"
                  />
                </div>
                <div>
                  <label className="label-sm">Forma de pagamento</label>
                  <input
                    value={payment.method}
                    onChange={(e) => setPayment({ ...payment, method: e.target.value })}
                    className="field"
                    placeholder="Ex: 50% PIX, 50% cartão"
                  />
                </div>
                <div>
                  <label className="label-sm">Chave PIX (opcional)</label>
                  <input
                    value={payment.pixKey}
                    onChange={(e) => setPayment({ ...payment, pixKey: e.target.value })}
                    className="field font-mono"
                    placeholder="Sua chave PIX"
                  />
                </div>
              </div>
            </section>

            {/* Mídias */}
            <section className="rounded-xl border border-border bg-card p-5 shadow-panel">
              <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold">
                <Camera className="h-5 w-5 text-accent" /> Fotos e vídeos do projeto
              </h2>
              <input
                ref={mediaInput}
                type="file"
                accept="image/*,video/*"
                multiple
                className="hidden"
                onChange={handleFileUpload}
              />
              <button
                onClick={() => mediaInput.current?.click()}
                className="flex w-full flex-col items-center gap-2 rounded-lg border-2 border-dashed border-border py-10 text-center hover:border-accent hover:bg-accent/5"
              >
                <ImagePlus className="h-8 w-8 text-accent" />
                <span className="font-medium">Clique para inserir fotos ou vídeos</span>
                <span className="text-xs text-muted-foreground">
                  Imagens (JPG, PNG) e vídeos (MP4, WebM)
                </span>
              </button>

              {mediaFiles.length > 0 && (
                <div className="mt-4 grid gap-4 sm:grid-cols-3 lg:grid-cols-4">
                  {mediaFiles.map((media) => (
                    <div
                      key={media.id}
                      className="group relative overflow-hidden rounded-lg border border-border bg-secondary/40"
                    >
                      {media.type === "image" ? (
                        <img src={media.url} alt={media.name} className="h-32 w-full object-cover" />
                      ) : (
                        <video src={media.url} controls className="h-32 w-full bg-black object-cover" />
                      )}
                      <p className="truncate px-2 py-1 text-xs text-muted-foreground">
                        {media.name}
                      </p>
                      <button
                        onClick={() => setMediaFiles(mediaFiles.filter((m) => m.id !== media.id))}
                        className="absolute top-2 right-2 rounded-full bg-destructive p-2 text-destructive-foreground opacity-0 transition-opacity group-hover:opacity-100"
                        title="Remover"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* Observações */}
            <section className="rounded-xl border border-border bg-card p-5 shadow-panel">
              <h2 className="mb-2 flex items-center gap-2 text-lg font-semibold">
                <Info className="h-5 w-5 text-accent" /> Observações e condições
              </h2>
              <p className="mb-3 text-sm text-muted-foreground">
                Validade, pagamento, garantia e demais termos que sairão no documento.
              </p>
              <textarea
                value={project.notes}
                onChange={(e) => setProject({ ...project, notes: e.target.value })}
                rows={6}
                className="field"
              />
            </section>
          </div>
        )}

        {activeTab === "clients" && (
          <section className="rounded-xl border border-border bg-card p-5 shadow-panel">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <h2 className="flex items-center gap-2 text-lg font-semibold">
                <Users className="h-5 w-5 text-accent" /> Lista de clientes
              </h2>
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
                  Nenhum cliente cadastrado ainda. Preencha os dados na aba “Editar Orçamento” e
                  clique em “Salvar cliente”.
                </p>
              )}
              {filteredClients.map((c) => (
                <div
                  key={c.id}
                  className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border bg-secondary/40 p-4"
                >
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
                      onClick={() => {
                        const { id: _id, ...rest } = c;
                        setClient(rest);
                        setActiveTab("editor");
                      }}
                      className="rounded-md bg-accent px-3 py-2 text-sm font-medium text-accent-foreground hover:opacity-90"
                    >
                      Usar no orçamento
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {activeTab === "preview" && (
          <div>
            <div className="no-print mb-4 flex justify-end">
              <button
                onClick={() => window.print()}
                className="flex items-center gap-2 rounded-lg bg-primary px-6 py-3 font-medium text-primary-foreground shadow-panel hover:opacity-90"
              >
                <Printer className="h-5 w-5" /> Gerar PDF / Imprimir
              </button>
            </div>

            <div
              id="print-area"
              className="mx-auto max-w-[820px] bg-paper p-10 text-paper-foreground shadow-panel"
            >
              <div className="flex items-start justify-between border-b-2 border-primary pb-4">
                <div className="flex items-center gap-3">
                  <img src={logo} alt="WJ Marcenaria" className="h-20 w-20 object-contain" />
                  <div>
                    <h1 className="font-display text-2xl font-bold">WJ Marcenaria</h1>
                    <p className="text-sm text-muted-foreground">
                      Móveis planejados &amp; sob medida
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <h2 className="font-display text-xl font-bold">Orçamento nº {project.number}</h2>
                  <p className="text-sm">Data: {new Date().toLocaleDateString("pt-BR")}</p>
                </div>
              </div>

              <h3 className="mt-6 mb-2 text-sm font-bold tracking-wide uppercase">Cliente</h3>
              <div className="grid gap-1 rounded-md bg-secondary/50 p-4 text-sm md:grid-cols-2">
                <p>
                  <strong>Nome:</strong> {client.name || "Não informado"}
                </p>
                <p>
                  <strong>CPF/CNPJ:</strong> {client.document || "Não informado"}
                </p>
                <p>
                  <strong>Telefone:</strong> {client.phone || "Não informado"}
                </p>
                <p>
                  <strong>E-mail:</strong> {client.email || "Não informado"}
                </p>
                <p className="md:col-span-2">
                  <strong>Endereço:</strong> {client.address || "Não informado"}
                </p>
              </div>

              <h3 className="mt-6 mb-2 text-sm font-bold tracking-wide uppercase">
                Detalhes do projeto
              </h3>
              <p className="text-sm whitespace-pre-line">
                {project.description || "Nenhuma descrição fornecida."}
              </p>
              <p className="mt-2 text-sm">
                <strong>Prazo de entrega:</strong> {project.deliveryDate || "A combinar"}
              </p>

              <table className="mt-6 w-full border-collapse text-sm">
                <thead>
                  <tr className="bg-primary text-primary-foreground">
                    <th className="p-2 text-left">Item / Descrição</th>
                    <th className="p-2 text-center">Qtd.</th>
                    <th className="p-2 text-right">V. unitário</th>
                    <th className="p-2 text-right">Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item, idx) => (
                    <tr key={item.id} className="border-b border-border">
                      <td className="p-2">{item.description || `Item ${idx + 1}`}</td>
                      <td className="p-2 text-center">{item.quantity}</td>
                      <td className="p-2 text-right">{formatCurrency(item.unitPrice)}</td>
                      <td className="p-2 text-right">
                        {formatCurrency(item.quantity * item.unitPrice)}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr>
                    <td colSpan={3} className="p-2 text-right">
                      Subtotal dos itens
                    </td>
                    <td className="p-2 text-right">{formatCurrency(subtotal)}</td>
                  </tr>
                  {Number(financials.freight) > 0 && (
                    <tr>
                      <td colSpan={3} className="p-2 text-right">
                        Frete / instalação
                      </td>
                      <td className="p-2 text-right">+{formatCurrency(financials.freight)}</td>
                    </tr>
                  )}
                  {Number(financials.discount) > 0 && (
                    <tr>
                      <td colSpan={3} className="p-2 text-right">
                        Desconto
                      </td>
                      <td className="p-2 text-right">-{formatCurrency(financials.discount)}</td>
                    </tr>
                  )}
                  <tr className="bg-secondary font-bold">
                    <td colSpan={3} className="p-3 text-right">
                      Total do orçamento
                    </td>
                    <td className="p-3 text-right">{formatCurrency(total)}</td>
                  </tr>
                </tfoot>
              </table>

              {(payment.method || payment.pixKey) && (
                <div className="mt-6 rounded-md border border-border p-4 text-sm">
                  {payment.method && (
                    <p>
                      <strong>Forma de pagamento:</strong> {payment.method}
                    </p>
                  )}
                  {payment.pixKey && (
                    <p className="mt-1">
                      <strong>Chave PIX:</strong>{" "}
                      <span className="font-mono">{payment.pixKey}</span>
                    </p>
                  )}
                </div>
              )}

              {project.notes && (
                <div className="mt-6">
                  <h3 className="mb-2 text-sm font-bold tracking-wide uppercase">
                    Observações e condições
                  </h3>
                  <p className="text-sm whitespace-pre-line">{project.notes}</p>
                </div>
              )}

              {mediaFiles.length > 0 && (
                <div className="mt-8">
                  <h3 className="mb-3 text-sm font-bold tracking-wide uppercase">
                    Anexos / referências do projeto
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    {mediaFiles.map((media) =>
                      media.type === "image" ? (
                        <img
                          key={media.id}
                          src={media.url}
                          alt={media.name}
                          className="w-full rounded-md border border-border object-cover"
                        />
                      ) : (
                        <div
                          key={media.id}
                          className="flex flex-col items-center justify-center gap-1 rounded-md border border-border p-6 text-center text-xs"
                        >
                          <FileVideo className="h-8 w-8 text-accent" />
                          <p>Vídeo anexado ao projeto</p>
                          <p className="text-muted-foreground">{media.name}</p>
                        </div>
                      ),
                    )}
                  </div>
                </div>
              )}

              <div className="mt-12 grid grid-cols-2 gap-10 text-center text-xs">
                <div>
                  <div className="mb-1 border-t border-paper-foreground" />
                  <p className="font-semibold">WJ Marcenaria</p>
                  <p className="text-muted-foreground">Contratado</p>
                </div>
                <div>
                  <div className="mb-1 border-t border-paper-foreground" />
                  <p className="font-semibold">{client.name || "Assinatura do cliente"}</p>
                  <p className="text-muted-foreground">Contratante</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
