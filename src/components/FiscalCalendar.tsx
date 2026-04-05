import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, ChevronLeft, ChevronRight, AlertTriangle, Clock } from "lucide-react";

interface Obligation {
  name: string;
  day: number;
  type: "iva" | "irpc" | "irps" | "ispc" | "inss" | "outro";
  frequency: string;
  description?: string;
}

const monthNames = ["Janeiro","Fevereiro","Março","Abril","Maio","Junho","Julho","Agosto","Setembro","Outubro","Novembro","Dezembro"];
const monthAbbr = ["Jan","Fev","Mar","Abr","Mai","Jun","Jul","Ago","Set","Out","Nov","Dez"];

const obligations: Obligation[] = [
  { name: "Declaração Periódica IVA", day: 15, type: "iva", frequency: "mensal", description: "Entrega e pagamento do IVA mensal" },
  { name: "Retenção IRPS (salários)", day: 20, type: "irps", frequency: "mensal", description: "Retenção na fonte sobre remunerações" },
  { name: "Contribuição INSS", day: 15, type: "inss", frequency: "mensal", description: "Contribuição patronal e do trabalhador" },
  { name: "Pagamento por Conta IRPC", day: 20, type: "irpc", frequency: "trimestral", description: "Pagamento trimestral por conta do IRPC" },
  { name: "Declaração ISPC", day: 15, type: "ispc", frequency: "trimestral", description: "Declaração trimestral do regime simplificado" },
  { name: "Declaração Modelo 22 (IRPC)", day: 31, type: "irpc", frequency: "anual_maio", description: "Declaração anual de rendimentos empresariais" },
];

const typeConfig: Record<string, { label: string; bg: string; text: string; border: string; dot: string }> = {
  iva: { label: "IVA", bg: "bg-info/10", text: "text-info", border: "border-info/20", dot: "bg-info" },
  irpc: { label: "IRPC", bg: "bg-success/10", text: "text-success", border: "border-success/20", dot: "bg-success" },
  irps: { label: "IRPS", bg: "bg-primary/10", text: "text-primary", border: "border-primary/20", dot: "bg-primary" },
  ispc: { label: "ISPC", bg: "bg-warning/10", text: "text-warning", border: "border-warning/20", dot: "bg-warning" },
  inss: { label: "INSS", bg: "bg-destructive/10", text: "text-destructive", border: "border-destructive/20", dot: "bg-destructive" },
  outro: { label: "Outro", bg: "bg-muted/50", text: "text-muted-foreground", border: "border-border", dot: "bg-muted-foreground" },
};

function getMonthObligations(month: number) {
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentDay = now.getDate();
  return obligations
    .filter((ob) => {
      if (ob.frequency === "mensal") return true;
      if (ob.frequency === "trimestral" && [2, 5, 8, 11].includes(month)) return true;
      if (ob.frequency === "anual_maio" && month === 4) return true;
      return false;
    })
    .map((ob) => ({
      ...ob,
      isUpcoming: month === currentMonth && ob.day >= currentDay && ob.day <= currentDay + 7,
      isPast: month < currentMonth || (month === currentMonth && ob.day < currentDay),
    }))
    .sort((a, b) => a.day - b.day);
}

const currentMonth = new Date().getMonth();

