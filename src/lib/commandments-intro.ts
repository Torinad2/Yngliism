import fs from "node:fs";
import path from "node:path";

import type { Language } from "@/lib/i18n";

export function getCommandmentsIntro(lang: Language): string {
  const filePath = path.join(
    process.cwd(),
    "commandments",
    lang,
    "introduction.md",
  );

  return fs.readFileSync(filePath, "utf8");
}
