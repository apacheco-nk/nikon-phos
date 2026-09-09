const supabaseUrl=process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/$/,'');
const usesSupabase=process.env.NEXT_PUBLIC_GALLERY_STORAGE==='supabase';
export function galleryUrl(localPath:string){if(!usesSupabase||!supabaseUrl||!localPath.startsWith('/gallery/'))return localPath;const objectPath=localPath.replace(/^\/gallery\//,'');return `${supabaseUrl}/storage/v1/object/public/nikon-phos/${objectPath}`}
