"use client";

import { useState } from "react";
import { StudentView } from "@/components/education/student-view";
import { BackLink } from "@/components/education/widgets";
import { Select } from "@/components/ui/input";
import { STUDENTS } from "@/data/education";

/** Portal do Aluno — com seletor de estudante (demonstração multiusuário). */
export default function AlunoPortalPage() {
  const [studentId, setStudentId] = useState(STUDENTS[0].id);

  return (
    <div className="space-y-4">
      <BackLink />
      <div className="flex flex-wrap items-end justify-between gap-3">
        <p className="text-xs text-ink-faint">
          Alternar entre estudantes para simular o acesso de cada perfil ao portal.
        </p>
        <Select
          aria-label="Selecionar estudante"
          value={studentId}
          onChange={(e) => setStudentId(e.target.value)}
          className="w-full max-w-sm"
        >
          {STUDENTS.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name} — {s.course}
            </option>
          ))}
        </Select>
      </div>
      <StudentView studentId={studentId} />
    </div>
  );
}