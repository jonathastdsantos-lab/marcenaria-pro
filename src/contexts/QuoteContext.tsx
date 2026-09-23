import React, { createContext, useContext, useEffect, useState } from "react";
import {
  type Client,
  type QuoteItem,
  type MediaFile,
  type Quote,
  loadDraft,
  saveDraft,
} from "@/lib/quote-types";
import logoAsset from "@/assets/wj-logo.png.asset.json";

const emptyClient = { id: "", name: "", document: "", phone: "", email: "", address: "" };

type QuoteContextType = {
  quoteId: string;
  setQuoteId: (id: string) => void;
  logo: string;
  setLogo: (logo: string) => void;
  client: Client;
  setClient: (client: Client) => void;
  financials: { discount: number; freight: number };
  setFinancials: (f: { discount: number; freight: number }) => void;
  payment: { method: string; pixKey: string };
  setPayment: (p: { method: string; pixKey: string }) => void;
  project: { number: string; description: string; deliveryDate: string; notes: string };
  setProject: (p: { number: string; description: string; deliveryDate: string; notes: string }) => void;
  items: QuoteItem[];
  setItems: (items: QuoteItem[]) => void;
  mediaFiles: MediaFile[];
  setMediaFiles: (media: MediaFile[]) => void;
  resetContext: () => void;
  loadFromQuote: (quote: Quote) => void;
};

const QuoteContext = createContext<QuoteContextType | undefined>(undefined);

export function QuoteProvider({ children }: { children: React.ReactNode }) {
  const [quoteId, setQuoteId] = useState<string>("");
  const [logo, setLogo] = useState<string>(logoAsset.url);
  const [client, setClient] = useState<Client>(emptyClient);
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
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const draft = loadDraft();
    if (draft) {
      if (draft.id) setQuoteId(draft.id);
      if (draft.logo) setLogo(draft.logo);
      if (draft.client) setClient(draft.client);
      if (draft.financials) setFinancials(draft.financials);
      if (draft.payment) setPayment(draft.payment);
      if (draft.project) setProject(draft.project);
      if (draft.items) setItems(draft.items);
      if (draft.mediaFiles) setMediaFiles(draft.mediaFiles);
    } else {
      setQuoteId(Date.now().toString());
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (!isLoaded) return;
    const draft: Partial<Quote> = {
      id: quoteId,
      logo,
      client,
      financials,
      payment,
      project,
      items,
      mediaFiles,
    };
    saveDraft(draft);
  }, [quoteId, logo, client, financials, payment, project, items, mediaFiles, isLoaded]);

  const resetContext = () => {
    setQuoteId(Date.now().toString());
    setLogo(logoAsset.url);
    setClient(emptyClient);
    setFinancials({ discount: 0, freight: 0 });
    setPayment({ method: "", pixKey: "" });
    setProject({
      number: "0001",
      description: "",
      deliveryDate: "",
      notes:
        "Validade do orçamento: 15 dias.\nCondições de pagamento: 50% no pedido, 50% na entrega.\nGarantia de 12 meses contra defeitos de fabricação.",
    });
    setItems([{ id: "1", description: "", quantity: 1, unitPrice: 0 }]);
    setMediaFiles([]);
  };

  const loadFromQuote = (q: Quote) => {
    setQuoteId(q.id);
    setLogo(q.logo);
    setClient(q.client);
    setFinancials(q.financials);
    setPayment(q.payment);
    setProject(q.project);
    setItems(q.items);
    setMediaFiles(q.mediaFiles);
  };

  return (
    <QuoteContext.Provider
      value={{
        quoteId, setQuoteId,
        logo, setLogo,
        client, setClient,
        financials, setFinancials,
        payment, setPayment,
        project, setProject,
        items, setItems,
        mediaFiles, setMediaFiles,
        resetContext,
        loadFromQuote,
      }}
    >
      {children}
    </QuoteContext.Provider>
  );
}

export const useQuote = () => {
  const context = useContext(QuoteContext);
  if (!context) throw new Error("useQuote must be used within QuoteProvider");
  return context;
};
