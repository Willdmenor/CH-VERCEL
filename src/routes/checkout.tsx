import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useCart, cartStore } from "@/lib/cart-store";
import { useState } from "react";
import { Check, ChevronLeft, CreditCard, QrCode, Lock, RefreshCw, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { createOrder } from "@/lib/orders.server";

export const Route = createFileRoute("/checkout")({
  head: () => ({ meta: [{ title: "Checkout — CH.Style" }] }),
  component: CheckoutPage,
});

const formatBRL = (n: number) => n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
const FREE_SHIPPING = 299;

type Step = 0 | 1 | 2;
const steps = ["Endereço", "Pagamento", "Confirmação"];

function CheckoutPage() {
  const cart = useCart();
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>(0);
  const [payment, setPayment] = useState<"pix" | "credit">("credit");
  const [installments, setInstallments] = useState(4);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [isFinalizing, setIsFinalizing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    cpf: "",
    email: "",
    phone: "",
    cep: "",
    address: "",
    number: "",
    complement: "",
    district: "",
    city: "",
    state: ""
  });
  const [cep, setCep] = useState("");
  const [loadingShipping, setLoadingShipping] = useState(false);
  const [calculatedShipping, setCalculatedShipping] = useState<number | null>(null);

  const subtotal = cart.items.reduce((a, i) => a + i.price * i.quantity, 0);
  
  // Cálculo de frete dinâmico
  const getShippingCost = () => {
    if (subtotal === 0) return 0;
    if (subtotal >= FREE_SHIPPING) return 0;
    return calculatedShipping ?? 24.90; // Default fallback
  };

  const shipping = getShippingCost();
  const discount = payment === "pix" ? subtotal * 0.05 : 0;
  const total = subtotal + shipping - discount;

  const handleCepBlur = async () => {
    const cleanCep = cep.replace(/\D/g, "");
    if (cleanCep.length !== 8) return;

    setLoadingShipping(true);
    try {
      // Simulação de API de frete (Correios/Melhor Envio)
      await new Promise(resolve => setTimeout(resolve, 800));
      const regionPrefix = parseInt(cleanCep.substring(0, 2));
      
      let cost = 24.90;
      if (regionPrefix >= 1 && regionPrefix <= 19) cost = 18.50; // SP/Interior
      else if (regionPrefix >= 20 && regionPrefix <= 28) cost = 22.90; // RJ/ES
      else if (regionPrefix >= 70) cost = 35.00; // Norte/Nordeste
      
      setCalculatedShipping(cost);
      toast.success("Frete atualizado para sua região");
    } catch (err) {
      toast.error("Erro ao calcular frete");
    } finally {
      setLoadingShipping(false);
    }
  };

  if (cart.items.length === 0 && !orderId) {
    return (
      <div className="container-ch py-32 text-center">
        <h1 className="font-display text-3xl md:text-4xl font-bold mb-4">Sua sacola está vazia</h1>
        <p className="text-muted-foreground mb-8">Adicione produtos para finalizar a compra.</p>
        <Link to="/products" search={{}} className="border border-gold text-gold px-8 py-4 text-xs uppercase tracking-luxury hover:bg-gold hover:text-primary-foreground transition-colors">
          Explorar produtos
        </Link>
      </div>
    );
  }

  const next = (e: React.FormEvent) => {
    e.preventDefault();
    if (step < 2) setStep((step + 1) as Step);
  };

  const finalize = async () => {
    setIsFinalizing(true);
    try {
      const orderNumber = `CH${Date.now().toString().slice(-8)}`;
      
      const payload = {
        orderData: {
          order_number: orderNumber,
          customer_name: formData.name,
          customer_email: formData.email,
          customer_cpf: formData.cpf,
          cep: formData.cep,
          address: `${formData.address}, ${formData.number}${formData.complement ? ` - ${formData.complement}` : ""}`,
          city: formData.city,
          state: formData.state,
          payment_method: payment,
          subtotal_cents: Math.round(subtotal * 100),
          shipping_cents: Math.round(shipping * 100),
          discount_cents: Math.round(discount * 100),
          total_cents: Math.round(total * 100),
          status: payment === "pix" ? "AWAITING_PAYMENT" : "PAID"
        },
        items: cart.items
      };

      await (createOrder as any)({ data: payload });

      setOrderId(orderNumber);
      cart.items.forEach((i) => cartStore.remove(i.id, i.size, i.color));
      toast.success("Pedido confirmado!", { description: `Número: ${orderNumber}` });
    } catch (err) {
      console.error(err);
      toast.error("Erro ao processar pedido. Tente novamente.");
    } finally {
      setIsFinalizing(false);
    }
  };

  if (orderId) {
    return (
      <div className="container-ch py-20 md:py-32 max-w-xl mx-auto text-center animate-fade-up">
        <div className="size-16 rounded-full bg-gradient-gold mx-auto flex items-center justify-center mb-6">
          <Check className="size-8 text-primary-foreground" />
        </div>
        <p className="text-[11px] uppercase tracking-luxury text-gold mb-3">Pedido confirmado</p>
        <h1 className="font-display text-3xl md:text-4xl font-bold mb-4">Obrigado pela sua compra</h1>
        <p className="text-muted-foreground mb-2">Pedido <strong className="text-foreground">{orderId}</strong></p>
        <p className="text-sm text-muted-foreground mb-10">
          Você receberá um e-mail com o código de rastreio assim que o pedido for despachado.
        </p>
        <div className="flex gap-3 justify-center flex-wrap">
          <Link to="/" className="border border-gold text-gold px-8 py-4 text-xs uppercase tracking-luxury hover:bg-gold hover:text-primary-foreground transition-colors">
            Voltar à home
          </Link>
          <button onClick={() => navigate({ to: "/products", search: {} })} className="bg-gradient-gold text-primary-foreground px-8 py-4 text-xs uppercase tracking-luxury font-semibold">
            Continuar comprando
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container-ch py-10 md:py-16 max-w-6xl">
      <button onClick={() => step > 0 ? setStep((step - 1) as Step) : navigate({ to: "/" })} className="text-xs uppercase tracking-luxury text-muted-foreground hover:text-gold flex items-center gap-1 mb-8">
        <ChevronLeft className="size-4" /> Voltar
      </button>

      {/* Stepper */}
      <ol className="flex items-center justify-between mb-12 gap-2">
        {steps.map((label, i) => (
          <li key={label} className="flex-1 flex items-center gap-3">
            <div className={`size-8 rounded-full flex items-center justify-center text-xs font-semibold border transition-colors ${i <= step ? "bg-gold text-primary-foreground border-gold" : "border-border text-muted-foreground"}`}>
              {i < step ? <Check className="size-4" /> : i + 1}
            </div>
            <span className={`text-[10px] md:text-xs uppercase tracking-luxury ${i <= step ? "text-foreground" : "text-muted-foreground"}`}>{label}</span>
            {i < steps.length - 1 && <div className={`flex-1 h-px ${i < step ? "bg-gold" : "bg-border"}`} />}
          </li>
        ))}
      </ol>

      <div className="grid lg:grid-cols-[1fr_380px] gap-10">
        <div className="animate-fade-up">
          {step === 0 && (
            <form onSubmit={next} className="space-y-4">
              <h2 className="font-display text-2xl font-bold mb-2">Endereço de entrega</h2>
              <div className="grid sm:grid-cols-2 gap-3">
                <Field label="Nome completo" required value={formData.name} onChange={(e: any) => setFormData({...formData, name: e.target.value})} />
                <Field label="CPF" required placeholder="000.000.000-00" value={formData.cpf} onChange={(e: any) => setFormData({...formData, cpf: e.target.value})} />
                <Field label="E-mail" required type="email" placeholder="seu@email.com" value={formData.email} onChange={(e: any) => setFormData({...formData, email: e.target.value})} />
                <Field label="Telefone" required placeholder="(00) 00000-0000" value={formData.phone} onChange={(e: any) => setFormData({...formData, phone: e.target.value})} />
                <Field label="CEP" required placeholder="00000-000" value={cep} onChange={(e: any) => {
                  setCep(e.target.value);
                  setFormData({...formData, cep: e.target.value});
                }} onBlur={handleCepBlur} />
                <Field label="Endereço" required className="sm:col-span-1" value={formData.address} onChange={(e: any) => setFormData({...formData, address: e.target.value})} />
                <Field label="Número" required value={formData.number} onChange={(e: any) => setFormData({...formData, number: e.target.value})} />
                <Field label="Complemento" value={formData.complement} onChange={(e: any) => setFormData({...formData, complement: e.target.value})} />
                <Field label="Bairro" required value={formData.district} onChange={(e: any) => setFormData({...formData, district: e.target.value})} />
                <Field label="Cidade" required value={formData.city} onChange={(e: any) => setFormData({...formData, city: e.target.value})} />
                <Field label="Estado" required value={formData.state} onChange={(e: any) => setFormData({...formData, state: e.target.value})} />
              </div>
              <button className="w-full bg-gradient-gold text-primary-foreground py-4 text-xs uppercase tracking-luxury font-semibold hover:shadow-gold transition-shadow mt-4">
                Ir para pagamento
              </button>
            </form>
          )}

          {step === 1 && (
            <form onSubmit={next} className="space-y-6">
              <h2 className="font-display text-2xl font-bold mb-2">Forma de pagamento</h2>

              <div className="grid sm:grid-cols-2 gap-3">
                <button type="button" onClick={() => setPayment("credit")} className={`p-5 border text-left transition-all ${payment === "credit" ? "border-gold bg-charcoal" : "border-border hover:border-gold"}`}>
                  <CreditCard className="size-5 text-gold mb-2" />
                  <p className="text-sm font-semibold">Cartão de crédito</p>
                  <p className="text-xs text-muted-foreground mt-1">Em até 4x sem juros</p>
                </button>
                <button type="button" onClick={() => setPayment("pix")} className={`p-5 border text-left transition-all ${payment === "pix" ? "border-gold bg-charcoal" : "border-border hover:border-gold"}`}>
                  <QrCode className="size-5 text-gold mb-2" />
                  <p className="text-sm font-semibold">PIX</p>
                  <p className="text-xs text-gold mt-1">5% de desconto à vista</p>
                </button>
              </div>

              {payment === "credit" && (
                <div className="grid sm:grid-cols-2 gap-3">
                  <Field label="Número do cartão" required placeholder="0000 0000 0000 0000" className="sm:col-span-2" />
                  <Field label="Nome impresso no cartão" required className="sm:col-span-2" />
                  <Field label="Validade" required placeholder="MM/AA" />
                  <Field label="CVV" required placeholder="123" />
                  <div className="sm:col-span-2">
                    <label className="text-[11px] uppercase tracking-luxury block mb-2">Parcelas</label>
                    <select 
                      value={installments} 
                      onChange={(e: any) => setInstallments(Number(e.target.value))} 
                      className="w-full bg-charcoal border border-border px-4 py-3 text-sm focus:border-gold focus:outline-none"
                    >
                      {[1, 2, 3, 4].map((n) => (
                        <option key={n} value={n}>{n}x de {formatBRL(total / n)} sem juros</option>
                      ))}
                    </select>
                  </div>
                </div>
              )}

              {payment === "pix" && (
                <div className="border border-border p-8 text-center bg-charcoal/50 rounded-xl">
                  <div className="bg-white p-3 rounded-lg inline-block mb-4">
                    <QrCode className="size-40 text-black" />
                  </div>
                  <p className="text-lg font-display font-bold text-gold mb-1">Total com desconto: {formatBRL(total)}</p>
                  <p className="text-xs text-muted-foreground uppercase tracking-widest">O código Pix será gerado após você clicar em finalizar.</p>
                </div>
              )}

              <button className="w-full bg-gradient-gold text-primary-foreground py-4 text-xs uppercase tracking-luxury font-semibold hover:shadow-gold transition-shadow">
                Revisar pedido
              </button>
            </form>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <h2 className="font-display text-2xl font-bold mb-2">Confirmar pedido</h2>
              <ul className="divide-y divide-border border border-border">
                {cart.items.map((i) => (
                  <li key={`${i.id}-${i.size}-${i.color}`} className="p-4 flex gap-4">
                    <img src={i.image} alt={i.name} className="size-16 object-cover bg-charcoal" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">{i.name}</p>
                      <p className="text-xs text-muted-foreground">{i.size} · {i.color} · Qtd {i.quantity}</p>
                    </div>
                    <span className="text-sm font-semibold">{formatBRL(i.price * i.quantity)}</span>
                  </li>
                ))}
              </ul>
              <button 
                onClick={finalize} 
                disabled={isFinalizing}
                className="w-full bg-gradient-gold text-primary-foreground py-4 text-xs uppercase tracking-luxury font-semibold hover:shadow-gold transition-shadow flex items-center justify-center gap-2"
              >
                {isFinalizing ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <Lock className="size-4" />
                )}
                {isFinalizing ? "Processando..." : `Confirmar e pagar ${formatBRL(total)}`}
              </button>
            </div>
          )}
        </div>

        {/* Summary */}
        <aside className="bg-charcoal border border-border p-6 h-fit lg:sticky lg:top-28 space-y-4">
          <h3 className="text-xs uppercase tracking-luxury text-gold">Resumo</h3>
          <ul className="space-y-3 max-h-60 overflow-y-auto">
            {cart.items.map((i) => (
              <li key={`${i.id}-${i.size}-${i.color}`} className="flex gap-3 text-xs">
                <img src={i.image} alt="" className="size-12 object-cover bg-background" />
                <div className="flex-1 min-w-0">
                  <p className="truncate">{i.name}</p>
                  <p className="text-muted-foreground">{i.size} · {i.color} · {i.quantity}x</p>
                </div>
                <span className="font-semibold">{formatBRL(i.price * i.quantity)}</span>
              </li>
            ))}
          </ul>
          <div className="border-t border-border pt-4 space-y-2 text-sm">
            <Row label="Subtotal" value={formatBRL(subtotal)} />
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Frete</span>
              {loadingShipping ? (
                <RefreshCw className="size-3 animate-spin text-gold" />
              ) : (
                <span className={shipping === 0 ? "text-gold font-semibold" : ""}>
                  {shipping === 0 ? "Grátis" : formatBRL(shipping)}
                </span>
              )}
            </div>
            {discount > 0 && <Row label="Desconto PIX" value={`- ${formatBRL(discount)}`} accent />}
            <div className="flex justify-between pt-3 border-t border-border">
              <span className="text-xs uppercase tracking-luxury">Total</span>
              <span className="text-2xl font-display font-bold text-gold">{formatBRL(total)}</span>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

function Row({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="flex justify-between">
      <span className="text-muted-foreground">{label}</span>
      <span className={accent ? "text-gold font-semibold" : ""}>{value}</span>
    </div>
  );
}

function Field({ label, className = "", ...props }: React.InputHTMLAttributes<HTMLInputElement> & { label: string }) {
  return (
    <div className={className}>
      <label className="text-[11px] uppercase tracking-luxury block mb-2">{label}</label>
      <input 
        {...props} 
        className="w-full bg-charcoal border border-border px-4 py-3 text-sm focus:border-gold focus:outline-none transition-colors" 
      />
    </div>
  );
}
