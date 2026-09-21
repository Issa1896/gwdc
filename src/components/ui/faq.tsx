import { Accordion } from "@/components/ui/accordion";

/** FAQ — agregação de perguntas frequentes com Accordion. */
export function Faq({ items, className }: { items: { question: string; answer: string }[]; className?: string }) {
  return (
    <Accordion
      className={className}
      multiple
      items={items.map(({ question, answer }) => ({ title: question, content: answer }))}
    />
  );
}
