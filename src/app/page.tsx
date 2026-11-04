import Link from 'next/link';
export default function Root() { return <main style={{padding:'4rem',textAlign:'center'}}><h1>Yngliism</h1><p><Link href='/ru/'>Русский</Link> · <Link href='/en/'>English</Link></p></main>; }
