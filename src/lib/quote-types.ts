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
};

export const formatCurrency = (value: number) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(
    Number.isFinite(value) ? value : 0,
  );

const CLIENTS_KEY = "wj-marcenaria-clientes";

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
