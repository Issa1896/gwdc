import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Iniciando seed do banco de dados soberano da Guiné-Bissau...");

  // 1. Usuário Administrador
  const admin = await prisma.user.upsert({
    where: { email: "admin@gwdc.gw" },
    update: {},
    create: {
      email: "admin@gwdc.gw",
      name: "Administrador Central (GWDC)",
      passwordHash: "$2b$10$ep/demo_hash_soberano_gwdc_2026",
      role: "ADMIN",
      organ: "Presidência da República",
    },
  });

  // 2. Cidadão Soberano
  const cidadao = await prisma.citizen.upsert({
    where: { nin: "GW-2026-0001" },
    update: {},
    create: {
      nin: "GW-2026-0001",
      fullName: "Baciro Embaló da Silva",
      birthDate: new Date("1988-04-14"),
      birthplace: "Bissau",
      gender: "Masculino",
      biometricEnrolled: true,
    },
  });

  // 3. Dataset Aberto (OGE 2026)
  const dataset = await prisma.openDataset.upsert({
    where: { slug: "orcamento-geral-estado-2026" },
    update: {},
    create: {
      slug: "orcamento-geral-estado-2026",
      title: "Orçamento Geral do Estado (OGE) — Execução Orçamentária 2026",
      organ: "Ministério da Economia e Finanças",
      category: "Economia",
      formats: ["CSV", "JSON", "API"],
    },
  });

  // 4. Alerta Meteorológico (GW Climate)
  const alerta = await prisma.climateAlert.upsert({
    where: { code: "ALT-2026-001" },
    update: {},
    create: {
      code: "ALT-2026-001",
      title: "Alerta de Monção e Chuvas Torrenciais no Litoral",
      severity: "alta",
      region: "Região de Tombali e Quinara",
      messagePt: "Precipitação acumulada superior a 90mm nas próximas 24 horas.",
      messageCrioulo: "Tsuva pisadu ku bentu ta bin cai na Tombali ku Quinara. Tudu alguin toma kudadu.",
      active: true,
    },
  });

  console.log("✅ Seed concluído com sucesso:", {
    admin: admin.email,
    cidadao: cidadao.nin,
    dataset: dataset.slug,
    alerta: alerta.code,
  });
}

main()
  .catch((e) => {
    console.error("❌ Erro ao executar seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
