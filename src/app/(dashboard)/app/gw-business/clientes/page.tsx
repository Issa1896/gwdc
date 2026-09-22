"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Building2,
  CheckCircle2,
  FileText,
  Mail,
  Phone,
  Plus,
  Search,
  Users,
  X,
} from "lucide-react";
import { useSchoolBusiness, type ClienteEmpresarial } from "@/lib/school-business-store";
import { Badge } from "@/components/ui/badge";

export default function ClientesPage() {
  const { state, cadastrarCliente } = useSchoolBusiness();
  const [searchTerm, setSearchTerm] = useState("");
  const [isNovoOpen, setIsNovoOpen] = useState(false);
  const [propostaModalCliente, setPropostaModalCliente] = useState<ClienteEmpresarial | null>(null);
  const [valorProposta, setValorProposta] = useState(10000000);
  const [notificacao, setNotificacao] = useState<string | null>(null);

  // Form State
  const [nomeEmpresa, setNomeEmpresa] = useState("");
  const [nif, setNif] = useState("NIF-GW-");
  const [setor, setSetor] = useState<ClienteEmpresarial["setor"]>("Agronegócio (Caju)");
  const [cidade, setCidade] = useState("Bissau");
  const [contatoPrincipal, setContatoPrincipal] = useState("");
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("+245 ");
  const [volumeAnualFCFA, setVolumeAnualFCFA] = useState(100000000);

  const showNotification = (msg: string) => {
    setNotificacao(msg);
    setTimeout(() => setNotificacao(null), 3500);
  };

  const filteredClientes = state.clientes.filter(
    (c) =>
      c.nomeEmpresa.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.nif.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.contatoPrincipal.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.cidade.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCadastrar = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nomeEmpresa || !contatoPrincipal) return;

    const novo = cadastrarCliente({
      nomeEmpresa,
      nif: nif || `NIF-GW-${Math.floor(100000000 + Math.random() * 900000000)}`,
      setor,
      cidade,
      contatoPrincipal,
      email: email || "contato@empresa.gw",
      telefone: telefone || "+245 955 000 000",
      volumeAnualFCFA,
      status: "ativo",
    });

    setIsNovoOpen(false);
    setNomeEmpresa("");
    setContatoPrincipal("");
    showNotification(`Cliente "${novo.nomeEmpresa}" registrado com sucesso na carteira!`);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Toast Alert */}
      {notificacao && (
        <div className="fixed right-6 bottom-6 z-50 flex items-center gap-3 rounded-xl border border-purple-500/30 bg-purple-950/90 px-4 py-3 text-sm text-purple-200 shadow-2xl backdrop-blur-md animate-in fade-in slide-in-from-bottom-3">
          <CheckCircle2 className="size-5 shrink-0 text-purple-400" />
          <span>{notificacao}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-purple-600 dark:text-purple-400">
            <Link href="/app/gw-business" className="hover:underline flex items-center gap-1">
              <ArrowLeft className="size-3.5" /> Dashboard Comercial
            </Link>
          </div>
          <h1 className="mt-1 text-2xl font-extrabold text-ink flex items-center gap-2">
            <Users className="size-6 text-purple-600" />
            Carteira de Clientes Corporativos 360° & NIF
          </h1>
          <p className="text-xs text-ink-muted mt-1">
            Cadastro de empresas, dados fiscais auditados, contatos de decisão e geração de propostas com IGV 19%.
          </p>
        </div>

        <button
          onClick={() => setIsNovoOpen(true)}
          className="inline-flex items-center gap-2 rounded-xl bg-purple-600 px-4 py-2.5 text-xs font-semibold text-white shadow hover:bg-purple-700 transition"
        >
          <Plus className="size-4" /> Cadastrar Empresa Cliente
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-ink-faint" />
        <input
          type="text"
          placeholder="Buscar por razão social, NIF, cidade ou pessoa de contato..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full rounded-xl border border-border-subtle bg-surface py-2 pl-10 pr-4 text-xs text-ink placeholder-ink-faint focus:border-purple-500 focus:outline-none"
        />
      </div>

      {/* Clients Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {filteredClientes.map((cliente) => (
          <div
            key={cliente.id}
            className="rounded-2xl border border-border-subtle bg-surface p-5 shadow-sm space-y-4 hover:border-purple-500/40 transition flex flex-col justify-between"
          >
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <Badge tone="neutral" className="text-[10px]">{cliente.cidade}</Badge>
                <span className="font-mono text-xs font-bold text-purple-600 dark:text-purple-400">
                  {cliente.nif}
                </span>
              </div>

              <div>
                <h3 className="text-sm font-bold text-ink">{cliente.nomeEmpresa}</h3>
                <p className="text-xs text-ink-muted mt-0.5">{cliente.setor}</p>
              </div>

              <div className="rounded-xl border border-border-subtle bg-surface-ground p-3 text-xs space-y-1.5 text-ink-muted">
                <p className="text-ink font-semibold flex items-center gap-1.5">
                  <Users className="size-3.5 text-purple-500" />
                  {cliente.contatoPrincipal}
                </p>
                <p className="flex items-center gap-1.5 text-[11px]">
                  <Mail className="size-3 text-ink-faint" />
                  {cliente.email}
                </p>
                <p className="flex items-center gap-1.5 text-[11px]">
                  <Phone className="size-3 text-ink-faint" />
                  {cliente.telefone}
                </p>
              </div>
            </div>

            <div className="pt-3 border-t border-border-subtle flex items-center justify-between">
              <div>
                <span className="text-[10px] text-ink-faint uppercase font-semibold">Volume Estimado</span>
                <p className="font-mono text-xs font-bold text-ink">
                  {(cliente.volumeAnualFCFA / 1000000).toFixed(0)}M FCFA/ano
                </p>
              </div>

              <button
                onClick={() => setPropostaModalCliente(cliente)}
                className="inline-flex items-center gap-1 rounded-xl bg-purple-600/10 px-3 py-1.5 text-xs font-semibold text-purple-700 dark:text-purple-300 hover:bg-purple-600/20 transition"
              >
                <FileText className="size-3.5" /> Gerar Proposta
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal: Gerar Proposta Comercial com IGV */}
      {propostaModalCliente && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-border-subtle bg-surface p-6 shadow-2xl animate-in zoom-in-95 space-y-4">
            <div className="flex items-center justify-between border-b border-border-subtle pb-3">
              <h3 className="text-base font-bold text-ink flex items-center gap-2">
                <FileText className="size-5 text-purple-600" />
                Proposta Comercial (IGV 19%)
              </h3>
              <button
                onClick={() => setPropostaModalCliente(null)}
                className="rounded-lg p-1 text-ink-faint hover:bg-surface-raised hover:text-ink"
              >
                <X className="size-5" />
              </button>
            </div>

            <div className="space-y-2 text-xs">
              <p>Cliente: <strong className="text-ink">{propostaModalCliente.nomeEmpresa}</strong></p>
              <p>NIF: <strong className="text-ink font-mono">{propostaModalCliente.nif}</strong></p>
              <p>Destinatário: <strong className="text-ink">{propostaModalCliente.contatoPrincipal}</strong></p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-ink">Valor Base do Serviço (FCFA)</label>
              <input
                type="number"
                min={100000}
                step={50000}
                value={valorProposta}
                onChange={(e) => setValorProposta(Number(e.target.value))}
                className="mt-1 w-full rounded-xl border border-border-subtle bg-surface-ground px-3.5 py-2 text-xs font-mono text-ink focus:border-purple-500 focus:outline-none"
              />
            </div>

            <div className="rounded-xl border border-border-subtle bg-surface-ground p-3 text-xs space-y-1 font-mono">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>{valorProposta.toLocaleString("pt-GW")} FCFA</span>
              </div>
              <div className="flex justify-between text-ink-muted">
                <span>IGV (19% Regulamentar):</span>
                <span>{(valorProposta * 0.19).toLocaleString("pt-GW")} FCFA</span>
              </div>
              <div className="flex justify-between font-bold text-purple-600 dark:text-purple-400 border-t border-border-subtle pt-1">
                <span>Total da Proposta:</span>
                <span>{(valorProposta * 1.19).toLocaleString("pt-GW")} FCFA</span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-border-subtle">
              <button
                type="button"
                onClick={() => setPropostaModalCliente(null)}
                className="rounded-xl border border-border-subtle px-4 py-2 text-xs font-medium text-ink hover:bg-surface-raised transition"
              >
                Fechar
              </button>
              <button
                type="button"
                onClick={() => {
                  showNotification(`Proposta emitida e enviada para ${propostaModalCliente.email}!`);
                  setPropostaModalCliente(null);
                }}
                className="rounded-xl bg-purple-600 px-5 py-2 text-xs font-semibold text-white shadow hover:bg-purple-700 transition"
              >
                Emitir Proposta Oficial
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Cadastrar Novo Cliente */}
      {isNovoOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl border border-border-subtle bg-surface p-6 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-border-subtle pb-3">
              <h3 className="text-base font-bold text-ink flex items-center gap-2">
                <Building2 className="size-5 text-purple-600" />
                Cadastrar Empresa na Carteira
              </h3>
              <button
                onClick={() => setIsNovoOpen(false)}
                className="rounded-lg p-1 text-ink-faint hover:bg-surface-raised hover:text-ink"
              >
                <X className="size-5" />
              </button>
            </div>

            <form onSubmit={handleCadastrar} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-ink">Razão Social / Nome da Empresa</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: CajuBissau Exportações S.A."
                  value={nomeEmpresa}
                  onChange={(e) => setNomeEmpresa(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-border-subtle bg-surface-ground px-3.5 py-2 text-xs text-ink focus:border-purple-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-ink">NIF da Empresa</label>
                  <input
                    type="text"
                    required
                    placeholder="NIF-GW-500XXXXXX"
                    value={nif}
                    onChange={(e) => setNif(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-border-subtle bg-surface-ground px-3.5 py-2 text-xs font-mono text-ink focus:border-purple-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-ink">Setor Econômico</label>
                  <select
                    value={setor}
                    onChange={(e) => setSetor(e.target.value as ClienteEmpresarial["setor"])}
                    className="mt-1 w-full rounded-xl border border-border-subtle bg-surface-ground px-3.5 py-2 text-xs text-ink focus:border-purple-500 focus:outline-none"
                  >
                    <option value="Agronegócio (Caju)">Agronegócio (Caju)</option>
                    <option value="Comércio e Distribuição">Comércio e Distribuição</option>
                    <option value="Construção & Obras">Construção & Obras</option>
                    <option value="Tecnologia & Telecom">Tecnologia & Telecom</option>
                    <option value="Serviços">Serviços</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-ink">Cidade / Região</label>
                  <input
                    type="text"
                    required
                    value={cidade}
                    onChange={(e) => setCidade(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-border-subtle bg-surface-ground px-3.5 py-2 text-xs text-ink focus:border-purple-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-ink">Contato Principal</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Aladje Braima"
                    value={contatoPrincipal}
                    onChange={(e) => setContatoPrincipal(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-border-subtle bg-surface-ground px-3.5 py-2 text-xs text-ink focus:border-purple-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-ink">E-mail</label>
                  <input
                    type="email"
                    placeholder="contato@empresa.gw"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-border-subtle bg-surface-ground px-3.5 py-2 text-xs text-ink focus:border-purple-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-ink">Telefone</label>
                  <input
                    type="text"
                    placeholder="+245 955 000 000"
                    value={telefone}
                    onChange={(e) => setTelefone(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-border-subtle bg-surface-ground px-3.5 py-2 text-xs text-ink focus:border-purple-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-ink">Volume Anual Estimado (FCFA)</label>
                <input
                  type="number"
                  min={1000000}
                  step={5000000}
                  value={volumeAnualFCFA}
                  onChange={(e) => setVolumeAnualFCFA(Number(e.target.value))}
                  className="mt-1 w-full rounded-xl border border-border-subtle bg-surface-ground px-3.5 py-2 text-xs font-mono text-ink focus:border-purple-500 focus:outline-none"
                />
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
                  className="rounded-xl bg-purple-600 px-5 py-2 text-xs font-semibold text-white shadow hover:bg-purple-700 transition"
                >
                  Cadastrar Cliente
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
