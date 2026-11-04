import type { Metadata } from "next";
import { notFound } from "next/navigation";
import SectionPage from "@/components/SectionPage";
import { languages, routes, type Language, type Section } from "@/lib/i18n";
import { localizedMetadata } from "@/lib/seo";
const sections=routes.filter(s=>s!=="home");
export function generateStaticParams(){return languages.flatMap(lang=>sections.map(section=>({lang,section})));}
export async function generateMetadata({params}:{params:Promise<{lang:Language;section:Section}>}):Promise<Metadata>{
 const {lang,section}=await params;
 return languages.includes(lang)&&sections.includes(section as Exclude<Section,"home">) ? localizedMetadata(lang,section) : {};
}
export default async function SectionRoute({params}:{params:Promise<{lang:Language;section:Section}>}) {
 const {lang,section}=await params;
 if(!languages.includes(lang)||!sections.includes(section as Exclude<Section,"home">))notFound();
 return <SectionPage lang={lang} section={section}/>;
}
