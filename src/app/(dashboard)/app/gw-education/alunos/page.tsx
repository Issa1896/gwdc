"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { GraduationCap, Pencil, Plus, Trash2, UserPlus } from "lucide-react";
import { PageHeader, EmptyState } from "@/components/dashboard/widgets";
import { Button } from "@/components/ui/button";
import { Input, Label, Select } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { BackLink, Pager, SearchInput, usePagination } from "@/components/education/widgets";
import { useEducation } from "@/lib/education-store";
import { CURSOS, STATUS_ALUNO_LABEL, type Estudante } from "@/data/education";

const REGIOES = ["Bissau", "Bafatá", "Gabú", "Cacheu", "Oio", "Quinara", "Tombali", "Bolama", "Biombo"];

interface AlunoForm {
  nome: string;
  sexo: "F" | "M";
  nascimento: string;
  regiao: string;
  telefone: string;
  email: string;
  cursoId: string;
  anoIngresso: number;
  status: Estudante["status"];
}

const FORM_VAZIO: AlunoForm = {
  nome: "",
  sexo: "M",
  nascimento: "2005-01-01",
  regiao: "Bissau",
  telefone: "+245 95 000 000",
  email: "",
  cursoId: "c1",
  anoIngresso: 2026,
  status: "ativo",
};

