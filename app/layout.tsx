import type {Metadata} from 'next';import './globals.css';
export const metadata:Metadata={title:'Nikon · Phos 2026',description:'Encontrá y descargá tu fotografía de Nikon Phos Uruguay 2026.',icons:{icon:'/favicon.png'}};
export default function RootLayout({children}:Readonly<{children:React.ReactNode}>){return <html lang="es"><body>{children}</body></html>}
