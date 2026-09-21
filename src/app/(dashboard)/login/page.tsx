"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Fingerprint, Lock, Mail, ShieldCheck, Zap } from "lucide-react";
import { Logo } from "@/components/ui/logo";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import { Alert } from "@/components/ui/alert";
import { DEMO_CREDENTIALS, signIn } from "@/lib/mvp/auth";

/** Tela de login dos MVPs (sessão simulada em localStorage). */
export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    window.setTimeout(() => {
      try {
        signIn(email, password);
        const next = searchParams.get("next");
        router.push(next ?? "/app/gw-citizen");
      } catch {
        setError("Credenciais inválidas. Use as credenciais de demonstração abaixo.");
        setLoading(false);
      }
    }, 600);
  };

  const fillDemo = () => {
    setEmail(DEMO_CREDENTIALS.email);
    setPassword(DEMO_CREDENTIALS.password);
  };

  return (
    <main className="grid min-h-screen lg:grid-cols-2">
      {/* Painel institucional */}
      <section className="relative hidden overflow-hidden bg-gradient-to-br from-navy-950 via-navy-900 to-brand-900 p-12 text-white lg:flex lg:flex-col lg:justify-between">
        <Link href="/" aria-label="GW Digital Company — Início">
          <Logo className="[&_span:last-child]:text-white" />
        </Link>
        <div>
          <p className="text-xs font-bold tracking-[0.25em] text-brand-300 uppercase">Ambiente de demonstração</p>
          <h1 className="mt-4 max-w-md font-display text-4xl leading-tight font-bold">
            Explore o futuro digital da Guiné-Bissau
          </h1>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-navy-100">
            Acesse os MVPs navegáveis dos 18 produtos GWDC com dados fictícios realistas. Login, dashboards,
            gráficos, IA e muito mais — em um único lugar.
          </p>
          <ul className="mt-8 space-y-3">
            {[
              { icon: ShieldCheck, text: "Autenticação simulada com biometria (eKYC)" },
              { icon: Zap, text: "Dashboards em tempo real com tema claro/escuro" },
              { icon: Fingerprint, text: "Assistente de IA integrado em todos os produtos" },
            ].map(({ icon: Icon, text }) => (
              <li key={text} className="flex items-center gap-3 text-sm text-navy-100">
                <Icon className="size-4.5 text-brand-300" aria-hidden="true" /> {text}
              </li>
            ))}
          </ul>
        </div>
        <p className="text-xs text-navy-300">© 2026 GW Digital Company · Bissau, Guiné-Bissau</p>
      </section>

      {/* Formulário */}
      <section className="flex items-center justify-center bg-surface p-6">
        <div className="w-full max-w-md">
          <div className="mb-8 lg:hidden">
            <Link href="/" aria-label="GW Digital Company">
              <Logo />
            </Link>
          </div>
          <h2 className="font-display text-2xl font-bold text-ink">Entrar na demonstração</h2>
          <p className="mt-1.5 text-sm text-ink-muted">
            Use as credenciais de demonstração ou crie uma sessão local qualquer (e-mail válido + senha de 6+ caracteres).
          </p>

          {error && <Alert tone="danger" title="Falha na autenticação" className="mt-5">{error}</Alert>}

          <form onSubmit={handleSubmit} className="mt-6 space-y-5" aria-label="Formulário de login">
            <div>
              <Label>E-mail</Label>
              <div className="relative">
                <Mail className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-ink-faint" aria-hidden="true" />
                <Input
                  type="email"
                  required
                  autoComplete="username"
                  placeholder="demo@gwdc.gw"
                  className="pl-9"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>
            <div>
              <Label>Senha</Label>
              <div className="relative">
                <Lock className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-ink-faint" aria-hidden="true" />
                <Input
                  type="password"
                  required
                  autoComplete="current-password"
                  placeholder="••••••••"
                  className="pl-9"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>
            <div className="rounded-xl border border-border bg-surface-alt p-4 text-xs text-ink-muted">
              Credenciais de demonstração:{" "}
              <code className="font-mono font-semibold text-ink">{DEMO_CREDENTIALS.email}</code> ·{" "}
              <code className="font-mono font-semibold text-ink">{DEMO_CREDENTIALS.password}</code>
              <button type="button" onClick={fillDemo} className="mt-2 block cursor-pointer font-semibold text-brand-600 hover:underline dark:text-brand-300">
                Preencher automaticamente
              </button>
            </div>
            <Button type="submit" size="lg" loading={loading} className="w-full">
              Entrar na demonstração
            </Button>
          </form>
          <p className="mt-6 text-center text-xs text-ink-faint">
            <Link href="/" className="font-medium text-brand-600 hover:underline dark:text-brand-300">
              ← Voltar ao site institucional
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
}
