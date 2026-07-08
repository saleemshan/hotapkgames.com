/** Strip markup so JSON-LD `Answer.text` stays plain for FAQ rich results. */
export function toPlainTextForSchema(input: string): string {
  let s = input;
  s = s.replace(/<[^>]*>/g, " ");
  s = s.replace(/\[([^\]]+)\]\([^)]*\)/g, "$1");
  s = s.replace(/`{1,3}[^`]*`{1,3}/g, " ");
  s = s.replace(/\*\*?|__?/g, "");
  s = s.replace(/^#{1,6}\s+/gm, "");
  s = s.replace(/\s+/g, " ").trim();
  return s;
}
