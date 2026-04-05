import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import PublicDiagnostic from "@/components/PublicDiagnostic";
import FiscalCalendar from "@/components/FiscalCalendar";
import FiscalSimulator from "@/components/FiscalSimulator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import {
  Shield, ClipboardList, RefreshCw, TrendingUp, ArrowRight, CheckCircle2,
  Phone, Mail, MapPin, Users, Building2, Scale, FileText, Calculator,
  ChevronRight, Menu, X, Star, Crown, Rocket, Check, Minus, Search,
  FileSearch, ClipboardCheck, Receipt, Stamp, FilePenLine, HelpCircle,
} from "lucide-react";
import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";

const services = [
  { icon: ClipboardList, title: "Diagnóstico Fiscal", description: "Identifique riscos fiscais antes que resultem em multas. Receba uma avaliação completa da situação fiscal da sua empresa.", features: ["Detecção antecipada de irregularidades", "Score de risco fiscal personalizado", "Plano de correcção com prioridades"] },
  { icon: RefreshCw, title: "Regularização Fiscal", description: "Resolva dívidas e pendências junto à Autoridade Tributária sem comprometer a operação do seu negócio.", features: ["Redução de coimas e juros", "Negociação directa com a AT", "Recuperação da certidão de quitação"] },
  { icon: TrendingUp, title: "Gestão Fiscal Contínua", description: "Acompanhamento permanente das suas obrigações fiscais com alertas e relatórios periódicos.", features: ["Alertas automáticos antes de cada prazo", "Relatórios mensais de gestão fiscal", "Suporte com contabilista dedicado"] },
  { icon: Calculator, title: "Contabilidade Geral", description: "Contabilidade organizada que proporciona visibilidade real sobre as suas finanças.", features: ["Demonstrações financeiras aceites pela banca", "Escrituração sempre actualizada", "Visão clara de custos e receitas"] },
  { icon: FileText, title: "Consultoria Tributária", description: "Optimize a sua carga fiscal de forma segura. Identificamos incentivos e estruturas legais.", features: ["Poupança fiscal comprovada", "Aproveitamento de incentivos fiscais", "Estruturação fiscal em conformidade"] },
  { icon: Scale, title: "Migração de Regime Fiscal", description: "Transição de regime tributário sem perder dados nem gerar irregularidades.", features: ["Mudança de regime sem interrupções", "Migração integral de dados", "Conformidade desde o primeiro dia"] },
];

const servicosAvulso = [
  { icon: ClipboardCheck, title: "Pacote para Concursos Públicos", description: "Preparação completa da documentação fiscal e financeira para concursos públicos.", price: "A partir de 25.000 MT", highlight: "Concursos públicos" },
  { icon: Search, title: "Diagnóstico Fiscal", description: "Avaliação detalhada da situação fiscal: riscos, multas pendentes e oportunidades.", price: "A partir de 5.000 MT", highlight: "Previna multas" },
  { icon: Scale, title: "Migração Fiscal", description: "Transição entre regimes fiscais (ISPC ↔ IVA/IRPC) e actualização de obrigações.", price: "A partir de 8.000 MT", highlight: "Regime optimizado" },
  { icon: Receipt, title: "Submissão de IVA/ISPC", description: "Preparação e entrega das declarações de IVA ou ISPC junto à AT.", price: "A partir de 2.500 MT", highlight: "Prazos cumpridos" },
  { icon: Calculator, title: "Submissão de IRPC", description: "Declaração anual de IRPC, apuramento do lucro tributável e cálculo do imposto.", price: "A partir de 5.000 MT", highlight: "Declaração correcta" },
  { icon: Stamp, title: "Certidões e Documentos Fiscais", description: "Obtenção de certidões de quitação e documentos junto à AT.", price: "A partir de 3.000 MT", highlight: "Documentação em dia" },
  { icon: FileSearch, title: "Due Diligence Fiscal", description: "Análise fiscal aprofundada para processos de aquisição, fusão ou parceria.", price: "A partir de 30.000 MT", highlight: "Investimento seguro" },
  { icon: Building2, title: "Abertura de Empresas", description: "Constituição completa: registo comercial, NUIT, licenciamento e inscrição na AT.", price: "A partir de 15.000 MT", highlight: "Novo negócio" },
  { icon: FilePenLine, title: "Alteração Societária", description: "Mudança de sócios, aumento de capital, alteração do objecto social.", price: "A partir de 8.000 MT", highlight: "Empresa actualizada" },
];