export default function FiscalCalendar() {
  const [selectedMonth, setSelectedMonth] = useState(currentMonth);
  const [direction, setDirection] = useState(0);
  const selectedItems = getMonthObligations(selectedMonth);

  const goTo = (next: number) => { setDirection(next > selectedMonth ? 1 : -1); setSelectedMonth(next); };
  const prev = () => goTo(selectedMonth === 0 ? 11 : selectedMonth - 1);
  const next = () => goTo(selectedMonth === 11 ? 0 : selectedMonth + 1);

  const variants = {
    enter: (d: number) => ({ x: d > 0 ? 60 : -60, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (d: number) => ({ x: d > 0 ? -60 : 60, opacity: 0 }),
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-1 overflow-x-auto pb-1 px-1">
        {monthNames.map((_, i) => (
          <button key={i} onClick={() => goTo(i)}
            className={`shrink-0 rounded-full px-3.5 py-1.5 text-xs font-medium transition-all ${i === selectedMonth ? "bg-primary text-primary-foreground shadow-md shadow-primary/20" : i === currentMonth ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted"}`}>
            {monthAbbr[i]}
          </button>
        ))}
      </div>
      <Card className="overflow-hidden border-0 shadow-xl">
        <div className="relative bg-gradient-to-r from-primary/10 via-primary/5 to-transparent px-6 md:px-8 pt-6 pb-5">
          <div className="flex items-center justify-between">
            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full" onClick={prev}><ChevronLeft className="h-4 w-4" /></Button>
            <div className="text-center">
              <AnimatePresence mode="wait" custom={direction}>
                <motion.h3 key={selectedMonth} custom={direction} variants={variants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.2 }} className="text-2xl font-bold tracking-tight">
                  {monthNames[selectedMonth]}
                </motion.h3>
              </AnimatePresence>
              <p className="text-xs text-muted-foreground mt-0.5">
                {selectedItems.length} obrigaç{selectedItems.length === 1 ? "ão" : "ões"}
                {selectedMonth === currentMonth && <Badge variant="default" className="ml-1.5 text-[10px] px-1.5 py-0 align-middle">Mês actual</Badge>}
              </p>
            </div>
            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full" onClick={next}><ChevronRight className="h-4 w-4" /></Button>
          </div>
          <div className="flex flex-wrap gap-2 justify-center mt-4">
            {Object.entries(typeConfig).map(([key, cfg]) => (
              <span key={key} className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[10px] font-medium ${cfg.bg} ${cfg.text} border ${cfg.border}`}>
                <span className={`h-1.5 w-1.5 rounded-full ${cfg.dot}`} />{cfg.label}
              </span>
            ))}
          </div>
        </div>
        <CardContent className="p-6 md:p-8">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div key={selectedMonth} custom={direction} variants={variants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.25 }}>
              {selectedItems.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <div className="mx-auto h-16 w-16 rounded-2xl bg-muted/50 flex items-center justify-center mb-4">
                    <Calendar className="h-7 w-7 opacity-40" />
                  </div>
                  <p className="text-sm font-medium">Sem obrigações fiscais específicas</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {selectedItems.map((item, j) => {
                    const cfg = typeConfig[item.type];
                    return (
                      <motion.div key={`${selectedMonth}-${j}`} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: j * 0.04 }}>
                        <div className={`group relative flex items-stretch gap-0 rounded-xl border overflow-hidden transition-all hover:shadow-md ${item.isUpcoming ? "border-warning/40 shadow-sm shadow-warning/10" : item.isPast ? "border-border/60 opacity-60" : "border-border hover:border-primary/30"}`}>
                          <div className={`flex flex-col items-center justify-center w-16 shrink-0 py-3 ${item.isUpcoming ? "bg-warning/10" : cfg.bg}`}>
                            <span className={`text-xl font-bold leading-none ${item.isUpcoming ? "text-warning" : cfg.text}`}>{item.day}</span>
                            <span className="text-[9px] font-medium uppercase mt-0.5 text-muted-foreground">{monthAbbr[selectedMonth]}</span>
                          </div>
                          <div className={`w-px self-stretch ${item.isUpcoming ? "bg-warning/30" : cfg.border}`} />
                          <div className="flex-1 flex items-center justify-between gap-3 px-4 py-3 bg-card">
                            <div className="min-w-0 space-y-0.5">
                              <div className="flex items-center gap-2 flex-wrap">
                                <h4 className="text-sm font-semibold truncate">{item.name}</h4>
                                {item.isUpcoming && (
                                  <span className="inline-flex items-center gap-1 rounded-full bg-warning/10 border border-warning/20 px-2 py-0.5 text-[10px] font-medium text-warning">
                                    <Clock className="h-2.5 w-2.5" />Prazo próximo
                                  </span>
                                )}
                              </div>
                              {item.description && <p className="text-xs text-muted-foreground truncate">{item.description}</p>}
                            </div>
                            <Badge variant="secondary" className={`shrink-0 text-[10px] font-semibold border ${cfg.bg} ${cfg.text} ${cfg.border}`}>{cfg.label}</Badge>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </CardContent>
      </Card>
      <p className="text-center text-[11px] text-muted-foreground/70">
        <AlertTriangle className="inline h-3 w-3 mr-1 opacity-60" />
        Datas indicativas. Confirme sempre os prazos oficiais junto da AT.
      </p>
    </div>
  );
}
