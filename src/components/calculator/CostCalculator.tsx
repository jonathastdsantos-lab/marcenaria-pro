import React, { useState } from "react";
import { Calculator, Plus } from "lucide-react";
import { formatCurrency } from "@/lib/quote-types";
import { useQuote } from "@/contexts/QuoteContext";

export function CostCalculator({ onAddAndReturn }: { onAddAndReturn: (item: {description: string, quantity: number, unitPrice: number}) => void }) {
  const [description, setDescription] = useState("Armário personalizado");
  const [plates, setPlates] = useState({ quantity: 1, price: 250 });
  const [hardware, setHardware] = useState(150);
  const [edgeBand, setEdgeBand] = useState(50);
  const [laborHours, setLaborHours] = useState(8);
  const [laborPrice, setLaborPrice] = useState(50);
  const [margin, setMargin] = useState(50);

  const materialCost = (plates.quantity * plates.price) + Number(hardware) + Number(edgeBand);
  const laborCost = Number(laborHours) * Number(laborPrice);
  const totalCost = materialCost + laborCost;
  
  const suggestedPrice = totalCost * (1 + Number(margin) / 100);

  const handleAdd = () => {
    onAddAndReturn({
      description: description,
      quantity: 1,
      unitPrice: suggestedPrice
    });
  };

  return (
    <section className="mx-auto max-w-3xl rounded-xl border border-border bg-card p-5 shadow-panel">
      <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold">
        <Calculator className="h-5 w-5 text-accent" /> Calculadora de Custos
      </h2>
      <p className="mb-6 text-sm text-muted-foreground">
        Preencha os custos de material e mão de obra. O sistema sugerirá o preço de venda com base na margem de lucro.
      </p>

      <div className="space-y-6">
        <div>
          <label className="label-sm">Descrição do Móvel / Item</label>
          <input value={description} onChange={(e) => setDescription(e.target.value)} className="field" />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-lg border border-border bg-secondary/20 p-4">
            <h3 className="font-semibold text-sm mb-3">Materiais</h3>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="label-sm">Chapas de MDF (Qtd)</label>
                  <input type="number" value={plates.quantity} onChange={(e) => setPlates({ ...plates, quantity: Number(e.target.value) })} className="field" />
                </div>
                <div>
                  <label className="label-sm">Preço da chapa (R$)</label>
                  <input type="number" value={plates.price} onChange={(e) => setPlates({ ...plates, price: Number(e.target.value) })} className="field" />
                </div>
              </div>
              <div>
                <label className="label-sm">Ferragens (Corrediças, dobradiças, etc) (R$)</label>
                <input type="number" value={hardware} onChange={(e) => setHardware(Number(e.target.value))} className="field" />
              </div>
              <div>
                <label className="label-sm">Fita de borda / Cola (R$)</label>
                <input type="number" value={edgeBand} onChange={(e) => setEdgeBand(Number(e.target.value))} className="field" />
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-border bg-secondary/20 p-4">
            <h3 className="font-semibold text-sm mb-3">Mão de Obra e Lucro</h3>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="label-sm">Horas de trabalho</label>
                  <input type="number" value={laborHours} onChange={(e) => setLaborHours(Number(e.target.value))} className="field" />
                </div>
                <div>
                  <label className="label-sm">Valor hora (R$)</label>
                  <input type="number" value={laborPrice} onChange={(e) => setLaborPrice(Number(e.target.value))} className="field" />
                </div>
              </div>
              <div>
                <label className="label-sm">Margem de lucro (%)</label>
                <input type="number" value={margin} onChange={(e) => setMargin(Number(e.target.value))} className="field" />
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-lg bg-primary/10 p-5 border border-primary/20">
          <div className="grid grid-cols-3 text-sm text-center">
            <div>
              <p className="text-muted-foreground">Custo Material</p>
              <p className="font-semibold">{formatCurrency(materialCost)}</p>
            </div>
            <div className="border-l border-r border-border">
              <p className="text-muted-foreground">Mão de Obra</p>
              <p className="font-semibold">{formatCurrency(laborCost)}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Custo Total</p>
              <p className="font-semibold">{formatCurrency(totalCost)}</p>
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
            <span className="text-lg font-medium">Preço Sugerido para Venda:</span>
            <span className="font-display text-2xl font-bold text-primary">{formatCurrency(suggestedPrice)}</span>
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <button
            onClick={handleAdd}
            className="flex items-center gap-2 rounded-lg bg-primary px-6 py-3 font-medium text-primary-foreground hover:opacity-90"
          >
            <Plus className="h-5 w-5" /> Adicionar item ao Orçamento
          </button>
        </div>
      </div>
    </section>
  );
}
