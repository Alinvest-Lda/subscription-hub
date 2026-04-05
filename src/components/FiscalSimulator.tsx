import { useState, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { Calculator, ArrowRight, Info } from "lucide-react";

type Regime = "ispc" | "iva_irpc";

export default function FiscalSimulator() {
  const [revenue, setRevenue] = useState("");
  const [costs, setCosts] = useState("");
  const [employees, setEmployees] = useState("");
  const [regime, setRegime] = useState<Regime | "">("");
  const [showResult, setShowResult] = useState(false);

  const revenueNum = parseFloat(revenue.replace(/\s/g, "")) || 0;
  const costsNum = parseFloat(costs.replace(/\s/g, "")) || 0;
  const employeesNum = parseInt(employees) || 0;
  const canSimulate = revenueNum > 0 && regime !== "";

  const result = useMemo(() => {
    if (!canSimulate) return null;
    const profit = Math.max(0, revenueNum - costsNum);
    let totalTax = 0;
    const breakdown: { label: string; value: number; note?: string }[] = [];

    if (regime === "ispc") {
      const ispcRate = revenueNum <= 2500000 ? 0.03 : 0.04;
      const ispc = revenueNum * ispcRate;
      breakdown.push({ label: "ISPC", value: ispc, note: `${(ispcRate * 100).toFixed(0)}% sobre facturação` });
      totalTax += ispc;
    } else {
      const iva = revenueNum * 0.16;
      breakdown.push({ label: "IVA a entregar (estimativa)", value: iva * 0.3, note: "16% s/ vendas menos IVA dedutível" });
      totalTax += iva * 0.3;
      const irpc = profit * 0.32;
      breakdown.push({ label: "IRPC", value: irpc, note: "32% sobre lucro tributável" });
      totalTax += irpc;
    }

    if (employeesNum > 0) {
      const avgSalary = 15000;
      const irpsEstimate = employeesNum * avgSalary * 0.1 * 12;
      breakdown.push({ label: "IRPS (retenção colaboradores)", value: irpsEstimate, note: `${employeesNum} colaborador(es) × estimativa mensal` });
      totalTax += irpsEstimate;
      const inss = employeesNum * avgSalary * 0.07 * 12;
      breakdown.push({ label: "INSS (contrib. patronal)", value: inss, note: "7% sobre salários" });
      totalTax += inss;
    }

    const suggestedRegime: Regime = revenueNum <= 2500000 ? "ispc" : "iva_irpc";
    return { totalTax, breakdown, profit, suggestedRegime };
  }, [canSimulate, revenueNum, costsNum, employeesNum, regime]);

  const formatMT = (val: number) => val.toLocaleString("pt-MZ", { minimumFractionDigits: 0, maximumFractionDigits: 0 }) + " MT";

  if (!showResult) {
    return (
      <div className="max-w-2xl mx-auto">
        <Card className="border-primary/20 shadow-lg">
          <CardContent className="p-6 md:p-8 space-y-6">
            <div className="text-center space-y-2">
              <div className="mx-auto h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <Calculator className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold">Simulador Fiscal</h3>
              <p className="text-sm text-muted-foreground">Estime os impostos anuais da sua empresa</p>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-1.5 block">Volume de negócios anual (MT) *</label>
                <input type="text" inputMode="numeric" value={revenue} onChange={(e) => setRevenue(e.target.value.replace(/[^\d]/g, ""))}
                  className="w-full rounded-lg border bg-background px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring" placeholder="Ex: 5000000" />
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 block">Custos operacionais anuais (MT)</label>
                <input type="text" inputMode="numeric" value={costs} onChange={(e) => setCosts(e.target.value.replace(/[^\d]/g, ""))}
                  className="w-full rounded-lg border bg-background px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring" placeholder="Ex: 3000000" />
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 block">Número de colaboradores</label>
                <input type="text" inputMode="numeric" value={employees} onChange={(e) => setEmployees(e.target.value.replace(/[^\d]/g, ""))}
                  className="w-full rounded-lg border bg-background px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring" placeholder="Ex: 5" />
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 block">Regime fiscal *</label>
                <div className="grid grid-cols-2 gap-3">
                  {[{ val: "ispc" as Regime, label: "ISPC", sub: "Simplificado" }, { val: "iva_irpc" as Regime, label: "IVA + IRPC", sub: "Regime Normal" }].map((r) => (
                    <button key={r.val} type="button" onClick={() => setRegime(r.val)}
                      className={`rounded-lg border px-4 py-3 text-sm text-left transition-all hover:border-primary/50 ${regime === r.val ? "border-primary bg-primary/5 font-medium" : "border-border"}`}>
                      <span className="font-medium block">{r.label}</span>
                      <span className="text-xs text-muted-foreground">{r.sub}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <Button className="w-full gap-2" size="lg" disabled={!canSimulate} onClick={() => setShowResult(true)}>
              Simular Impostos <ArrowRight className="h-4 w-4" />
            </Button>
            <p className="text-[11px] text-muted-foreground text-center flex items-start gap-1 justify-center">
              <Info className="h-3 w-3 mt-0.5 shrink-0" />Simulação indicativa.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!result) return null;

  return (
    <div className="max-w-2xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
        <Card className="border-primary/20 shadow-lg">
          <CardContent className="p-6 md:p-8 space-y-6">
            <div className="text-center space-y-2">
              <h3 className="text-xl font-bold">Resultado da Simulação</h3>
              <p className="text-sm text-muted-foreground">Regime: <Badge variant="secondary">{regime === "ispc" ? "ISPC" : "IVA + IRPC"}</Badge></p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-lg bg-muted/50 p-4 text-center">
                <p className="text-xs text-muted-foreground mb-1">Facturação</p>
                <p className="text-lg font-bold">{formatMT(revenueNum)}</p>
              </div>
              <div className="rounded-lg bg-primary/5 border border-primary/20 p-4 text-center">
                <p className="text-xs text-muted-foreground mb-1">Carga Fiscal Estimada</p>
                <p className="text-lg font-bold text-primary">{formatMT(result.totalTax)}</p>
              </div>
            </div>
            <div className="space-y-3">
              <h4 className="font-semibold text-sm">Decomposição</h4>
              <div className="space-y-2">
                {result.breakdown.map((item, i) => (
                  <div key={i} className="flex items-center justify-between rounded-lg border px-4 py-3">
                    <div>
                      <p className="text-sm font-medium">{item.label}</p>
                      {item.note && <p className="text-xs text-muted-foreground">{item.note}</p>}
                    </div>
                    <span className="text-sm font-bold whitespace-nowrap ml-4">{formatMT(item.value)}</span>
                  </div>
                ))}
              </div>
            </div>
            {result.suggestedRegime !== regime && (
              <div className="rounded-lg bg-warning/10 border border-warning/20 p-4 flex items-start gap-3">
                <Info className="h-5 w-5 text-warning shrink-0 mt-0.5" />
                <div className="text-sm">
                  <p className="font-medium text-warning">Sugestão</p>
                  <p className="text-muted-foreground">
                    O regime <strong>{result.suggestedRegime === "ispc" ? "ISPC" : "IVA + IRPC"}</strong> poderá ser mais vantajoso.
                  </p>
                </div>
              </div>
            )}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Button variant="outline" className="flex-1" onClick={() => setShowResult(false)}>Nova Simulação</Button>
              <Button className="flex-1 gap-2" onClick={() => document.getElementById("contacto")?.scrollIntoView({ behavior: "smooth" })}>
                Consultoria Personalizada <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
