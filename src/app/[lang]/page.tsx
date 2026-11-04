import type { Metadata } from "next";
import { notFound } from "next/navigation";
import SectionPage from "@/components/SectionPage";
import { languages, type Language } from "@/lib/i18n";
import { localizedMetadata } from "@/lib/seo";
export function generateStaticParams() { return languages.map(lang => ({lang})); }
export async function generateMetadata({params}: {params:Promise<{lang:Language}>}):Promise<Metadata> {
  const {lang}=await params;
  return languages.includes(lang) ? localizedMetadata(lang,"home") : {};
}
export default async function Home({params}: {params:Promise<{lang:Language}>}) {
  const {lang}=await params;
  if (!languages.includes(lang)) notFound();
  return <SectionPage lang={lang} section="home"/>;
}
