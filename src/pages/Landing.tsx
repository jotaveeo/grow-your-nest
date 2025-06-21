
import { ArrowRight, CheckCircle, Star, Shield, TrendingUp, Target, PieChart, Download, Users, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

const Landing = () => {
  const benefits = [
    {
      icon: <TrendingUp className="w-8 h-8 text-primary" />,
      title: "Controle de Gastos Automático",
      description: "Categorização inteligente das suas despesas com insights em tempo real"
    },
    {
      icon: <Target className="w-8 h-8 text-primary" />,
      title: "Limite de Categoria Inteligente",
      description: "Defina limites por categoria e receba alertas antes de estourar o orçamento"
    },
    {
      icon: <Star className="w-8 h-8 text-primary" />,
      title: "Mural de Metas e Wishlist",
      description: "Visualize seus objetivos e acompanhe o progresso de forma gamificada"
    },
    {
      icon: <PieChart className="w-8 h-8 text-primary" />,
      title: "Relatórios e Gráficos Personalizados",
      description: "Dashboards intuitivos com análises detalhadas do seu dinheiro"
    },
    {
      icon: <Download className="w-8 h-8 text-primary" />,
      title: "Exportação Fácil",
      description: "Exporte seus dados em CSV, Excel ou PDF com apenas um clique"
    }
  ];

  const plans = [
    {
      name: "Free",
      price: "Grátis",
      description: "Ideal para começar",
      features: [
        "Até 3 categorias",
        "Relatórios básicos",
        "1 meta ativa",
        "Suporte por email"
      ],
      cta: "Começar Grátis",
      popular: false
    },
    {
      name: "Essencial",
      price: "R$ 9,90",
      period: "/mês",
      description: "Para uso pessoal",
      features: [
        "Categorias ilimitadas",
        "Todos os relatórios",
        "5 metas ativas",
        "Alertas por WhatsApp",
        "Suporte prioritário"
      ],
      cta: "Teste 7 Dias Grátis",
      popular: true
    },
    {
      name: "Plus",
      price: "R$ 19,90",
      period: "/mês",
      description: "Para freelancers",
      features: [
        "Tudo do Essencial",
        "Múltiplas contas",
        "Metas ilimitadas",
        "Planejamento anual",
        "Integração bancária",
        "Suporte 24/7"
      ],
      cta: "Teste 7 Dias Grátis",
      popular: false
    },
    {
      name: "Pro",
      price: "R$ 29,90",
      period: "/mês",
      description: "Para investidores",
      features: [
        "Tudo do Plus",
        "Análise de investimentos",
        "Consultoria mensal",
        "API personalizada",
        "Relatórios customizados",
        "Gestor de conta dedicado"
      ],
      cta: "Teste 7 Dias Grátis",
      popular: false
    }
  ];

  const testimonials = [
    {
      name: "Marina Silva",
      role: "Freelancer Designer",
      content: "Finalmente consegui organizar minha renda variável! O FinPlan+ me ajudou a economizar R$ 800 no primeiro mês.",
      rating: 5
    },
    {
      name: "João Santos",
      role: "Estudante de Engenharia",
      content: "Saí do vermelho em 3 meses usando as metas do app. Agora já tenho minha reserva de emergência!",
      rating: 5
    },
    {
      name: "Ana Costa",
      role: "Pequena Investidora",
      content: "Os relatórios são incríveis! Descobri onde estava perdendo dinheiro e aumentei meus investimentos em 40%.",
      rating: 5
    }
  ];

  const faqs = [
    {
      question: "Como funciona a integração com meu banco?",
      answer: "Conectamos de forma segura com mais de 100 bancos brasileiros via Open Banking. Seus dados são criptografados e nunca compartilhados."
    },
    {
      question: "Posso cancelar quando quiser?",
      answer: "Sim! Não há fidelidade. Você pode cancelar a qualquer momento e continuar usando até o fim do período pago."
    },
    {
      question: "Meus dados estão seguros?",
      answer: "Utilizamos criptografia bancária e certificação SSL. Seus dados ficam no Brasil e seguem a LGPD rigorosamente."
    },
    {
      question: "Tem app mobile?",
      answer: "Sim! Nosso app está disponível para iOS e Android, com sincronização automática entre dispositivos."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="container mx-auto px-4 py-6 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold text-gray-900">FinPlan+</span>
        </div>
        <Button variant="outline" className="hidden md:flex">
          Já tenho conta
        </Button>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <Badge className="mb-6 bg-primary/10 text-primary hover:bg-primary/20">
          ✨ Mais de 10.000 pessoas já organizaram suas finanças
        </Badge>
        
        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
          Controle seu dinheiro <br />
          <span className="text-primary">antes que ele controle você</span>
        </h1>
        
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Organize, visualize, defina metas e elimine dívidas. Tudo em um só lugar, 
          de forma simples e inteligente.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
          <Button size="lg" className="bg-primary hover:bg-primary/90 text-lg px-8">
            Comece de Graça Agora
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
          <Button variant="outline" size="lg" className="text-lg px-8">
            Ver Demonstração
          </Button>
        </div>

        <div className="text-sm text-gray-500">
          💳 Sem cartão de crédito • 🔒 100% seguro • ⚡ Setup em 2 minutos
        </div>
      </section>

      {/* Benefits Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Por que milhares escolhem o FinPlan+?
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Recursos pensados especificamente para quem tem renda variável e quer ter controle total
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => (
            <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="mb-4">{benefit.icon}</div>
                <CardTitle className="text-xl">{benefit.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-600">
                  {benefit.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Pricing Section */}
      <section className="container mx-auto px-4 py-16 bg-white rounded-3xl my-16 shadow-sm">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Planos que cabem no seu bolso
          </h2>
          <p className="text-xl text-gray-600">
            Comece grátis e evolua conforme sua necessidade
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {plans.map((plan, index) => (
            <Card key={index} className={`relative ${plan.popular ? 'border-primary shadow-xl scale-105' : 'border-gray-200'}`}>
              {plan.popular && (
                <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-primary">
                  Mais Popular
                </Badge>
              )}
              <CardHeader className="text-center">
                <CardTitle className="text-xl">{plan.name}</CardTitle>
                <div className="py-4">
                  <span className="text-3xl font-bold">{plan.price}</span>
                  {plan.period && <span className="text-gray-500">{plan.period}</span>}
                </div>
                <CardDescription>{plan.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button 
                  className={`w-full ${plan.popular ? 'bg-primary hover:bg-primary/90' : 'variant-outline'}`}
                  variant={plan.popular ? 'default' : 'outline'}
                >
                  {plan.cta}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            O que nossos usuários dizem
          </h2>
          <p className="text-xl text-gray-600">
            Histórias reais de transformação financeira
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="border-0 shadow-lg">
              <CardContent className="pt-6">
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-600 mb-6 italic">"{testimonial.content}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                    <Users className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <div className="font-semibold">{testimonial.name}</div>
                    <div className="text-sm text-gray-500">{testimonial.role}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="container mx-auto px-4 py-16 bg-gray-50 rounded-3xl my-16">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Perguntas Frequentes
          </h2>
          <p className="text-xl text-gray-600">
            Tire suas dúvidas sobre o FinPlan+
          </p>
        </div>

        <div className="max-w-3xl mx-auto space-y-6">
          {faqs.map((faq, index) => (
            <Card key={index} className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <MessageCircle className="w-5 h-5 text-primary" />
                  {faq.question}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">{faq.answer}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className="container mx-auto px-4 py-16 text-center bg-gradient-to-r from-primary to-blue-600 rounded-3xl my-16 text-white">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Pronto para transformar sua vida financeira?
        </h2>
        <p className="text-xl mb-8 opacity-90">
          Junte-se a milhares de pessoas que já organizaram suas finanças
        </p>
        <Button size="lg" variant="secondary" className="text-lg px-8">
          Começar Minha Jornada Financeira
          <ArrowRight className="ml-2 w-5 h-5" />
        </Button>
        <div className="mt-6 text-sm opacity-75">
          ✅ 7 dias grátis • ✅ Cancele quando quiser • ✅ Suporte 24/7
        </div>
      </section>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-12 border-t">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-6 h-6 bg-primary rounded flex items-center justify-center">
                <TrendingUp className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold">FinPlan+</span>
            </div>
            <p className="text-gray-600 text-sm">
              A plataforma mais completa para controle financeiro pessoal.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Produto</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>Funcionalidades</li>
              <li>Preços</li>
              <li>Segurança</li>
              <li>API</li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Suporte</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>Central de Ajuda</li>
              <li>Contato</li>
              <li>Status</li>
              <li>Comunidade</li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Legal</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>Política de Privacidade</li>
              <li>Termos de Uso</li>
              <li>LGPD</li>
            </ul>
          </div>
        </div>
        
        <Separator className="my-8" />
        
        <div className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-600">
          <p>© 2024 FinPlan+. Todos os direitos reservados.</p>
          <div className="flex items-center gap-4 mt-4 md:mt-0">
            <Shield className="w-4 h-4" />
            <span>Dados protegidos por criptografia bancária</span>
          </div>
        </div>
      </footer>

      {/* Mobile CTA Fixed */}
      <div className="fixed bottom-4 left-4 right-4 md:hidden z-50">
        <Button size="lg" className="w-full bg-primary hover:bg-primary/90 shadow-lg">
          Começar de Graça
          <ArrowRight className="ml-2 w-5 h-5" />
        </Button>
      </div>
    </div>
  );
};

export default Landing;
