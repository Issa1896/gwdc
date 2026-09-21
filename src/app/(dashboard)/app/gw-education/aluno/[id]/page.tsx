import { notFound } from "next/navigation";
import { StudentView } from "@/components/education/student-view";
import { BackLink } from "@/components/education/widgets";
import { getStudent } from "@/data/education";

/** Perfil individual do estudante (linkado a partir dos portais). */
export default async function StudentProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const student = getStudent(id);

  if (!student) notFound();

  return (
    <div className="space-y-4">
      <BackLink href="/app/gw-education/professor" label="Voltar ao Portal do Professor" />
      <StudentView studentId={student.id} />
    </div>
  );
}