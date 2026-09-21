import Link from "next/link";
import { BookOpen, MessageSquareText, PenLine, PlayCircle, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PageHeader, KpiCard } from "@/components/dashboard/widgets";
import { BackLink } from "@/components/education/widgets";
import { DISCIPLINES, AVA, getProfessor } from "@/data/education";
import { cn } from "@/lib/utils";

const typeIcon = { Aula: BookOpen, PDF: BookOpen, Vídeo: PlayCircle, Exercício: PenLine, Laboratório: PenLine };

/** AVA — Ambiente Virtual de Aprendizagem (LMS nacional). */
export default function AvaPage() {
  const totalMaterials = AVA.reduce((acc, a) => acc + a.materials.length, 0);
  const totalTopics = AVA.reduce((acc, a) => acc + a.forum.length, 0);

  return (
    <div className="space-y-6">
      <BackLink />
      <PageHeader
        title="Ambiente Virtual de Aprendizagem"
        description="Conteúdos, fóruns e atividades por disciplina — aulas presenciais e a distância no mesmo lugar."
        actions={
          <Badge tone="brand" className="self-start">
            Plataforma nacional
          </Badge>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard title="Disciplinas ativas" value={String(DISCIPLINES.length)} delta={1.2} icon={BookOpen} tone="brand" spark={[4, 4, 5, 5, 5, 6, 6, 6]} />
        <KpiCard title="Materiais publicados" value={String(totalMaterials)} delta={8.9} icon={PenLine} tone="navy" spark={[12, 14, 15, 17, 18, 19, 20, totalMaterials]} />
        <KpiCard title="Tópicos de fórum" value={String(totalTopics)} delta={4.1} icon={MessageSquareText} tone="gold" spark={[4, 5, 5, 6, 6, 6, 7, totalTopics]} />
        <KpiCard title="Acessos esta semana" value="6.214" delta={11.6} icon={Users} tone="brand" spark={[3800, 4200, 4600, 5100, 5400, 5800, 6000, 6214]} />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {DISCIPLINES.map((d) => {
          const ava = AVA.find((a) => a.disciplineId === d.id)!;
          const professor = getProfessor(d.professorId);
          const occupation = Math.round((d.enrolled / d.vacancies) * 100);
          return (
            <Link key={d.id} href={`/app/gw-education/ava/${d.id}`} className="group">
              <Card className="h-full transition-all group-hover:border-brand-400 group-hover:shadow-md">
                <CardHeader>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-mono text-xs text-ink-faint">{d.code}</p>
                      <CardTitle className="mt-0.5">{d.name}</CardTitle>
                    </div>
                    <Badge tone={occupation >= 95 ? "danger" : occupation >= 85 ? "warning" : "success"}>{occupation}%</Badge>
                  </div>
                  <p className="line-clamp-2 text-xs text-ink-muted">{d.description}</p>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-xs text-ink-muted">
                    Docente: <span className="font-medium text-ink">{professor?.name}</span>
                  </p>
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="rounded-lg bg-surface-alt py-2">
                      <p className="font-display text-sm font-bold text-ink">{ava.materials.length}</p>
                      <p className="text-[10px] text-ink-faint">Materiais</p>
                    </div>
                    <div className="rounded-lg bg-surface-alt py-2">
                      <p className="font-display text-sm font-bold text-ink">{ava.forum.length}</p>
                      <p className="text-[10px] text-ink-faint">Tópicos</p>
                    </div>
                    <div className="rounded-lg bg-surface-alt py-2">
                      <p className="font-display text-sm font-bold text-ink">{ava.activities.length}</p>
                      <p className="text-[10px] text-ink-faint">Atividades</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    {ava.materials.slice(0, 4).map((m) => {
                      const Icon = typeIcon[m.type];
                      return (
                        <span key={m.id} className={cn("grid size-8 place-items-center rounded-lg text-white", m.type === "Aula" && "bg-brand-500", m.type === "PDF" && "bg-navy-600", m.type === "Vídeo" && "bg-rose-500", m.type === "Exercício" && "bg-gold-500", m.type === "Laboratório" && "bg-sky-500")}>
                          <Icon className="size-4" aria-hidden="true" />
                        </span>
                      );
                    })}
                    <span className="ml-auto text-xs font-medium text-brand-600 group-hover:underline">Abrir AVA →</span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}