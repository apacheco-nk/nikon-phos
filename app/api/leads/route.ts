import {createClient} from '@supabase/supabase-js';
import {NextResponse} from 'next/server';

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  const body = await request.json().catch(() => null);
  if (!body || body.website) return NextResponse.json({error: 'Solicitud inválida.'}, {status: 400});
  const lead = {
    nombre: String(body.nombre ?? '').trim().slice(0, 120),
    email: String(body.email ?? '').trim().toLowerCase().slice(0, 254),
    telefono: String(body.telefono ?? '').trim().slice(0, 40),
    modelo_camara: String(body.camara ?? '').trim().slice(0, 120),
    instagram: String(body.instagram ?? '').trim().slice(0, 120) || null,
    consentimiento: body.consentimiento === true,
  };
  if (!lead.nombre || !emailPattern.test(lead.email) || !lead.telefono || !lead.modelo_camara || !lead.consentimiento) {
    return NextResponse.json({error: 'Completá correctamente todos los campos obligatorios.'}, {status: 422});
  }

  if (process.env.NEXT_PUBLIC_GALLERY_STORAGE === 'local') {
    return NextResponse.json({ok: true, demo: true}, {status: 201});
  }
  if (!url || !key || url.includes('your-project') || key.includes('your-publishable')) {
    return NextResponse.json({error: 'Supabase no está configurado.'}, {status: 503});
  }

  const supabase = createClient(url, key, {auth: {persistSession: false, autoRefreshToken: false}});
  const {error} = await supabase.from('leads').insert(lead);
  if (error) {
    console.error('No fue posible registrar el lead:', error.code);
    return NextResponse.json({error: 'No pudimos completar el registro. Intentá nuevamente.'}, {status: 500});
  }
  return NextResponse.json({ok: true}, {status: 201});
}
