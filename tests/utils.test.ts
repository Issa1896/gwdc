import { describe, expect, it } from "vitest";
import { cn, formatDate, formatFcfa, formatNumber, slugify, truncate } from "../src/lib/utils";

/** Normaliza separadores de milhar (espaço estreito/emé) para comparação. */
const plain = (value: string) => value.replace(/[\u202f\u00a0]/g, " ");

describe("Utils GWDC", () => {
  it("cn mescla classes sem conflito", () => {
    expect(cn("px-2", "px-3")).toBe("px-3");
    expect(cn("a", false, null, undefined, "b")).toBe("a b");
  });

  it("formatNumber usa separador pt-PT", () => {
    expect(plain(formatNumber(1234567))).toBe("1 234 567");
  });

  it("formatFcfa formata moeda", () => {
    expect(plain(formatFcfa(12500))).toBe("12 500 FCFA");
  });

  it("formatDate formata em português", () => {
    expect(formatDate("2026-08-01")).toBe("1 de ago de 2026");
  });

  it("slugify remove acentos e espaços", () => {
    expect(slugify("Governo Digital — Guiné-Bissau!")).toBe("governo-digital-guine-bissau");
  });

  it("truncate limita e adiciona reticências", () => {
    expect(truncate("Tecnologia que transforma", 10)).toBe("Tecnologi…");
    expect(truncate("Curto", 10)).toBe("Curto");
  });
});
