export type Client = {
  id: string;
  name: string;
  document: string;
  phone: string;
  email: string;
  address: string;
};

export type QuoteItem = {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
};

export type MediaFile = {
  id: string;
  url: string;
  type: "image" | "video";
  name: string;
  notes?: string;
};

export const formatCurrency = (value: number) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(
    Number.isFinite(value) ? value : 0,
  );

const CLIENTS_KEY = "wj-marcenaria-clientes";
const QUOTES_KEY = "wj-marcenaria-quotes";
const DRAFT_KEY = "wj-marcenaria-draft";

export const loadClients = (): Client[] => {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(CLIENTS_KEY);
    return raw ? (JSON.parse(raw) as Client[]) : [];
  } catch {
    return [];
  }
};

export const saveClients = (clients: Client[]) => {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(CLIENTS_KEY, JSON.stringify(clients));
};

export type Quote = {
  id: string;
  createdAt: string;
  client: Client;
  project: {
    number: string;
    description: string;
    deliveryDate: string;
    notes: string;
  };
  items: QuoteItem[];
  financials: { discount: number; freight: number };
  payment: { method: string; pixKey: string };
  mediaFiles: MediaFile[];
  logo: string;
};

export const loadQuotes = (): Quote[] => {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(QUOTES_KEY);
    return raw ? (JSON.parse(raw) as Quote[]) : [];
  } catch {
    return [];
  }
};

export const saveQuotes = (quotes: Quote[]) => {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(QUOTES_KEY, JSON.stringify(quotes));
};

export const saveDraft = (quote: Partial<Quote>) => {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(DRAFT_KEY, JSON.stringify(quote));
};

export const loadDraft = (): Partial<Quote> | null => {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(DRAFT_KEY);
    return raw ? (JSON.parse(raw) as Partial<Quote>) : null;
  } catch {
    return null;
  }
};

export const clearDraft = () => {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(DRAFT_KEY);
};

export type CatalogItem = Omit<QuoteItem, "id" | "quantity">;

export const MODULE_CATALOG: CatalogItem[] = [
  { description: "Armário superior (MDF Branco)", unitPrice: 450 },
  { description: "Gaveteiro 4 gavetas (MDF Branco)", unitPrice: 700 },
  { description: "Armário inferior 2 portas (MDF Branco)", unitPrice: 600 },
  { description: "Painel de TV (MDF Amadeirado)", unitPrice: 850 },
  { description: "Guarda-roupa 2 portas de correr", unitPrice: 3200 },
  { description: "Mesa de cabeceira", unitPrice: 350 },
  { description: "Nicho decorativo", unitPrice: 120 },
];