const stats = [
  { value: "500+", label: "Clientes Atendidos" },
  { value: "15+", label: "Anos de Experiência" },
  { value: "98%", label: "Taxa de Satisfação" },
  { value: "24h", label: "Tempo de Resposta" },
];

const values = [
  { icon: Shield, title: "Integridade", description: "Transparência e ética profissional em cada serviço que prestamos." },
  { icon: Users, title: "Proximidade", description: "Relação directa com cada cliente, compreendendo as suas necessidades reais." },
  { icon: Building2, title: "Excelência", description: "Qualidade contínua e actualização permanente face à legislação fiscal." },
];

const pacotes = [
  { name: "Essencial", icon: Star, price: "6.000", period: "/mês", description: "Ideal para micro e pequenas empresas que pretendem manter a contabilidade organizada.", popular: false, features: [
    { text: "Contabilidade Organizada", included: true }, { text: "Submissão do IVA/ISPC e IRPS", included: true },
    { text: "Gestão das Declarações do INSS", included: true }, { text: "Balancete Trimestral", included: true },
    { text: "Suporte por Email e WhatsApp", included: true }, { text: "Relatórios Mensais de Gestão", included: false },
    { text: "Emissão e Controlo de Guias", included: false },
  ]},
  { name: "Empresarial", icon: Crown, price: "12.500", period: "/mês", description: "Para empresas que necessitam de acompanhamento completo com relatórios de gestão.", popular: true, features: [
    { text: "Contabilidade Organizada", included: true }, { text: "Submissão do IVA/ISPC e IRPS", included: true },
    { text: "Gestão das Declarações do INSS", included: true }, { text: "Balancete Trimestral", included: true },
    { text: "Relatórios Mensais de Gestão", included: true }, { text: "Emissão e Controlo de Guias", included: true },
    { text: "Suporte por Email e WhatsApp", included: true },
  ]},
  { name: "PME", icon: Rocket, price: "22.000", period: "/mês", description: "Para PMEs em crescimento que exigem gestão fiscal completa e auditoria de conformidade.", popular: false, features: [
    { text: "Contabilidade Organizada", included: true }, { text: "Submissão do IVA/ISPC e IRPS", included: true },
    { text: "Gestão das Declarações do INSS", included: true }, { text: "Balancete Trimestral", included: true },
    { text: "Relatórios Mensais de Gestão", included: true }, { text: "Emissão e Controlo de Guias", included: true },
    { text: "Planeamento Fiscal", included: true }, { text: "Auditoria de Conformidade Fiscal", included: true },
    { text: "Revisão de Riscos Fiscais", included: true }, { text: "Suporte por Email e WhatsApp", included: true },
  ]},
];

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] as const } }),
};

const faqs = [
  { q: "Qual a diferença entre os pacotes mensais e os serviços avulso?", a: "Os pacotes mensais oferecem acompanhamento contabilístico e fiscal contínuo. Os serviços avulso são contratações pontuais para necessidades específicas, sem compromisso mensal." },
  { q: "Os preços apresentados incluem IVA?", a: "Não. Todos os preços estão sujeitos à adição de IVA à taxa legal em vigor." },
  { q: "Posso mudar de pacote a qualquer momento?", a: "Sim. A alteração entra em vigor no próximo ciclo de facturação." },
  { q: "Que regime fiscal devo escolher para a minha empresa?", a: "Depende do volume de negócios e da natureza da actividade. Faça o nosso diagnóstico fiscal gratuito ou contacte-nos para uma avaliação." },
  { q: "Como funciona o pagamento?", a: "Após escolher o serviço, efectue o pagamento via M-Pesa, e-Mola ou transferência bancária e envie o comprovativo. Após confirmação, iniciamos o serviço." },
  { q: "Como envio o comprovativo de pagamento?", a: "No formulário de checkout, pode fazer upload do comprovativo que será enviado directamente para a nossa equipa por e-mail para validação." },
  { q: "Quanto tempo demora a abertura de uma empresa?", a: "O prazo médio é de 10 a 20 dias úteis, dependendo da complexidade e documentação disponível." },
  { q: "Como posso começar a trabalhar com a ACJL?", a: "Pode começar pelo diagnóstico gratuito, solicitar um serviço avulso ou subscrever um pacote mensal. A equipa entrará em contacto." },
];

