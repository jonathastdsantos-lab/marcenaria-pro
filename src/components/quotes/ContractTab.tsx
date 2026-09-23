import React from "react";
import { useQuote } from "@/contexts/QuoteContext";
import { formatCurrency } from "@/lib/quote-types";
import { Printer, FileText } from "lucide-react";
// @ts-ignore
import html2pdf from "html2pdf.js";

export function ContractTab() {
  const { client, project, items, financials, payment } = useQuote();

  const subtotal = items.reduce((t, i) => t + i.quantity * i.unitPrice, 0);
  const total = subtotal + Number(financials.freight || 0) - Number(financials.discount || 0);

  const handleExportPDF = () => {
    const element = document.getElementById("contract-print-area");
    if (!element) return;
    
    const opt = {
      margin: 15,
      filename: `Contrato_${project.number}_${client.name.replace(/\s+/g, '_')}.pdf`,
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
          onClick={handleExportPDF}
          className="flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-3 font-medium text-white shadow-panel hover:bg-blue-700"
        >
          <FileText className="h-5 w-5" /> Baixar Contrato em PDF
        </button>
        <button
          onClick={() => window.print()}
          className="flex items-center gap-2 rounded-lg bg-primary px-6 py-3 font-medium text-primary-foreground shadow-panel hover:opacity-90"
        >
          <Printer className="h-5 w-5" /> Imprimir Contrato
        </button>
      </div>

      <div
        id="contract-print-area"
        className="mx-auto max-w-[820px] bg-paper p-10 text-paper-foreground shadow-panel text-sm leading-relaxed"
      >
        <h1 className="text-center text-xl font-bold uppercase mb-8">Contrato de Prestação de Serviços de Marcenaria</h1>
        
        <p className="mb-4 text-justify">
          Pelo presente instrumento particular, de um lado <strong>WJ Marcenaria</strong>, doravante denominada <strong>CONTRATADA</strong>, 
          e de outro lado <strong>{client.name || "_________________________________"}</strong>, inscrito(a) no CPF/CNPJ sob nº <strong>{client.document || "________________"}</strong>, 
          residente/estabelecido(a) na <strong>{client.address || "_____________________________________________________"}</strong>, doravante 
          denominado(a) <strong>CONTRATANTE</strong>.
        </p>

        <h3 className="font-bold uppercase mt-6 mb-2">Cláusula 1ª - Do Objeto</h3>
        <p className="mb-4 text-justify">
          O presente contrato tem como objeto a fabricação, montagem e instalação de móveis planejados/sob medida 
          conforme descrito no orçamento nº <strong>{project.number}</strong>:
          <br/>
          <em>{project.description || "Descrição do projeto não fornecida."}</em>
        </p>

        <h3 className="font-bold uppercase mt-6 mb-2">Cláusula 2ª - Do Valor e Forma de Pagamento</h3>
        <p className="mb-4 text-justify">
          Pelos serviços prestados, a CONTRATANTE pagará à CONTRATADA o valor total de <strong>{formatCurrency(total)}</strong>.
          <br/>
          <strong>Condições de pagamento:</strong> {payment.method || "A combinar"}.
        </p>

        <h3 className="font-bold uppercase mt-6 mb-2">Cláusula 3ª - Do Prazo</h3>
        <p className="mb-4 text-justify">
          A CONTRATADA se compromete a entregar e instalar os móveis em até <strong>{project.deliveryDate || "___ dias úteis"}</strong>, 
          contados a partir da aprovação do projeto final e do pagamento inicial acordado.
        </p>

        <h3 className="font-bold uppercase mt-6 mb-2">Cláusula 4ª - Da Garantia</h3>
        <p className="mb-4 text-justify">
          A CONTRATADA oferece garantia de 12 (doze) meses contra defeitos de fabricação ou montagem, não cobrindo 
          danos causados por mau uso, umidade excessiva não comunicada ou desgaste natural.
        </p>

        <h3 className="font-bold uppercase mt-6 mb-2">Cláusula 5ª - Observações Adicionais</h3>
        <p className="mb-4 text-justify whitespace-pre-line">
          {project.notes || "Sem observações adicionais."}
        </p>

        <div className="mt-16 text-center">
          <p>Local e data: _________________, {new Date().toLocaleDateString("pt-BR")}</p>
        </div>

        <div className="mt-16 grid grid-cols-2 gap-10 text-center text-xs">
          <div>
            <div className="mb-1 border-t border-paper-foreground" />
            <p className="font-semibold">WJ Marcenaria</p>
            <p className="text-muted-foreground">CONTRATADA</p>
          </div>
          <div>
            <div className="mb-1 border-t border-paper-foreground" />
            <p className="font-semibold">{client.name || "Assinatura do cliente"}</p>
            <p className="text-muted-foreground">CONTRATANTE</p>
          </div>
        </div>
      </div>
    </div>
  );
}
