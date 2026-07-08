const CATEGORY: Record<string, string> = {
  tools: "Tools",
  injectors: "Injectors",
  utilities: "Utilities",
  apps: "Apps",
  "casino-games": "Casino games",
  "color-prediction": "Colour prediction",
  "sports-betting": "Sports betting",
  "card-games": "Card games",
};

export function categoryHeading(category: string): string {
  return CATEGORY[category] ?? category.replace(/-/g, " ");
}

export function categorySeoParagraph(category: string): string {
  const label = categoryHeading(category);
  return `${label} APKs and editorial notes for Pakistani Android users. We surface version metadata, mirror hygiene, and JazzCash / EasyPaisa context where relevant so you can compare publishers without wading through ad-heavy WordPress templates.`;
}