export default function Index() {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { toast } = useToast();
  const [contactForm, setContactForm] = useState({ nome: "", email: "", mensagem: "" });
  const [contactSending, setContactSending] = useState(false);

  const scrollTo = (id: string) => {
    setMobileMenuOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  const handleContactSubmit = async () => {
    if (!contactForm.nome || !contactForm.email || !contactForm.mensagem) {
      toast({ title: "Preencha todos os campos", variant: "destructive" });
      return;
    }
    setContactSending(true);
    // Compose mailto
    const subject = encodeURIComponent(`Contacto de ${contactForm.nome}`);
    const body = encodeURIComponent(`Nome: ${contactForm.nome}\nEmail: ${contactForm.email}\n\nMensagem:\n${contactForm.mensagem}`);
    window.open(`mailto:info@acjl.co.mz?subject=${subject}&body=${body}`, "_blank");
    toast({ title: "A abrir o seu cliente de email..." });
    setContactSending(false);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 border-b bg-background/80 glass">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <button onClick={() => scrollTo("hero")} className="flex items-center gap-2.5 group">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground transition-transform group-hover:scale-105">
              <Shield className="h-5 w-5" />
            </div>
            <div className="text-left">
              <span className="block text-sm font-bold leading-none tracking-tight">ACJL</span>
              <span className="block text-[10px] text-muted-foreground leading-tight">Contabilidade e Serviços</span>
            </div>
          </button>
          <div className="hidden md:flex items-center gap-1 text-sm">
            {[{ label: "Sobre Nós", id: "sobre" }, { label: "Serviços", id: "servicos" }, { label: "Pacotes", id: "pacotes" }, { label: "FAQ", id: "faq" }, { label: "Contacto", id: "contacto" }].map((n) => (
              <button key={n.id} onClick={() => scrollTo(n.id)} className="px-3 py-2 text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-muted/50">{n.label}</button>
            ))}
          </div>
          <button className="md:hidden p-2 rounded-lg hover:bg-muted/50 transition-colors" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
        {mobileMenuOpen && (
          <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="md:hidden border-t bg-background px-4 pb-5 space-y-1 pt-3">
            {["Sobre Nós:sobre", "Serviços:servicos", "Pacotes:pacotes", "Avulso:avulso", "FAQ:faq", "Contacto:contacto"].map((item) => {
              const [label, id] = item.split(":");
              return <button key={id} onClick={() => scrollTo(id)} className="block w-full text-left text-sm py-2.5 px-3 rounded-lg text-muted-foreground hover:bg-muted/50 hover:text-foreground transition-colors">{label}</button>;
            })}
          </motion.div>
        )}
      </nav>

      {/* Hero */}
      <section id="hero" className="relative overflow-hidden bg-foreground text-background">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,hsl(217_72%_45%/0.25),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,hsl(199_60%_42%/0.15),transparent_50%)]" />
        <div className="container relative mx-auto px-4 pt-16 pb-10 md:pt-28 md:pb-16">
          <div className="max-w-4xl mx-auto text-center space-y-6 md:space-y-8">
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
              <span className="inline-flex items-center gap-2 rounded-full border border-background/15 bg-background/5 glass px-4 py-1.5 text-[11px] font-medium uppercase tracking-widest text-background/70">
                <Building2 className="h-3 w-3" />Contabilidade &amp; Fiscalidade em Moçambique
              </span>
            </motion.div>
            <motion.h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.08] text-balance" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}>
              O parceiro fiscal que{" "}
              <span className="relative inline-block">
                <span className="relative z-10">faz crescer</span>
                <motion.span className="absolute -bottom-1 left-0 h-1.5 rounded-full bg-primary" initial={{ width: 0 }} animate={{ width: "100%" }} transition={{ duration: 0.8, delay: 0.8, ease: "easeOut" }} />
              </span>
              <br className="hidden sm:block" /> o seu negócio
            </motion.h1>
            <motion.p className="text-base md:text-lg text-background/55 max-w-xl mx-auto leading-relaxed" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}>
              Contabilidade organizada, impostos optimizados e conformidade total com a Autoridade Tributária. Mais de 500 empresas moçambicanas confiam na ACJL.
            </motion.p>
            <motion.div className="flex flex-col sm:flex-row gap-3 justify-center" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }}>
              <Button size="lg" onClick={() => scrollTo("pacotes")} className="gap-2 text-sm sm:text-base px-6 sm:px-8 h-11 sm:h-12 shadow-lg shadow-primary/25 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200">
                Ver Pacotes <ArrowRight className="h-4 w-4" />
              </Button>
              <button onClick={() => scrollTo("avulso")} className="inline-flex items-center justify-center gap-2 text-sm sm:text-base px-6 sm:px-8 h-11 sm:h-12 rounded-lg border border-background/20 text-background/75 bg-transparent hover:border-background/40 hover:text-background hover:-translate-y-0.5 transition-all duration-200">
                Serviços Avulso <ChevronRight className="h-4 w-4" />
              </button>
            </motion.div>
            <motion.div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 pt-2" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.5 }}>
              {["Diagnóstico gratuito", "Pagamento online", "Resposta em 24h"].map((text) => (
                <div key={text} className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-primary" />
                  <span className="text-xs text-background/45">{text}</span>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
        <motion.div className="relative border-t border-background/8" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.6 }}>
          <div className="container mx-auto px-4 py-6 md:py-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
              {stats.map((s, i) => (
                <motion.div key={s.label} className="text-center" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.7 + i * 0.08 }}>
                  <div className="text-2xl sm:text-3xl md:text-4xl font-extrabold bg-gradient-to-b from-background to-background/50 bg-clip-text text-transparent">{s.value}</div>
                  <p className="text-[11px] md:text-xs text-background/35 mt-0.5">{s.label}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </section>

      {/* Sobre Nós */}
      <section id="sobre" className="border-t bg-card/50">
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="grid gap-10 md:gap-16 md:grid-cols-2 items-center">
            <div className="space-y-5">
              <span className="text-xs font-bold uppercase tracking-widest text-primary">Quem Somos</span>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-balance">Mais de 15 anos ao serviço das empresas moçambicanas</h2>
              <p className="text-muted-foreground leading-relaxed text-sm md:text-base">
                A <strong className="text-foreground font-semibold">ACJL — Contabilidade e Serviços</strong> nasceu com a missão de oferecer soluções contabilísticas e fiscais de qualidade, adaptadas à realidade do mercado moçambicano.
              </p>
              <p className="text-muted-foreground leading-relaxed text-sm md:text-base">
                Actuamos na área da contabilidade geral, consultoria tributária, diagnóstico e regularização fiscal, e gestão de obrigações fiscais.
              </p>
            </div>
            <div className="grid gap-4">
              {values.map((v, i) => (
                <motion.div key={v.title} custom={i} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-40px" }}>
                  <div className="flex items-start gap-4 rounded-xl border bg-background p-5 hover:shadow-md hover:border-primary/20 transition-all duration-300">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                      <v.icon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-bold text-sm">{v.title}</h3>
                      <p className="text-sm text-muted-foreground mt-0.5">{v.description}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Serviços */}
      <section id="servicos" className="border-t">
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="text-center mb-10 md:mb-14 space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-primary">Serviços</span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-balance">Soluções fiscais e contabilísticas completas</h2>
            <p className="text-muted-foreground max-w-xl mx-auto text-sm md:text-base">Uma gama abrangente de serviços pensados para o contexto empresarial moçambicano.</p>
          </div>
          <div className="grid gap-4 md:gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((svc, i) => (
              <motion.div key={svc.title} custom={i} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-40px" }}>
                <Card className="h-full group hover:shadow-lg hover:border-primary/20 hover:-translate-y-1 transition-all duration-300 border">
                  <CardContent className="p-5 md:p-6 space-y-4">
                    <div className="h-11 w-11 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/15 group-hover:scale-105 transition-all duration-300">
                      <svc.icon className="h-5 w-5 text-primary" />
                    </div>
                    <h3 className="text-base font-bold">{svc.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{svc.description}</p>
                    <ul className="space-y-2 pt-1">
                      {svc.features.map((f) => (
                        <li key={f} className="flex items-start gap-2 text-sm">
                          <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" /><span>{f}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pacotes */}
      <section id="pacotes" className="border-t bg-card/50">
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="text-center mb-10 md:mb-14 space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-primary">Pacotes</span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-balance">Escolha o plano ideal para o seu negócio</h2>
            <p className="text-muted-foreground max-w-xl mx-auto text-sm md:text-base">Pacotes mensais com tudo incluído — sem custos ocultos.</p>
          </div>
          <div className="grid gap-5 md:gap-6 md:grid-cols-3 max-w-5xl mx-auto">
            {pacotes.map((pkg, i) => (
              <motion.div key={pkg.name} custom={i} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-40px" }} className="relative">
                {pkg.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
                    <span className="inline-flex items-center gap-1 rounded-full bg-primary px-4 py-1 text-xs font-bold text-primary-foreground shadow-lg shadow-primary/25">
                      <Star className="h-3 w-3" /> Mais Popular
                    </span>
                  </div>
                )}
                <Card className={`h-full transition-all duration-300 ${pkg.popular ? "border-primary shadow-xl shadow-primary/10 scale-[1.02]" : "border hover:shadow-lg hover:-translate-y-1 hover:border-primary/20"}`}>
                  <CardHeader className="text-center pb-2 pt-8">
                    <div className={`mx-auto mb-3 h-12 w-12 rounded-xl flex items-center justify-center ${pkg.popular ? "bg-primary text-primary-foreground" : "bg-primary/10"}`}>
                      <pkg.icon className={`h-6 w-6 ${pkg.popular ? "" : "text-primary"}`} />
                    </div>
                    <CardTitle className="text-lg">{pkg.name}</CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">{pkg.description}</p>
                  </CardHeader>
                  <CardContent className="space-y-5">
                    <div className="text-center">
                      <div className="flex items-baseline justify-center gap-1">
                        <span className="text-3xl md:text-4xl font-extrabold">{pkg.price}</span>
                        <span className="text-sm text-muted-foreground">MT{pkg.period}</span>
                      </div>
                    </div>
                    <ul className="space-y-2.5">
                      {pkg.features.map((f) => (
                        <li key={f.text} className="flex items-center gap-2.5 text-sm">
                          {f.included ? <Check className="h-4 w-4 text-primary shrink-0" /> : <Minus className="h-4 w-4 text-muted-foreground/30 shrink-0" />}
                          <span className={f.included ? "" : "text-muted-foreground/40"}>{f.text}</span>
                        </li>
                      ))}
                    </ul>
                    <Button className={`w-full gap-2 transition-all duration-200 ${pkg.popular ? "shadow-lg shadow-primary/20" : ""}`}
                      variant={pkg.popular ? "default" : "outline"}
                      onClick={() => navigate(`/checkout/subscricao?plan=${encodeURIComponent(pkg.name)}&price=${encodeURIComponent(pkg.price)}`)}>
                      Subscrever Agora <ArrowRight className="h-4 w-4" />
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
          <p className="text-center text-xs text-muted-foreground mt-8">Todos os preços em Meticais (MT), sujeitos à adição de IVA à taxa legal em vigor.</p>
        </div>
      </section>

      {/* Serviços Avulso */}
      <section id="avulso" className="border-t">
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="text-center mb-10 md:mb-14 space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-primary">Serviços Avulso</span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-balance">Precisa de algo pontual? Resolvemos por si</h2>
            <p className="text-muted-foreground max-w-xl mx-auto text-sm md:text-base">Contrate apenas o serviço de que precisa — sem compromisso mensal.</p>
          </div>
          <div className="grid gap-4 md:gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {servicosAvulso.map((svc, i) => (
              <motion.div key={svc.title} custom={i} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-40px" }}>
                <Card className="h-full group hover:shadow-lg hover:-translate-y-1 transition-all duration-300 border hover:border-primary/20">
                  <CardContent className="p-5 space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/15 group-hover:scale-105 transition-all duration-300">
                        <svc.icon className="h-5 w-5 text-primary" />
                      </div>
                      <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-[11px] font-semibold text-primary whitespace-nowrap">{svc.highlight}</span>
                    </div>
                    <div>
                      <h3 className="text-base font-bold">{svc.title}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed mt-1">{svc.description}</p>
                    </div>
                    <div className="pt-2 border-t flex items-center justify-between">
                      <span className="text-sm font-bold text-primary">{svc.price}</span>
                      <Button size="sm" variant="ghost" className="gap-1 text-xs hover:bg-primary/10 hover:text-primary"
                        onClick={() => navigate(`/checkout/avulso?service=${encodeURIComponent(svc.title)}&price=${encodeURIComponent(svc.price)}`)}>
                        Solicitar <ArrowRight className="h-3 w-3" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Ferramentas Fiscais */}
      <section id="ferramentas-fiscais" className="border-t bg-card/50">
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="text-center mb-10 md:mb-14 space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-primary">Ferramentas Gratuitas</span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-balance">Ferramentas Fiscais Online</h2>
            <p className="text-muted-foreground max-w-xl mx-auto text-sm md:text-base">Diagnóstico fiscal, calendário de obrigações e simulador de impostos — tudo gratuito.</p>
          </div>
          <Tabs defaultValue="diagnostico" className="w-full">
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-3 mb-8">
              <TabsTrigger value="diagnostico" className="text-xs sm:text-sm">Diagnóstico</TabsTrigger>
              <TabsTrigger value="calendario" className="text-xs sm:text-sm">Calendário</TabsTrigger>
              <TabsTrigger value="simulador" className="text-xs sm:text-sm">Simulador</TabsTrigger>
            </TabsList>
            <TabsContent value="diagnostico"><PublicDiagnostic /></TabsContent>
            <TabsContent value="calendario"><FiscalCalendar /></TabsContent>
            <TabsContent value="simulador"><FiscalSimulator /></TabsContent>
          </Tabs>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="border-t">
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="text-center mb-10 md:mb-14 space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-primary">Perguntas Frequentes</span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-balance">Dúvidas? Nós esclarecemos</h2>
          </div>
          <div className="max-w-3xl mx-auto">
            <Accordion type="single" collapsible className="space-y-3">
              {faqs.map((faq, i) => (
                <motion.div key={i} custom={i} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-40px" }}>
                  <AccordionItem value={`faq-${i}`} className="rounded-xl border bg-background px-5 hover:shadow-sm transition-shadow">
                    <AccordionTrigger className="text-sm font-semibold text-left hover:no-underline gap-3">
                      <span className="flex items-center gap-3"><HelpCircle className="h-4 w-4 text-primary shrink-0" />{faq.q}</span>
                    </AccordionTrigger>
                    <AccordionContent className="text-sm text-muted-foreground leading-relaxed pl-7">{faq.a}</AccordionContent>
                  </AccordionItem>
                </motion.div>
              ))}
            </Accordion>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,hsl(217_72%_45%/0.05),transparent_70%)]" />
        <div className="container relative mx-auto px-4 py-16 md:py-24">
          <div className="max-w-xl mx-auto text-center space-y-5">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-balance">Pronto para organizar a fiscalidade da sua empresa?</h2>
            <p className="text-muted-foreground text-sm md:text-base">Comece pelo diagnóstico gratuito ou escolha o pacote ideal para o seu negócio.</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
              <Button size="lg" onClick={() => scrollTo("pacotes")} className="gap-2 shadow-lg shadow-primary/20 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200">
                Ver Pacotes <ArrowRight className="h-4 w-4" />
              </Button>
              <Button size="lg" variant="outline" onClick={() => scrollTo("ferramentas-fiscais")} className="hover:-translate-y-0.5 transition-all duration-200">
                Diagnóstico Gratuito
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Contacto */}
      <section id="contacto" className="border-t bg-card/50">
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="grid gap-10 md:gap-12 md:grid-cols-2">
            <div className="space-y-5">
              <span className="text-xs font-bold uppercase tracking-widest text-primary">Contacto</span>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-balance">Entre em contacto connosco</h2>
              <p className="text-muted-foreground leading-relaxed text-sm md:text-base">Estamos disponíveis para esclarecer as suas dúvidas e encontrar a solução ideal.</p>
              <div className="space-y-3 pt-2">
                {[
                  { icon: MapPin, label: "Endereço", value: "Maputo, Moçambique" },
                  { icon: Phone, label: "Telefone", value: "+258 84 000 0000" },
                  { icon: Mail, label: "Email", value: "info@acjl.co.mz" },
                ].map(({ icon: Icon, label, value }) => (
                  <div key={label} className="flex items-center gap-3 group">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 group-hover:bg-primary/15 transition-colors">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{label}</p>
                      <p className="text-sm font-medium">{value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-xl border bg-background p-5 md:p-7 space-y-4 shadow-sm">
              <h3 className="text-base font-bold">Envie-nos uma mensagem</h3>
              <div className="space-y-3">
                <div>
                  <label className="text-xs font-semibold mb-1.5 block uppercase tracking-wider text-muted-foreground">Nome</label>
                  <input value={contactForm.nome} onChange={(e) => setContactForm(p => ({ ...p, nome: e.target.value }))} className="w-full rounded-lg border bg-background px-3.5 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring transition-shadow" placeholder="O seu nome" />
                </div>
                <div>
                  <label className="text-xs font-semibold mb-1.5 block uppercase tracking-wider text-muted-foreground">Email</label>
                  <input value={contactForm.email} onChange={(e) => setContactForm(p => ({ ...p, email: e.target.value }))} className="w-full rounded-lg border bg-background px-3.5 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring transition-shadow" placeholder="seu@email.com" type="email" />
                </div>
                <div>
                  <label className="text-xs font-semibold mb-1.5 block uppercase tracking-wider text-muted-foreground">Mensagem</label>
                  <textarea value={contactForm.mensagem} onChange={(e) => setContactForm(p => ({ ...p, mensagem: e.target.value }))} className="w-full rounded-lg border bg-background px-3.5 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring min-h-[100px] resize-y transition-shadow" placeholder="Como podemos ajudar?" />
                </div>
                <Button className="w-full shadow-md shadow-primary/15 hover:shadow-lg transition-all" onClick={handleContactSubmit} disabled={contactSending}>
                  Enviar Mensagem
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-foreground text-background">
        <div className="container mx-auto px-4 py-10 md:py-12">
          <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3">
            <div className="space-y-3">
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                  <Shield className="h-4 w-4" />
                </div>
                <span className="font-bold text-sm">ACJL</span>
              </div>
              <p className="text-xs text-background/50 leading-relaxed max-w-xs">Contabilidade e Serviços — O parceiro fiscal de confiança para empresas em Moçambique.</p>
            </div>
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider">Serviços</h4>
              <ul className="space-y-1.5 text-xs text-background/50">
                {["Diagnóstico Fiscal", "Regularização Fiscal", "Gestão Fiscal Contínua", "Contabilidade Geral", "Consultoria Tributária"].map(s => (
                  <li key={s} className="hover:text-background/70 transition-colors cursor-default">{s}</li>
                ))}
              </ul>
            </div>
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider">Links</h4>
              <ul className="space-y-1.5 text-xs text-background/50">
                <li><button onClick={() => scrollTo("sobre")} className="hover:text-background/80 transition-colors">Sobre Nós</button></li>
                <li><button onClick={() => scrollTo("servicos")} className="hover:text-background/80 transition-colors">Serviços</button></li>
                <li><button onClick={() => scrollTo("pacotes")} className="hover:text-background/80 transition-colors">Pacotes</button></li>
                <li><button onClick={() => scrollTo("contacto")} className="hover:text-background/80 transition-colors">Contacto</button></li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-5 border-t border-background/8 text-center text-[11px] text-background/30">
            <p>© {new Date().getFullYear()} ACJL — Contabilidade e Serviços. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
