"use client";

import { useMemo, useState } from "react";
import { BookMarked, BookUp, FileCheck2, Library, MonitorSmartphone, Search } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input, Label, Select } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PageHeader, KpiCard, EmptyState } from "@/components/dashboard/widgets";
import { BackLink } from "@/components/education/widgets";
import { LIBRARY, LIBRARY_CATEGORIES } from "@/data/education";
import { useEducation } from "@/lib/education-store";

const hoje = () => new Date().toISOString().slice(0, 10);

/** Biblioteca digital nacional — catálogo com reserva e empréstimos operacionais. */
export default function BibliotecaPage() {
  const { state, reservarLivro, devolverLivro } = useEducation();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("Todas");
  const [reserva, setReserva] = useState<string | null>(null);
  const [leitor, setLeitor] = useState(state.alunos[0]?.nome ?? "");
  const [aviso, setAviso] = useState("");

  const filtered = useMemo(
    () =>
      LIBRARY.filter((item) => {
        const matchesQuery = `${item.title} ${item.author}`.toLowerCase().includes(query.toLowerCase());
        const matchesCategory = category === "Todas" || item.category === category;
        return matchesQuery && matchesCategory;
      }),
    [query, category],
  );

  const emprestimosAtivos = (livroId: string) => state.emprestimos.filter((l) => l.livroId === livroId).length;

  const disponivel = (itemId: string, seedAvailable: number, copies: number) =>
    Math.min(copies, Math.max(0, seedAvailable - emprestimosAtivos(itemId)));

  const confirmarReserva = () => {
    if (!reserva || !leitor.trim()) return;
    const livro = LIBRARY.find((i) => i.id === reserva);
    if (!livro) return;
    reservarLivro(livro.id, livro.title, leitor.trim());
    setReserva(null);
    setAviso(`Reserva registada: "${livro.title}" para ${leitor.trim()}. Devolução em 14 dias.`);
    window.setTimeout(() => setAviso(""), 4000);
  };

  const devolver = (id: string) => {
    devolverLivro(id);
    setAviso("Devolução registada. O exemplar voltou ao acervo disponível.");
    window.setTimeout(() => setAviso(""), 4000);
  };

  const totalCopies = LIBRARY.reduce((acc, i) => acc + i.copies, 0);
  const totalAvailable = LIBRARY.reduce((acc, i) => acc + disponivel(i.id, i.available, i.copies), 0);
  const overdue = state.emprestimos.filter((l) => l.devolucao < hoje()).length;
  const digital = LIBRARY.filter((i) => i.digital).length;

  return (
    <div className="space-y-6">
      <BackLink />
      <PageHeader
        title="Biblioteca Digital Nacional"
        description="Acervo físico e digital das instituições de ensino — consulta, reserva e empréstimo em um só lugar."
        actions={
          <Badge tone="brand" className="self-start">
            {LIBRARY_CATEGORIES.length} áreas do conhecimento
          </Badge>
        }
      />

      {aviso && <Alert tone="success" title="Acervo atualizado">{aviso}</Alert>}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard title="Títulos no acervo" value={String(LIBRARY.length)} delta={4.0} icon={Library} tone="brand" spark={[6, 8, 9, 10, 10, 11, 12, 12]} />
        <KpiCard title="Exemplares" value={String(totalCopies)} delta={3.1} icon={BookMarked} tone="navy" spark={[78, 84, 90, 96, 100, 104, 108, totalCopies]} />
        <KpiCard title="Disponíveis agora" value={String(totalAvailable)} delta={6.4} icon={FileCheck2} tone="gold" spark={[52, 58, 62, 66, 68, 70, 72, totalAvailable]} />
        <KpiCard title="Títulos digitais" value={String(digital)} delta={9.7} icon={MonitorSmartphone} tone="brand" spark={[5, 6, 7, 7, 8, 8, 9, digital]} />
      </div>

      {/* Busca e filtro */}
      <Card>
        <CardContent className="flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-ink-faint" aria-hidden="true" />
            <Input
              aria-label="Buscar no acervo"
              placeholder="Buscar por título ou autor…"
              className="pl-9"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <Select aria-label="Categoria" value={category} onChange={(e) => setCategory(e.target.value)} className="sm:w-64">
            <option>Todas</option>
            {LIBRARY_CATEGORIES.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </Select>
        </CardContent>
      </Card>

      {/* Catálogo */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Catálogo — {filtered.length} resultado(s)</CardTitle>
        </CardHeader>
        <CardContent className="p-0 pb-2">
          {filtered.length === 0 ? (
            <EmptyState title="Nenhum título encontrado" description="Ajuste a busca ou o filtro de categoria." icon={Search} />
          ) : (
            <Table>
              <TableHead>
                <TableRow>
                  <TableHeader>Título</TableHeader>
                  <TableHeader>Autor</TableHeader>
                  <TableHeader>Categoria</TableHeader>
                  <TableHeader>Ano</TableHeader>
                  <TableHeader>Disponibilidade</TableHeader>
                  <TableHeader>Formato</TableHeader>
                  <TableHeader className="text-right">Ações</TableHeader>
                </TableRow>
              </TableHead>
              <TableBody>
                {filtered.map((item) => {
                  const disp = disponivel(item.id, item.available, item.copies);
                  const pct = Math.round((disp / item.copies) * 100);
                  return (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium text-ink">{item.title}</TableCell>
                      <TableCell className="text-xs text-ink-muted">{item.author}</TableCell>
                      <TableCell>
                        <Badge tone="navy">{item.category}</Badge>
                      </TableCell>
                      <TableCell className="tabular-nums">{item.year}</TableCell>
                      <TableCell className="min-w-40">
                        <div className="flex items-center gap-2">
                          <Progress value={pct} tone={pct === 0 ? "danger" : pct < 40 ? "gold" : "success"} className="w-24" ariaLabel={`${pct}% disponível`} />
                          <span className="tabular-nums text-xs text-ink-muted">
                            {disp}/{item.copies}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {item.digital ? <Badge tone="success">Digital</Badge> : <Badge tone="neutral">Físico</Badge>}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button size="sm" variant={disp === 0 ? "outline" : "secondary"} disabled={disp === 0} onClick={() => { setReserva(item.id); setLeitor(state.alunos[0]?.nome ?? ""); }}>
                          <BookUp className="size-3.5" /> {disp === 0 ? "Esgotado" : "Reservar"}
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Empréstimos ativos */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Empréstimos ativos ({state.emprestimos.length})</CardTitle>
        </CardHeader>
        <CardContent className="p-0 pb-2">
          {state.emprestimos.length === 0 ? (
            <EmptyState icon={BookMarked} title="Sem empréstimos ativos" description="As reservas efetuadas aparecerão aqui." />
          ) : (
            <Table>
              <TableHead>
                <TableRow>
                  <TableHeader>Obra</TableHeader>
                  <TableHeader>Leitor(a)</TableHeader>
                  <TableHeader>Emprestado em</TableHeader>
                  <TableHeader>Devolução</TableHeader>
                  <TableHeader>Status</TableHeader>
                  <TableHeader className="text-right">Ações</TableHeader>
                </TableRow>
              </TableHead>
              <TableBody>
                {state.emprestimos.map((l) => {
                  const atrasado = l.devolucao < hoje();
                  return (
                    <TableRow key={l.id}>
                      <TableCell className="font-medium text-ink">{l.titulo}</TableCell>
                      <TableCell className="text-xs text-ink-muted">{l.leitor}</TableCell>
                      <TableCell className="text-xs text-ink-muted">{l.inicio}</TableCell>
                      <TableCell className="text-xs text-ink-muted">{l.devolucao}</TableCell>
                      <TableCell>
                        <Badge tone={atrasado ? "danger" : "success"}>{atrasado ? "Atrasado" : "Em dia"}</Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button size="sm" variant="outline" onClick={() => devolver(l.id)}>
                          <BookUp className="size-3.5" /> Registar devolução
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
          <div className="px-4 py-3">
            <AlertSummary overdue={overdue} total={state.emprestimos.length} />
          </div>
        </CardContent>
      </Card>

      {/* Reserva */}
      <Modal
        open={Boolean(reserva)}
        onClose={() => setReserva(null)}
        title="Reservar exemplar"
        footer={
          <>
            <Button variant="ghost" onClick={() => setReserva(null)}>Cancelar</Button>
            <Button onClick={confirmarReserva}><BookUp className="size-4" /> Confirmar reserva</Button>
          </>
        }
      >
        <div className="space-y-4">
          <p className="text-sm text-ink-muted">
            Obra: <strong className="text-ink">{LIBRARY.find((i) => i.id === reserva)?.title}</strong>
          </p>
          <div>
            <Label>Leitor(a)</Label>
            {state.alunos.length > 0 ? (
              <Select value={leitor} onChange={(e) => setLeitor(e.target.value)}>
                {state.alunos.map((a) => (
                  <option key={a.id} value={a.nome}>{a.nome} — {a.id}</option>
                ))}
              </Select>
            ) : (
              <Input value={leitor} onChange={(e) => setLeitor(e.target.value)} placeholder="Nome do leitor" />
            )}
          </div>
          <p className="text-xs text-ink-faint">Prazo de empréstimo: 14 dias. Lembrete automático por SMS antes da devolução.</p>
        </div>
      </Modal>
    </div>
  );
}

function AlertSummary({ overdue, total }: { overdue: number; total: number }) {
  return (
    <Alert tone={overdue > 0 ? "warning" : "success"} title={`${overdue} de ${total} empréstimos em atraso`}>
      Lembretes automáticos enviados por SMS aos leitores em atraso.
    </Alert>
  );
}