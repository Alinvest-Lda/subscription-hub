import { useState, useRef } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import {
  ArrowLeft, ArrowRight, Upload, CheckCircle2, Smartphone, Building2, CreditCard, Shield, FileUp,
} from "lucide-react";

type PaymentMethod = "mpesa" | "emola" | "banco";

const paymentMethods = [
  { id: "mpesa" as PaymentMethod, label: "M-Pesa", icon: Smartphone, details: "Número: 84 000 0000\nNome: ACJL Lda" },
  { id: "emola" as PaymentMethod, label: "e-Mola", icon: Smartphone, details: "Número: 86 000 0000\nNome: ACJL Lda" },
  { id: "banco" as PaymentMethod, label: "Transferência Bancária", icon: Building2, details: "Banco: BCI\nConta: 00000000000\nNIB: 0000.0000.0000.0000.0000.0\nTitular: ACJL Lda" },
];

const EMAIL_DESTINO = "info@acjl.co.mz";

export default function CheckoutSubscricao() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  const plan = searchParams.get("plan") || "Essencial";
  const price = searchParams.get("price") || "6.000";

  const [step, setStep] = useState<"form" | "payment" | "upload" | "done">("form");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | "">("");
  const [file, setFile] = useState<File | null>(null);
  const [sending, setSending] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({
    nome: "", empresa: "", nuit: "", email: "", telefone: "",
  });

  const canProceedForm = form.nome && form.empresa && form.email && form.telefone;
  const canProceedPayment = paymentMethod !== "";

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) {
      if (f.size > 10 * 1024 * 1024) {
        toast({ title: "Ficheiro muito grande", description: "Máximo 10MB", variant: "destructive" });
        return;
      }
      setFile(f);
    }
  };

  const handleSubmit = async () => {
    if (!file) {
      toast({ title: "Envie o comprovativo de pagamento", variant: "destructive" });
      return;
    }
    setSending(true);

    // Build email content via mailto with details
    const subject = encodeURIComponent(`[Subscrição ${plan}] - ${form.empresa}`);
    const body = encodeURIComponent(
      `NOVA SUBSCRIÇÃO\n\n` +
      `Pacote: ${plan}\n` +
      `Preço: ${price} MT/mês\n` +
      `Método de Pagamento: ${paymentMethod}\n\n` +
      `DADOS DO CLIENTE\n` +
      `Nome: ${form.nome}\n` +
      `Empresa: ${form.empresa}\n` +
      `NUIT: ${form.nuit || "Não informado"}\n` +
      `Email: ${form.email}\n` +
      `Telefone: ${form.telefone}\n\n` +
      `NOTA: O comprovativo de pagamento foi descarregado pelo cliente. Por favor, solicite o envio do ficheiro "${file.name}" por WhatsApp ou email directo.`
    );

    window.open(`mailto:${EMAIL_DESTINO}?subject=${subject}&body=${body}`, "_blank");

    toast({ title: "Email preparado!", description: "Complete o envio no seu cliente de email. Envie também o comprovativo." });
    setStep("done");
    setSending(false);
  };

  if (step === "done") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="max-w-md w-full">
          <Card className="border-primary/20 shadow-xl">
            <CardContent className="p-8 text-center space-y-6">
              <div className="mx-auto h-16 w-16 rounded-full bg-success/10 flex items-center justify-center">
                <CheckCircle2 className="h-8 w-8 text-success" />
              </div>
              <div className="space-y-2">
                <h2 className="text-2xl font-bold">Pedido Enviado!</h2>
                <p className="text-muted-foreground text-sm">
                  Recebemos o seu pedido de subscrição do pacote <strong>{plan}</strong>. A nossa equipa irá validar o pagamento e entrar em contacto em até 24 horas.
                </p>
              </div>
              <div className="rounded-lg bg-muted/50 p-4 text-sm text-left space-y-1">
                <p><strong>Pacote:</strong> {plan}</p>
                <p><strong>Valor:</strong> {price} MT/mês</p>
                <p><strong>Email:</strong> {form.email}</p>
              </div>
              <Button onClick={() => navigate("/")} className="w-full gap-2">
                Voltar ao Início <ArrowRight className="h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <button onClick={() => step === "form" ? navigate("/") : setStep(step === "upload" ? "payment" : "form")} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6">
          <ArrowLeft className="h-4 w-4" /> {step === "form" ? "Voltar" : "Anterior"}
        </button>

        <div className="flex items-center gap-3 mb-8">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <Shield className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold">Subscrição — {plan}</h1>
            <p className="text-sm text-muted-foreground">{price} MT/mês + IVA</p>
          </div>
        </div>

        {/* Progress */}
        <div className="flex items-center gap-2 mb-8">
          {["Dados", "Pagamento", "Comprovativo"].map((label, i) => {
            const stepIdx = ["form", "payment", "upload"].indexOf(step);
            const isActive = i <= stepIdx;
            return (
              <div key={label} className="flex items-center gap-2 flex-1">
                <div className={`h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${isActive ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
                  {i + 1}
                </div>
                <span className={`text-xs font-medium ${isActive ? "text-foreground" : "text-muted-foreground"}`}>{label}</span>
                {i < 2 && <div className={`flex-1 h-px ${isActive ? "bg-primary" : "bg-border"}`} />}
              </div>
            );
          })}
        </div>

        {step === "form" && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            <Card>
              <CardHeader><CardTitle>Dados do Cliente</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Nome Completo *</label>
                  <Input value={form.nome} onChange={(e) => setForm(p => ({ ...p, nome: e.target.value }))} placeholder="O seu nome completo" />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Nome da Empresa *</label>
                  <Input value={form.empresa} onChange={(e) => setForm(p => ({ ...p, empresa: e.target.value }))} placeholder="Nome da empresa" />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1.5 block">NUIT</label>
                  <Input value={form.nuit} onChange={(e) => setForm(p => ({ ...p, nuit: e.target.value }))} placeholder="Número Único de Identificação Tributária" />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Email *</label>
                  <Input type="email" value={form.email} onChange={(e) => setForm(p => ({ ...p, email: e.target.value }))} placeholder="seu@email.com" />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Telefone *</label>
                  <Input value={form.telefone} onChange={(e) => setForm(p => ({ ...p, telefone: e.target.value }))} placeholder="+258 84 000 0000" />
                </div>
                <Button className="w-full gap-2" disabled={!canProceedForm} onClick={() => setStep("payment")}>
                  Continuar <ArrowRight className="h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {step === "payment" && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            <Card>
              <CardHeader><CardTitle>Método de Pagamento</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">Seleccione o método de pagamento e efectue a transferência com os dados indicados.</p>
                <div className="grid gap-3">
                  {paymentMethods.map((pm) => (
                    <button key={pm.id} onClick={() => setPaymentMethod(pm.id)}
                      className={`w-full text-left rounded-xl border p-4 transition-all hover:border-primary/50 ${paymentMethod === pm.id ? "border-primary bg-primary/5" : "border-border"}`}>
                      <div className="flex items-center gap-3">
                        <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${paymentMethod === pm.id ? "bg-primary text-primary-foreground" : "bg-muted"}`}>
                          <pm.icon className="h-5 w-5" />
                        </div>
                        <div className="flex-1">
                          <span className="font-semibold text-sm">{pm.label}</span>
                          {paymentMethod === pm.id && (
                            <pre className="text-xs text-muted-foreground mt-2 whitespace-pre-wrap font-sans">{pm.details}</pre>
                          )}
                        </div>
                        {paymentMethod === pm.id && <CheckCircle2 className="h-5 w-5 text-primary shrink-0" />}
                      </div>
                    </button>
                  ))}
                </div>
                <Button className="w-full gap-2" disabled={!canProceedPayment} onClick={() => setStep("upload")}>
                  Já Efectuei o Pagamento <ArrowRight className="h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {step === "upload" && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            <Card>
              <CardHeader><CardTitle>Enviar Comprovativo</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Faça upload do comprovativo de pagamento (screenshot, foto ou PDF). O comprovativo será enviado à nossa equipa para validação.
                </p>
                <input ref={fileInputRef} type="file" accept="image/*,.pdf" className="hidden" onChange={handleFileChange} />
                <button onClick={() => fileInputRef.current?.click()}
                  className={`w-full rounded-xl border-2 border-dashed p-8 text-center transition-all hover:border-primary/50 ${file ? "border-primary bg-primary/5" : "border-border"}`}>
                  {file ? (
                    <div className="flex items-center justify-center gap-3">
                      <FileUp className="h-8 w-8 text-primary" />
                      <div className="text-left">
                        <p className="text-sm font-semibold">{file.name}</p>
                        <p className="text-xs text-muted-foreground">{(file.size / 1024).toFixed(0)} KB</p>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <Upload className="h-10 w-10 text-muted-foreground mx-auto" />
                      <p className="text-sm font-medium">Clique para enviar o comprovativo</p>
                      <p className="text-xs text-muted-foreground">PNG, JPG ou PDF até 10MB</p>
                    </div>
                  )}
                </button>

                <div className="rounded-lg bg-muted/50 p-4 space-y-2 text-sm">
                  <p className="font-semibold">Resumo do Pedido</p>
                  <div className="flex justify-between"><span className="text-muted-foreground">Pacote</span><span className="font-medium">{plan}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Valor</span><span className="font-medium">{price} MT/mês</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Pagamento</span><span className="font-medium">{paymentMethods.find(p => p.id === paymentMethod)?.label}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Cliente</span><span className="font-medium">{form.empresa}</span></div>
                </div>

                <Button className="w-full gap-2" disabled={!file || sending} onClick={handleSubmit}>
                  {sending ? "A enviar..." : "Confirmar e Enviar"} <ArrowRight className="h-4 w-4" />
                </Button>
                <p className="text-[11px] text-muted-foreground text-center">
                  O comprovativo será enviado por email para validação. Entraremos em contacto em até 24h.
                </p>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
}
