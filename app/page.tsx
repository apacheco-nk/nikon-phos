'use client';
import {useEffect,useState} from 'react';
import {ArrowRight,Camera,Check,Images} from 'lucide-react';
import {galleries} from './gallery-data';
import {galleryUrl} from '@/lib/gallery-url';

type Lead={nombre:string;email:string;telefono:string;camara:string;instagram:string};
const leadKey='nikon-phos-lead';
const dayCovers={septiembre8:'/gallery/septiembre8/optimized/08092026-dsc_0000-9_fullres.jpg'};

export default function Home(){
  const [registered,setRegistered]=useState(false);
  const [submitting,setSubmitting]=useState(false);
  const [formError,setFormError]=useState('');
  const totalPhotos=galleries.septiembre8.length+galleries.septiembre9.length;
  useEffect(()=>{if(localStorage.getItem(leadKey))setRegistered(true)},[]);

  async function submit(formData:FormData){
    const lead:Lead={nombre:String(formData.get('nombre')||''),email:String(formData.get('email')||''),telefono:String(formData.get('telefono')||''),camara:String(formData.get('camara')||''),instagram:String(formData.get('instagram')||'')};
    setSubmitting(true);setFormError('');
    try{
      const response=await fetch('/api/leads',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({...lead,consentimiento:true,website:String(formData.get('website')||'')})});
      const data=await response.json();
      if(!response.ok)throw new Error(data.error||'No pudimos completar el registro.');
      localStorage.setItem(leadKey,JSON.stringify(lead));setRegistered(true);
      setTimeout(()=>document.querySelector('#galerias')?.scrollIntoView({behavior:'smooth'}),50);
    }catch(error){setFormError(error instanceof Error?error.message:'No pudimos completar el registro.')}finally{setSubmitting(false)}
  }

  return <main>
    <header className="site-header"><a href="/" aria-label="Nikon Phos 2026"><img src="/nikon-logo_b.svg" alt="Nikon"/></a><span className="event-mark"><img src="/logo-phos-header.svg" alt="Phos 2026"/></span></header>
    <section className="hero phos-hero"><div className="hero-copy"><p className="eyebrow">08—09 SEP · URUGUAY 2026</p><h1>Encontrá<br/><em>tu foto.</em></h1><p className="hero-text">Si participaste de Nikon Phos 2026, registrate para acceder a las fotografías que tomamos durante las dos jornadas.</p><div className="hero-stat"><Camera/><span><strong>{totalPhotos} fotografía{totalPhotos===1?'':'s'} disponible{totalPhotos===1?'':'s'}</strong><small>Galerías de Nikon Phos 2026</small></span></div></div>
      <div className="lead-card">{registered?<div className="success-state"><span className="success-icon"><Check/></span><p className="eyebrow">Registro completo</p><h2>¡Gracias!</h2><p>Ya podés entrar a las galerías y descargar tus fotografías.</p><a className="primary-button" href="#galerias">Ver mis fotos <ArrowRight size={18}/></a><button className="text-button" onClick={()=>{localStorage.removeItem(leadKey);setRegistered(false)}}>Registrá a otra persona</button></div>:
      <form action={submit}><div className="form-heading"><span>01</span><div><p className="eyebrow">Antes de comenzar</p><h2>Contanos sobre vos</h2></div></div><div className="field-grid"><label className="wide">Nombre completo<input name="nombre" autoComplete="name" required placeholder="Ej. Francisca Soto"/></label><label>Correo electrónico<input name="email" type="email" autoComplete="email" required placeholder="tu@email.com"/></label><label>Teléfono<input name="telefono" type="tel" autoComplete="tel" required placeholder="+598 99 123 456"/></label><label>Modelo de cámara<input name="camara" required placeholder="Ej. Nikon Z6III"/></label><label><span className="field-label">Instagram <small>(opcional)</small></span><input name="instagram" autoComplete="off" placeholder="@usuario"/></label><label className="honeypot" aria-hidden="true">Sitio web<input name="website" tabIndex={-1} autoComplete="off"/></label></div><label className="consent"><input type="checkbox" required/><span>Acepto recibir novedades de Nikon y el tratamiento de mis datos según la política de privacidad.</span></label>{formError&&<p className="form-error" role="alert">{formError}</p>}<button className="primary-button" type="submit" disabled={submitting}>{submitting?'Registrando…':'Encontrar mis fotografías'} {!submitting&&<ArrowRight size={18}/>}</button></form>}</div>
    </section>
    {registered&&<section id="galerias" className="gallery-picker phos-galleries"><div className="section-heading"><p className="eyebrow">Nikon Phos 2026</p><h2>Elegí tu jornada</h2><p>Seleccioná el día en que te fotografiamos.</p></div><div className="day-grid"><DayCard href="/8-septiembre" day="Martes" date="08 SEP" image={galleryUrl(dayCovers.septiembre8)} count={galleries.septiembre8.length}/><DayCard href="/9-septiembre" day="Miércoles" date="09 SEP" image="/galeria_bw.jpg" count={0} locked/></div></section>}
    <Footer/>
  </main>;
}

function DayCard({href,day,date,image,count,locked=false}:{href:string;day:string;date:string;image:string;count:number;locked?:boolean}){return <button type="button" disabled={locked} onClick={()=>!locked&&window.location.assign(href)} className={`day-card${locked?' is-locked':''}`} style={{backgroundImage:`linear-gradient(180deg,transparent 25%,rgba(0,0,0,.82)),url(${image})`}}><span className="photo-count"><Images size={15}/> {locked?'Próximamente':`${count} foto${count===1?'':'s'}`}</span><div><small>{date}</small><h3>{day}</h3><span>{locked?'Fotografías próximamente':<>Explorar galería <ArrowRight size={18}/></>}</span></div></button>}

export function Footer(){return <footer><img src="/nikon-logo_w.svg" alt="Nikon"/><img className="phos-footer-logo" src="/logo-phos-footer.svg" alt="Phos 2026"/><span>© 2026 Nikon · Phos Uruguay</span></footer>}
