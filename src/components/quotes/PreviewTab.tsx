import React from "react";
import { useQuote } from "@/contexts/QuoteContext";
import { formatCurrency } from "@/lib/quote-types";
import { Printer, Share2, FileVideo } from "lucide-react";
// @ts-ignore
import html2pdf from "html2pdf.js";

export function PreviewTab() {
  const { logo, client, project, items, financials, payment, mediaFiles } = useQuote();

  const subtotal = items.reduce((t, i) => t + i.quantity * i.unitPrice, 0);
  const total = subtotal + Number(financials.freight || 0) - Number(financials.discount || 0);

  const handleShareWhatsApp = () => {
    const text = `*Orçamento WJ Marcenaria* 🪚\n\n*Cliente:* ${client.name || "Não informado"}\n*Projeto:* ${project.description || "Orçamento nº " + project.number}\n*Valor Total:* ${formatCurrency(total)}\n\nSegue o orçamento detalhado (documento em anexo).`;
    const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(url, "_blank");
  };

  const handleExportPDF = () => {
    const element = document.getElementById("print-area");
    if (!element) return;
    
    const opt = {
      margin: 10,
      filename: `Orcamento_${project.number}_${client.name.replace(/\s+/g, '_')}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };
    
    html2pdf().set(opt).from(element).save();
  };

  return (
    <div>
      <div className="no-print mb-4 flex justify-end gap-3 flex-wrap">
        <button
          onClick={handleShareWhatsApp}
          className="flex items-center gap-2 rounded-lg bg-green-600 px-6 py-3 font-medium text-white shadow-panel hover:bg-green-700"
        >
          <Share2 className="h-5 w-5" /> Compartilhar no WhatsApp
        </button>
        <button
          onClick={handleExportPDF}
          className="flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-3 font-medium text-white shadow-panel hover:bg-blue-700"
        >
          <Printer className="h-5 w-5" /> Baixar PDF
        </button>
        <button
          onClick={() => window.print()}
          className="flex items-center gap-2 rounded-lg bg-primary px-6 py-3 font-medium text-primary-foreground shadow-panel hover:opacity-90"
        >
          <Printer className="h-5 w-5" /> Imprimir
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
              <p className="text-sm text-muted-foreground">Móveis planejados &amp; sob medida</p>
            </div>
          </div>
          <div className="text-right">
            <h2 className="font-display text-xl font-bold">Orçamento nº {project.number}</h2>
            <p className="text-sm">Data: {new Date().toLocaleDateString("pt-BR")}</p>
          </div>
        </div>

        <h3 className="mt-6 mb-2 text-sm font-bold tracking-wide uppercase">Cliente</h3>
        <div className="grid gap-1 rounded-md bg-secondary/50 p-4 text-sm md:grid-cols-2">
          <p><strong>Nome:</strong> {client.name || "Não informado"}</p>
          <p><strong>CPF/CNPJ:</strong> {client.document || "Não informado"}</p>
          <p><strong>Telefone:</strong> {client.phone || "Não informado"}</p>
          <p><strong>E-mail:</strong> {client.email || "Não informado"}</p>
          <p className="md:col-span-2"><strong>Endereço:</strong> {client.address || "Não informado"}</p>
        </div>

        <h3 className="mt-6 mb-2 text-sm font-bold tracking-wide uppercase">Detalhes do projeto</h3>
        <p className="text-sm whitespace-pre-line">{project.description || "Nenhuma descrição fornecida."}</p>
        <p className="mt-2 text-sm"><strong>Prazo de entrega:</strong> {project.deliveryDate || "A combinar"}</p>

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
                <td className="p-2 text-right">{formatCurrency(item.quantity * item.unitPrice)}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan={3} className="p-2 text-right">Subtotal dos itens</td>
              <td className="p-2 text-right">{formatCurrency(subtotal)}</td>
            </tr>
            {Number(financials.freight) > 0 && (
              <tr>
                <td colSpan={3} className="p-2 text-right">Frete / instalação</td>
                <td className="p-2 text-right">+{formatCurrency(financials.freight)}</td>
              </tr>
            )}
            {Number(financials.discount) > 0 && (
              <tr>
                <td colSpan={3} className="p-2 text-right">Desconto</td>
                <td className="p-2 text-right">-{formatCurrency(financials.discount)}</td>
              </tr>
            )}
            <tr className="bg-secondary font-bold">
              <td colSpan={3} className="p-3 text-right">Total do orçamento</td>
              <td className="p-3 text-right">{formatCurrency(total)}</td>
            </tr>
          </tfoot>
        </table>

        {(payment.method || payment.pixKey) && (
          <div className="mt-6 rounded-md border border-border p-4 text-sm">
            {payment.method && <p><strong>Forma de pagamento:</strong> {payment.method}</p>}
            {payment.pixKey && <p className="mt-1"><strong>Chave PIX:</strong> <span className="font-mono">{payment.pixKey}</span></p>}
          </div>
        )}

        {project.notes && (
          <div className="mt-6">
            <h3 className="mb-2 text-sm font-bold tracking-wide uppercase">Observações e condições</h3>
            <p className="text-sm whitespace-pre-line">{project.notes}</p>
          </div>
        )}

        {mediaFiles.length > 0 && (
          <div className="mt-8 html2pdf__page-break">
            <h3 className="mb-3 text-sm font-bold tracking-wide uppercase">Anexos / referências do projeto</h3>
            <div className="grid grid-cols-2 gap-3">
              {mediaFiles.map((media) =>
                media.type === "image" ? (
                  <img key={media.id} src={media.url} alt={media.name} className="w-full rounded-md border border-border object-cover" />
                ) : (
                  <div key={media.id} className="flex flex-col items-center justify-center gap-1 rounded-md border border-border p-6 text-center text-xs">
                    <FileVideo className="h-8 w-8 text-accent" />
                    <p>Vídeo anexado ao projeto</p>
                    <p className="text-muted-foreground">{media.name}</p>
                  </div>
                )
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
  );
}