/** MÓDULO 6 — Cadastro e consulta de alunos (CRUD operacional). */
export default function AlunosPage() {
  const router = useRouter();
  const { state, getNotas, addAluno, updateAluno, deleteAluno } = useEducation();
  const alunos = state.alunos;

  const [busca, setBusca] = useState("");
  const [cursoFiltro, setCursoFiltro] = useState("todos");
  const [statusFiltro, setStatusFiltro] = useState("todos");
  const [modalOpen, setModalOpen] = useState(false);
  const [editando, setEditando] = useState<Estudante | null>(null);
  const [form, setForm] = useState<AlunoForm>(FORM_VAZIO);
  const [excluir, setExcluir] = useState<Estudante | null>(null);

  const filtrados = useMemo(
    () =>
      alunos.filter((a) => {
        const q = busca.toLowerCase();
        const matchQ = !q || a.nome.toLowerCase().includes(q) || a.id.toLowerCase().includes(q) || a.email.toLowerCase().includes(q);
        const matchCurso = cursoFiltro === "todos" || a.cursoId === cursoFiltro;
        const matchStatus = statusFiltro === "todos" || a.status === statusFiltro;
        return matchQ && matchCurso && matchStatus;
      }),
    [alunos, busca, cursoFiltro, statusFiltro],
  );

  const { page, setPage, totalPages, slice } = usePagination(filtrados.length, 8);
  const paginados = slice(filtrados);

  const abrirNovo = () => {
    setEditando(null);
    setForm(FORM_VAZIO);
    setModalOpen(true);
  };

  const abrirEdicao = (aluno: Estudante) => {
    setEditando(aluno);
    setForm({
      nome: aluno.nome,
      sexo: aluno.sexo,
      nascimento: aluno.nascimento,
      regiao: aluno.regiao,
      telefone: aluno.telefone,
      email: aluno.email,
      cursoId: aluno.cursoId,
      anoIngresso: aluno.anoIngresso,
      status: aluno.status,
    });
    setModalOpen(true);
  };

  const guardar = () => {
    if (!form.nome.trim()) return;
    const dados = {
      nome: form.nome.trim(),
      sexo: form.sexo,
      nascimento: form.nascimento,
      regiao: form.regiao,
      telefone: form.telefone,
      email: form.email || `${form.nome.toLowerCase().replace(/\s+/g, ".")}@educacao.gw`,
      cursoId: form.cursoId,
      anoIngresso: form.anoIngresso,
      status: form.status,
    };
    if (editando) {
      updateAluno(editando.id, dados);
    } else {
      addAluno(dados);
      setBusca("");
      setCursoFiltro("todos");
      setStatusFiltro("todos");
    }
    setModalOpen(false);
  };

  const confirmarExclusao = () => {
    if (!excluir) return;
    deleteAluno(excluir.id);
    setExcluir(null);
  };

  return (
    <div className="space-y-6">
      <BackLink />
      <PageHeader
        title="Alunos"
        description={`Cadastro nacional de estudantes — ${alunos.length} registos conectados ao registo civil via GW Identity.`}
        actions={
          <Button onClick={abrirNovo}>
            <Plus className="size-4" /> Novo aluno
          </Button>
        }
      />

      <div className="flex flex-wrap items-center gap-3">
        <div className="min-w-56 flex-1">
          <SearchInput value={busca} onChange={(v) => { setBusca(v); setPage(1); }} placeholder="Buscar por nome, n.º processo ou e-mail…" />
        </div>
        <Select aria-label="Filtrar por curso" value={cursoFiltro} onChange={(e) => { setCursoFiltro(e.target.value); setPage(1); }} className="w-52">
          <option value="todos">Todos os cursos</option>
          {CURSOS.map((c) => (
            <option key={c.id} value={c.id}>{c.nome}</option>
          ))}
        </Select>
        <Select aria-label="Filtrar por status" value={statusFiltro} onChange={(e) => { setStatusFiltro(e.target.value); setPage(1); }} className="w-40">
          <option value="todos">Todos os status</option>
          <option value="ativo">Ativo</option>
          <option value="concluinte">Concluinte</option>
          <option value="trancado">Trancado</option>
          <option value="suspenso">Suspenso</option>
        </Select>
      </div>

      <div className="rounded-xl border border-border bg-surface">
        {paginados.length === 0 ? (
          <EmptyState icon={GraduationCap} title="Nenhum aluno encontrado" description="Ajuste os filtros ou cadastre um novo aluno." />
        ) : (
          <>
            <Table>
              <TableHead>
                <TableRow>
                  <TableHeader>Processo</TableHeader>
                  <TableHeader>Nome</TableHeader>
                  <TableHeader>Curso</TableHeader>
                  <TableHeader>Região</TableHeader>
                  <TableHeader>Ingresso</TableHeader>
                  <TableHeader>Média</TableHeader>
                  <TableHeader>Status</TableHeader>
                  <TableHeader className="text-right">Ações</TableHeader>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginados.map((a) => {
                  const st = STATUS_ALUNO_LABEL[a.status];
                  const media = (() => {
                    const notas = getNotas(a.id, a.cursoId).filter((n) => n.media !== null);
                    if (!notas.length) return 0;
                    return Math.round((notas.reduce((acc, n) => acc + n.media!, 0) / notas.length) * 10) / 10;
                  })();
                  return (
                    <TableRow key={a.id} className="cursor-pointer" onClick={() => router.push(`/app/gw-education/alunos/${a.id}`)}>
                      <TableCell className="font-mono text-xs text-ink-muted">{a.id}</TableCell>
                      <TableCell className="font-medium text-ink">{a.nome}</TableCell>
                      <TableCell className="text-xs text-ink-muted">{CURSOS.find((c) => c.id === a.cursoId)?.nome ?? "—"}</TableCell>
                      <TableCell className="text-xs text-ink-muted">{a.regiao}</TableCell>
                      <TableCell className="tabular-nums text-xs">{a.anoIngresso}</TableCell>
                      <TableCell className="tabular-nums text-xs">{media.toFixed(1).replace(".", ",")}</TableCell>
                      <TableCell><Badge tone={st.tone}>{st.label}</Badge></TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1.5" onClick={(e) => e.stopPropagation()}>
                          <Button variant="outline" size="sm" aria-label={`Editar ${a.nome}`} onClick={() => abrirEdicao(a)}>
                            <Pencil className="size-3.5" /> Editar
                          </Button>
                          <Button variant="outline" size="sm" aria-label={`Excluir ${a.nome}`} className="text-danger hover:border-danger hover:text-danger" onClick={() => setExcluir(a)}>
                            <Trash2 className="size-3.5" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
            <div className="px-5 pb-4">
              <Pager page={page} totalPages={totalPages} onChange={setPage} />
            </div>
          </>
        )}
      </div>

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editando ? `Editar aluno — ${editando.id}` : "Novo aluno"}
        footer={
          <>
            <Button variant="ghost" onClick={() => setModalOpen(false)}>Cancelar</Button>
            <Button onClick={guardar}><UserPlus className="size-4" /> {editando ? "Guardar alterações" : "Cadastrar"}</Button>
          </>
        }
      >
        <div className="space-y-4">
          <div>
            <Label>Nome completo</Label>
            <Input value={form.nome} onChange={(e) => setForm({ ...form, nome: e.target.value })} placeholder="Ex.: Adelino Gomes Fernandes" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Sexo</Label>
              <Select value={form.sexo} onChange={(e) => setForm({ ...form, sexo: e.target.value as "F" | "M" })}>
                <option value="F">Feminino</option>
                <option value="M">Masculino</option>
              </Select>
            </div>
            <div>
              <Label>Data de nascimento</Label>
              <Input type="date" value={form.nascimento} onChange={(e) => setForm({ ...form, nascimento: e.target.value })} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Região</Label>
              <Select value={form.regiao} onChange={(e) => setForm({ ...form, regiao: e.target.value })}>
                {REGIOES.map((r) => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </Select>
            </div>
            <div>
              <Label>Curso</Label>
              <Select value={form.cursoId} onChange={(e) => setForm({ ...form, cursoId: e.target.value })}>
                {CURSOS.map((c) => (
                  <option key={c.id} value={c.id}>{c.nome}</option>
                ))}
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Telefone</Label>
              <Input value={form.telefone} onChange={(e) => setForm({ ...form, telefone: e.target.value })} placeholder="+245 95 xxx xxx" />
            </div>
            <div>
              <Label>Ano de ingresso</Label>
              <Input type="number" min={2015} max={2027} value={form.anoIngresso} onChange={(e) => setForm({ ...form, anoIngresso: Number(e.target.value) })} />
            </div>
          </div>
          <div>
            <Label>E-mail institucional</Label>
            <Input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="nome.apelido@educacao.gw" />
          </div>
          <div>
            <Label>Status</Label>
            <Select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as Estudante["status"] })}>
              <option value="ativo">Ativo</option>
              <option value="concluinte">Concluinte</option>
              <option value="trancado">Trancado</option>
              <option value="suspenso">Suspenso</option>
            </Select>
          </div>
          <p className="text-xs text-ink-faint">A identidade é validada contra o registo civil via GW Identity (eKYC).</p>
        </div>
      </Modal>

      <Modal
        open={Boolean(excluir)}
        onClose={() => setExcluir(null)}
        title="Excluir aluno"
        footer={
          <>
            <Button variant="ghost" onClick={() => setExcluir(null)}>Cancelar</Button>
            <Button variant="danger" onClick={confirmarExclusao}><Trash2 className="size-4" /> Excluir definitivamente</Button>
          </>
        }
      >
        <p className="text-sm text-ink-muted">
          Tem a certeza de que deseja excluir <strong className="text-ink">{excluir?.nome}</strong> ({excluir?.id})?
          As faturas e o histórico associados serão removidos do registo nacional.
        </p>
      </Modal>
    </div>
  );
}