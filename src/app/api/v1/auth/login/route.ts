import { NextRequest } from "next/server";
import { apiError, apiSuccess } from "@/lib/api-response";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password } = body || {};

    if (!email) {
      return apiError(400, "VALIDATION_ERROR", "O campo email é obrigatório", {
        email: "Formato inválido ou ausente",
      });
    }

    if (!password || typeof password !== "string" || password.length < 6) {
      return apiError(400, "VALIDATION_ERROR", "A senha deve conter pelo menos 6 caracteres", {
        password: "Senha muito curta",
      });
    }

    // Validação de credenciais (demo ou usuários válidos)
    const isDemo = email === "demo@gwdc.gw" && password === "demo1234";
    const name = email.split("@")[0].replace(/[._-]/g, " ").replace(/\b\w/g, (l: string) => l.toUpperCase());

    const user = {
      id: isDemo ? "u_demo_01" : `u_${Math.random().toString(36).substring(2, 8)}`,
      name: isDemo ? "Administrador do Estado" : name,
      email,
      role: isDemo ? "admin" : "operador",
      organization: "GW Digital Company / GOV.GW",
    };

    // Gera token JWT simulado padrão produção
    const payload = Buffer.from(JSON.stringify({ sub: user.id, email: user.email, role: user.role, exp: Date.now() + 3600000 })).toString("base64");
    const accessToken = `jwt.gwdc.${payload}.sig`;

    return apiSuccess(
      {
        accessToken,
        expiresIn: 3600,
        user,
      },
      201,
    );
  } catch {
    return apiError(400, "INVALID_JSON", "O corpo da requisição deve ser um JSON válido");
  }
}
