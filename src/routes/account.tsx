import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/account")({
  head: () => ({ meta: [{ title: "Minha Conta — CH.Style" }] }),
  component: AccountPage,
});

function AccountPage() {
  const [mode, setMode] = useState<"login" | "register">("login");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success(mode === "login" ? "Bem-vindo de volta!" : "Conta criada com sucesso!");
  };

  return (
    <div className="container-ch py-16 md:py-24 max-w-md">
      <p className="text-[11px] uppercase tracking-luxury text-gold mb-2 text-center">Minha conta</p>
      <h1 className="font-display text-3xl md:text-4xl font-bold text-center mb-8">
        {mode === "login" ? "Acesse sua conta" : "Criar conta"}
      </h1>

      <div className="flex border border-border mb-8">
        <button onClick={() => setMode("login")} className={`flex-1 py-3 text-xs uppercase tracking-luxury transition-colors ${mode === "login" ? "bg-gold text-primary-foreground" : "hover:text-gold"}`}>Entrar</button>
        <button onClick={() => setMode("register")} className={`flex-1 py-3 text-xs uppercase tracking-luxury transition-colors ${mode === "register" ? "bg-gold text-primary-foreground" : "hover:text-gold"}`}>Cadastrar</button>
      </div>

      <form onSubmit={submit} className="space-y-4">
        {mode === "register" && (
          <input required placeholder="Nome completo" className="w-full bg-charcoal border border-border px-4 py-3 text-sm focus:border-gold focus:outline-none" />
        )}
        <input required type="email" placeholder="E-mail" className="w-full bg-charcoal border border-border px-4 py-3 text-sm focus:border-gold focus:outline-none" />
        <input required type="password" placeholder="Senha" className="w-full bg-charcoal border border-border px-4 py-3 text-sm focus:border-gold focus:outline-none" />
        {mode === "login" && (
          <div className="text-right">
            <a href="#" className="text-xs text-gold hover:underline">Esqueci minha senha</a>
          </div>
        )}
        <button className="w-full bg-gradient-gold text-primary-foreground py-4 text-xs uppercase tracking-luxury font-semibold hover:shadow-gold transition-shadow">
          {mode === "login" ? "Entrar" : "Criar conta"}
        </button>
      </form>

      <p className="text-xs text-muted-foreground text-center mt-8">
        Ao continuar, você concorda com nossos <Link to="/help/$topic" params={{ topic: "termos" }} className="text-gold hover:underline">termos</Link>.
      </p>
    </div>
  );
}
