"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  Cpu,
  FileCheck,
  Fingerprint,
  Plus,
  QrCode,
  ScanFace,
  Search,
  ShieldCheck,
  Sparkles,
  User,
  X,
} from "lucide-react";
import { useSecurity, type IdentidadeSoberana } from "@/lib/security-store";
import { Badge } from "@/components/ui/badge";

export default function IdentityDashboardPage() {
  const { state, emitirIdentidade } = useSecurity();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedIdentity, setSelectedIdentity] = useState<IdentidadeSoberana | null>(state.identidades[0] ?? null);
  const [isNovoOpen, setIsNovoOpen] = useState(false);
  const [notificacao, setNotificacao] = useState<string | null>(null);

  // Form State
  const [nomeCompleto, setNomeCompleto] = useState("");
  const [dataNascimento, setDataNascimento] = useState("1995-05-18");
  const [naturalidade, setNaturalidade] = useState("Bissau");
  const [genero, setGenero] = useState<"Masculino" | "Feminino">("Masculino");
  const [capturaBiometrica, setCapturaBiometrica] = useState(false);

  const showNotification = (msg: string) => {
    setNotificacao(msg);
    setTimeout(() => setNotificacao(null), 3500);
  };

  const filteredIdentidades = state.identidades.filter(
    (id) =>
      id.nomeCompleto.toLowerCase().includes(searchTerm.toLowerCase()) ||
      id.nin.toLowerCase().includes(searchTerm.toLowerCase()) ||
      id.naturalidade.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEmitir = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nomeCompleto) return;

    const nova = emitirIdentidade({
      nomeCompleto,
      dataNascimento,
      naturalidade,
      genero,
      biometriaCadastrada: true,
      servicosAutorizados: ["GW Government", "GW Citizen", "GW Health", "GW Bank"],
    });

    setSelectedIdentity(nova);
    setIsNovoOpen(false);
    setNomeCompleto("");
    setCapturaBiometrica(false);
    showNotification(`Identidade soberana ${nova.nin} emitida e gravada na cadeia ICP-Guiné!`);
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Toast Alert */}
      {notificacao && (
        <div className="fixed right-6 bottom-6 z-50 flex items-center gap-3 rounded-xl border border-violet-500/30 bg-violet-950/90 px-4 py-3 text-sm text-violet-200 shadow-2xl backdrop-blur-md animate-in fade-in slide-in-from-bottom-3">
          <CheckCircle2 className="size-5 shrink-0 text-violet-400" />
          <span>{notificacao}</span>
        </div>
      )}

      {/* Hero Banner */}
      <section className="relative overflow-hidden rounded-3xl border border-violet-500/20 bg-gradient-to-br from-violet-950/40 via-surface to-surface-ground p-6 sm:p-10 shadow-sm">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 h-72 w-72 rounded-full bg-violet-500/10 blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="flex flex-wrap items-center gap-2.5">
            <Badge tone="brand" className="gap-1.5 py-1 px-3 bg-violet-500/10 text-violet-700 dark:text-violet-300 border border-violet-500/30 font-semibold">
              <Fingerprint className="size-3.5" /> Identidade Soberana Nacional
            </Badge>
            <span className="text-xs text-ink-muted">Padrão ICAO 9303 / ISO 3166 • República da Guiné-Bissau</span>
          </div>

          <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl text-ink">
            Um Único Documento Digital para Todos os Serviços
          </h1>
          <p className="text-sm sm:text-base leading-relaxed text-ink-muted">
            Infraestrutura central de autenticação biométrica, emissão de credenciais verificáveis e assinatura eletrônica qualificada.
            Conecte cidadãos ao governo, bancos, saúde, educação e justiça com segurança de nível bancário.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              onClick={() => setIsNovoOpen(true)}
              className="inline-flex items-center gap-2 rounded-xl bg-violet-600 px-5 py-2.5 text-sm font-semibold text-white shadow hover:bg-violet-700 transition"
            >
              <Plus className="size-4" />
              <span>Emitir Nova Identidade Digital</span>
            </button>
            <Link
              href="/app/gw-identity/validar"
              className="inline-flex items-center gap-2 rounded-xl border border-border-subtle bg-surface px-5 py-2.5 text-sm font-semibold text-ink hover:border-violet-500 hover:text-violet-600 transition"
            >
              <FileCheck className="size-4 text-violet-500" />
              <span>Validador de Assinaturas (ICP-Guiné)</span>
            </Link>
          </div>
        </div>
      </section>

      {/* KPI Stats */}
      <section className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="rounded-2xl border border-border-subtle bg-surface p-4 shadow-sm">
          <div className="flex items-center gap-2 text-violet-600 dark:text-violet-400">
            <Fingerprint className="size-4" />
            <span className="text-xs font-medium uppercase tracking-wider text-ink-faint">Identidades Emitidas</span>
          </div>
          <p className="mt-2 text-2xl font-bold text-ink">78 mil</p>
          <p className="text-[11px] text-ink-muted">Cidadãos com cadastro biométrico</p>
        </div>

        <div className="rounded-2xl border border-border-subtle bg-surface p-4 shadow-sm">
          <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
            <Cpu className="size-4" />
            <span className="text-xs font-medium uppercase tracking-wider text-ink-faint">Serviços Integrados</span>
          </div>
          <p className="mt-2 text-2xl font-bold text-ink">23 Sistemas</p>
          <p className="text-[11px] text-ink-muted">SSO único interministerial</p>
        </div>

        <div className="rounded-2xl border border-border-subtle bg-surface p-4 shadow-sm">
          <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
            <ShieldCheck className="size-4" />
            <span className="text-xs font-medium uppercase tracking-wider text-ink-faint">Validação Biométrica</span>
          </div>
          <p className="mt-2 text-2xl font-bold text-ink">99.4%</p>
          <p className="text-[11px] text-ink-muted">Taxa de assertividade facial/digital</p>
        </div>

        <div className="rounded-2xl border border-border-subtle bg-surface p-4 shadow-sm">
          <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400">
            <Sparkles className="size-4" />
            <span className="text-xs font-medium uppercase tracking-wider text-ink-faint">Nível de Garantia</span>
          </div>
          <p className="mt-2 text-2xl font-bold text-ink">IAL3 / AAL3</p>
          <p className="text-[11px] text-ink-muted">Máxima conformidade eKYC</p>
        </div>
      </section>

      {/* Main Workspace: Search and List on Left, Digital Identity Card on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Identidades List */}
        <div className="lg:col-span-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-ink flex items-center gap-2">
              <User className="size-4 text-violet-600" />
              Base Nacional de Cidadãos Registrados
            </h2>
            <span className="text-xs text-ink-faint">{filteredIdentidades.length} registros</span>
          </div>

          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-ink-faint" />
            <input
              type="text"
              placeholder="Buscar por nome, NIN ou naturalidade..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-xl border border-border-subtle bg-surface py-2 pl-10 pr-4 text-xs text-ink placeholder-ink-faint focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500 shadow-sm"
            />
          </div>

          <div className="space-y-3">
            {filteredIdentidades.map((cidadao) => {
              const isSelected = selectedIdentity?.id === cidadao.id;
              return (
                <div
                  key={cidadao.id}
                  onClick={() => setSelectedIdentity(cidadao)}
                  className={`cursor-pointer rounded-2xl border p-4 transition-all ${
                    isSelected
                      ? "border-violet-500 bg-violet-500/5 dark:bg-violet-500/10 shadow-sm ring-1 ring-violet-500"
                      : "border-border-subtle bg-surface hover:border-violet-500/40"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-xs text-violet-600 dark:text-violet-400">
                      {cidadao.nin}
                    </span>
                    <Badge tone="success" className="text-[10px]">
                      Biometria Ativa
                    </Badge>
                  </div>

                  <h3 className="mt-1 text-sm font-bold text-ink">{cidadao.nomeCompleto}</h3>
                  <div className="mt-2 flex flex-wrap items-center justify-between text-xs text-ink-muted">
                    <span>Naturalidade: <strong className="text-ink">{cidadao.naturalidade}</strong></span>
                    <span>Nascimento: {cidadao.dataNascimento}</span>
                  </div>

                  <div className="mt-3 pt-2 border-t border-border-subtle/80 flex items-center justify-between text-[11px] text-ink-faint">
                    <span>Emitido em: {cidadao.emitidoEm}</span>
                    <span className="text-violet-600 dark:text-violet-400 font-semibold flex items-center gap-1">
                      Ver Cartão Digital <ArrowRight className="size-3" />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Interactive Digital Identity Card */}
        <div className="lg:col-span-6">
          {selectedIdentity ? (
            <div className="space-y-4">
              <h2 className="text-base font-bold text-ink flex items-center gap-2">
                <QrCode className="size-4 text-violet-600" />
                Cartão Nacional de Identidade Digital (Visualização Oficial)
              </h2>

              {/* Physical/Digital Card Mockup */}
              <div className="relative overflow-hidden rounded-3xl border border-violet-500/30 bg-gradient-to-br from-violet-900 via-indigo-950 to-slate-950 p-6 text-white shadow-2xl space-y-6">
                <div className="flex items-center justify-between border-b border-white/15 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-white/10 backdrop-blur-md">
                      <Fingerprint className="size-6 text-violet-300" />
                    </div>
                    <div>
                      <p className="text-[11px] font-bold tracking-widest text-violet-300 uppercase">
                        República da Guiné-Bissau
                      </p>
                      <p className="text-xs font-semibold text-white/90">Cartão de Identidade Nacional Digital</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="rounded-md border border-emerald-400/40 bg-emerald-500/20 px-2 py-0.5 text-[10px] font-mono font-bold text-emerald-300">
                      CHIP VIRTUAL ATIVO
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 items-center">
                  <div className="col-span-2 space-y-3">
                    <div>
                      <span className="text-[10px] uppercase tracking-wider text-white/50">Nome Completo</span>
                      <p className="text-base font-bold tracking-wide">{selectedIdentity.nomeCompleto}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <span className="text-[10px] uppercase tracking-wider text-white/50">NIN Soberano</span>
                        <p className="font-mono text-xs font-bold text-violet-300">{selectedIdentity.nin}</p>
                      </div>
                      <div>
                        <span className="text-[10px] uppercase tracking-wider text-white/50">Naturalidade</span>
                        <p className="text-xs font-semibold">{selectedIdentity.naturalidade}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <span className="text-[10px] uppercase tracking-wider text-white/50">Nascimento</span>
                        <p className="text-xs font-semibold">{selectedIdentity.dataNascimento}</p>
                      </div>
                      <div>
                        <span className="text-[10px] uppercase tracking-wider text-white/50">Gênero</span>
                        <p className="text-xs font-semibold">{selectedIdentity.genero}</p>
                      </div>
                    </div>
                  </div>

                  {/* QR Code and Biometric Stamp */}
                  <div className="flex flex-col items-center justify-center p-3 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md">
                    <QrCode className="size-20 text-white" />
                    <span className="mt-2 text-[9px] font-mono text-white/60 text-center">
                      ICP-GW:{selectedIdentity.nin}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-white/15 text-[10px] text-white/60 font-mono">
                  <span>AUTORIDADE EMISSORA: MINISTÉRIO DA JUSTIÇA</span>
                  <span>VALIDADE: INDETERMINADA</span>
                </div>
              </div>

              {/* Authorized Ecosystem Services */}
              <div className="rounded-2xl border border-border-subtle bg-surface p-5 shadow-sm space-y-3">
                <h3 className="text-xs font-bold text-ink uppercase tracking-wider">
                  Serviços Públicos e Financeiros Vinculados
                </h3>
                <div className="flex flex-wrap gap-2">
                  {selectedIdentity.servicosAutorizados.map((servico) => (
                    <Badge key={servico} tone="brand" className="text-xs bg-violet-500/10 text-violet-700 dark:text-violet-300">
                      {servico}
                    </Badge>
                  ))}
                </div>
                <p className="text-[11px] text-ink-muted pt-1">
                  O cidadão autorizou compartilhamento seletivo de atributos cadastrais sob o padrão de privacidade CEPD.
                </p>
              </div>
            </div>
          ) : (
            <div className="rounded-2xl border border-border-subtle bg-surface p-12 text-center text-xs text-ink-muted">
              Selecione uma identidade à esquerda para visualizar o cartão digital soberano.
            </div>
          )}
        </div>
      </div>

      {/* Modal: Emitir Nova Identidade */}
      {isNovoOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl border border-border-subtle bg-surface p-6 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-border-subtle pb-3">
              <h3 className="text-base font-bold text-ink flex items-center gap-2">
                <Fingerprint className="size-5 text-violet-600" />
                Emitir Nova Identidade Digital Soberana
              </h3>
              <button
                onClick={() => setIsNovoOpen(false)}
                className="rounded-lg p-1 text-ink-faint hover:bg-surface-raised hover:text-ink"
              >
                <X className="size-5" />
              </button>
            </div>

            <form onSubmit={handleEmitir} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-ink">Nome Completo do Cidadão</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Aliu Sanha de Barros"
                  value={nomeCompleto}
                  onChange={(e) => setNomeCompleto(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-border-subtle bg-surface-ground px-3.5 py-2 text-xs text-ink focus:border-violet-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-ink">Data de Nascimento</label>
                  <input
                    type="date"
                    required
                    value={dataNascimento}
                    onChange={(e) => setDataNascimento(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-border-subtle bg-surface-ground px-3.5 py-2 text-xs text-ink focus:border-violet-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-ink">Naturalidade / Região</label>
                  <select
                    value={naturalidade}
                    onChange={(e) => setNaturalidade(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-border-subtle bg-surface-ground px-3.5 py-2 text-xs text-ink focus:border-violet-500 focus:outline-none"
                  >
                    <option value="Bissau">Bissau (Capital)</option>
                    <option value="Bafatá">Bafatá</option>
                    <option value="Gabú">Gabú</option>
                    <option value="Bolama">Bolama (Bijagós)</option>
                    <option value="Bubaque">Bubaque (Bijagós)</option>
                    <option value="Cacheu">Cacheu</option>
                    <option value="Catió">Catió (Tombali)</option>
                    <option value="Farim">Farim (Oio)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-ink">Gênero</label>
                <div className="mt-1 flex gap-4 text-xs text-ink">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="genero"
                      checked={genero === "Masculino"}
                      onChange={() => setGenero("Masculino")}
                    />
                    Masculino
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="genero"
                      checked={genero === "Feminino"}
                      onChange={() => setGenero("Feminino")}
                    />
                    Feminino
                  </label>
                </div>
              </div>

              {/* Simulação de Coleta Biométrica */}
              <div className="rounded-xl border border-violet-500/30 bg-violet-500/5 p-4 space-y-3">
                <span className="text-xs font-bold text-violet-700 dark:text-violet-300 flex items-center gap-1.5">
                  <ScanFace className="size-4" /> Captura Biométrica Integrada
                </span>
                <p className="text-[11px] text-ink-muted">
                  Leitor de impressão digital e câmera facial conectados via protocolo WebAuthn/FIDO2.
                </p>
                <button
                  type="button"
                  onClick={() => setCapturaBiometrica(true)}
                  className={`w-full py-2 rounded-lg text-xs font-semibold transition ${
                    capturaBiometrica
                      ? "bg-emerald-600 text-white"
                      : "border border-border-subtle bg-surface hover:bg-surface-raised text-ink"
                  }`}
                >
                  {capturaBiometrica ? "✓ Biometria Capturada e Verificada" : "Capturar Impressão Digital & Face"}
                </button>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-border-subtle">
                <button
                  type="button"
                  onClick={() => setIsNovoOpen(false)}
                  className="rounded-xl border border-border-subtle px-4 py-2 text-xs font-medium text-ink hover:bg-surface-raised transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-violet-600 px-5 py-2 text-xs font-semibold text-white shadow hover:bg-violet-700 transition"
                >
                  Emitir e Assinar Digitalmente
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
