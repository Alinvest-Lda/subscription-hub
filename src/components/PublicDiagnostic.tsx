import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";
import {
  ClipboardList, ArrowRight, ArrowLeft, CheckCircle2, AlertTriangle, XCircle, RotateCcw,
} from "lucide-react";
import { diagnosticQuestions, calculateDiagnosticScore } from "@/lib/diagnostic-questions";

export default function PublicDiagnostic() {
  const [started, setStarted] = useState(false);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [currentStep, setCurrentStep] = useState(0);
  const [finished, setFinished] = useState(false);

  const visibleQuestions = useMemo(
    () => diagnosticQuestions.filter((q) => !q.showIf || q.showIf(answers)),
    [answers]
  );

  const categories = useMemo(() => {
    const cats: string[] = [];
    visibleQuestions.forEach((q) => {
      if (!cats.includes(q.category)) cats.push(q.category);
    });
    return cats;
  }, [visibleQuestions]);

  const currentCategory = categories[currentStep] || "";
  const categoryQuestions = visibleQuestions.filter((q) => q.category === currentCategory);
  const progress = categories.length ? ((currentStep + 1) / categories.length) * 100 : 0;

  const handleAnswer = (questionId: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  const canProceed = categoryQuestions
    .filter((q) => q.required)
    .every((q) => answers[q.id] && answers[q.id].trim() !== "");

  const handleNext = () => {
    if (currentStep < categories.length - 1) setCurrentStep((s) => s + 1);
    else setFinished(true);
  };

  const handleBack = () => {
    if (currentStep > 0) setCurrentStep((s) => s - 1);
  };

  const safeStep = Math.min(currentStep, categories.length - 1);
  if (safeStep !== currentStep && !finished) setCurrentStep(safeStep);

  const result = finished ? calculateDiagnosticScore(answers) : null;

  const riskConfig: Record<string, { color: string; icon: React.ElementType; label: string; bg: string }> = {
    baixo: { color: "text-success", icon: CheckCircle2, label: "Risco Baixo", bg: "bg-success/10 border-success/20" },
    medio: { color: "text-warning", icon: AlertTriangle, label: "Risco Médio", bg: "bg-warning/10 border-warning/20" },
    alto: { color: "text-destructive", icon: AlertTriangle, label: "Risco Alto", bg: "bg-destructive/10 border-destructive/20" },
    critico: { color: "text-destructive", icon: XCircle, label: "Risco Crítico", bg: "bg-destructive/10 border-destructive/20" },
  };

  const handleRestart = () => {
    setStarted(false);
    setAnswers({});
    setCurrentStep(0);
    setFinished(false);
  };

  if (!started) {
    return (
      <Card className="max-w-2xl mx-auto border-primary/20 shadow-lg">
        <CardContent className="p-8 md:p-10 text-center space-y-6">
          <div className="mx-auto h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center">
            <ClipboardList className="h-8 w-8 text-primary" />
          </div>
          <div className="space-y-2">
            <h3 className="text-2xl font-bold tracking-tight">Diagnóstico Fiscal Gratuito</h3>
            <p className="text-muted-foreground leading-relaxed">
              Responda a algumas perguntas sobre a sua empresa e receba instantaneamente um relatório com o seu score fiscal, nível de risco e recomendações personalizadas.
            </p>
          </div>
          <ul className="text-sm text-left space-y-2 max-w-sm mx-auto">
            {["Leva menos de 5 minutos", "100% gratuito e confidencial", "Resultado imediato com recomendações"].map((t) => (
              <li key={t} className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
                <span>{t}</span>
              </li>
            ))}
          </ul>
          <Button size="lg" className="gap-2" onClick={() => setStarted(true)}>
            Iniciar Diagnóstico <ArrowRight className="h-4 w-4" />
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (finished && result) {
    const cfg = riskConfig[result.riskLevel] || riskConfig.medio;
    const RiskIcon = cfg.icon;
    return (
      <Card className="max-w-2xl mx-auto border-primary/20 shadow-lg">
        <CardHeader className="text-center pb-2">
          <CardTitle className="text-2xl">Resultado do Diagnóstico</CardTitle>
        </CardHeader>
        <CardContent className="p-8 space-y-6">
          <div className="text-center space-y-3">
            <div className="relative mx-auto h-32 w-32">
              <svg className="h-32 w-32 -rotate-90" viewBox="0 0 128 128">
                <circle cx="64" cy="64" r="56" fill="none" strokeWidth="10" className="stroke-muted" />
                <circle cx="64" cy="64" r="56" fill="none" strokeWidth="10" strokeDasharray={`${(result.score / 100) * 352} 352`} strokeLinecap="round" className="stroke-primary transition-all duration-1000" />
              </svg>
              <span className="absolute inset-0 flex items-center justify-center text-3xl font-bold">{result.score}</span>
            </div>
            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border ${cfg.bg}`}>
              <RiskIcon className={`h-5 w-5 ${cfg.color}`} />
              <span className={`font-semibold ${cfg.color}`}>{cfg.label}</span>
            </div>
          </div>
          <div className="space-y-3">
            <h4 className="font-semibold text-lg">Recomendações</h4>
            <ul className="space-y-2">
              {result.recommendations.map((rec, i) => (
                <li key={i} className="flex items-start gap-2 text-sm">
                  <ArrowRight className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                  <span>{rec}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="border-t pt-4 text-center space-y-3">
            <p className="text-sm text-muted-foreground">Quer um diagnóstico aprofundado com plano de acção completo? Fale com a nossa equipa.</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button variant="outline" className="gap-2" onClick={handleRestart}>
                <RotateCcw className="h-4 w-4" /> Refazer Diagnóstico
              </Button>
              <Button className="gap-2" onClick={() => document.getElementById("contacto")?.scrollIntoView({ behavior: "smooth" })}>
                Falar com a Equipa <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="max-w-2xl mx-auto border-primary/20 shadow-lg">
      <CardHeader className="pb-3 space-y-3">
        <div className="flex items-center justify-between">
          <Badge variant="secondary" className="text-xs">{currentCategory}</Badge>
          <span className="text-xs text-muted-foreground">{currentStep + 1} de {categories.length}</span>
        </div>
        <Progress value={progress} className="h-2" />
      </CardHeader>
      <CardContent className="p-6 md:p-8 space-y-6">
        <AnimatePresence mode="wait">
          <motion.div key={currentCategory} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }} className="space-y-6">
            {categoryQuestions.map((q) => (
              <div key={q.id} className="space-y-3">
                <label className="text-sm font-medium leading-relaxed block">
                  {q.question}
                  {q.required && <span className="text-destructive ml-1">*</span>}
                </label>
                {q.type === "radio" && q.options && (
                  <div className="grid gap-2">
                    {q.options.map((opt) => (
                      <button key={opt.value} type="button" onClick={() => handleAnswer(q.id, opt.value)}
                        className={`w-full text-left rounded-lg border px-4 py-3 text-sm transition-all hover:border-primary/50 ${answers[q.id] === opt.value ? "border-primary bg-primary/5 font-medium" : "border-border"}`}>
                        <span className="flex items-center gap-3">
                          <span className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2 ${answers[q.id] === opt.value ? "border-primary bg-primary" : "border-muted-foreground/30"}`}>
                            {answers[q.id] === opt.value && <span className="h-1.5 w-1.5 rounded-full bg-primary-foreground" />}
                          </span>
                          {opt.label}
                        </span>
                      </button>
                    ))}
                  </div>
                )}
                {q.type === "select" && q.options && (
                  <select value={answers[q.id] || ""} onChange={(e) => handleAnswer(q.id, e.target.value)}
                    className="w-full rounded-lg border border-input bg-background px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring">
                    <option value="">Seleccione...</option>
                    {q.options.map((opt) => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                  </select>
                )}
                {q.type === "text" && <Input value={answers[q.id] || ""} onChange={(e) => handleAnswer(q.id, e.target.value)} placeholder="Escreva a sua resposta..." />}
                {q.type === "number" && <Input type="number" inputMode="numeric" value={answers[q.id] || ""} onChange={(e) => handleAnswer(q.id, e.target.value)} placeholder="Introduza o valor..." />}
              </div>
            ))}
          </motion.div>
        </AnimatePresence>
        <div className="flex justify-between pt-2">
          <Button variant="outline" onClick={handleBack} disabled={currentStep === 0} className="gap-2">
            <ArrowLeft className="h-4 w-4" /> Anterior
          </Button>
          <Button onClick={handleNext} disabled={!canProceed} className="gap-2">
            {currentStep === categories.length - 1 ? "Ver Resultado" : "Próximo"} <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
