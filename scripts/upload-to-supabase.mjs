import fs from 'node:fs/promises';
import path from 'node:path';
import {createClient} from '@supabase/supabase-js';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const secret = process.env.SUPABASE_SECRET_KEY;
if (!url || !secret) throw new Error('Faltan NEXT_PUBLIC_SUPABASE_URL o SUPABASE_SECRET_KEY en .env.upload.local');

const supabase = createClient(url, secret, {auth: {persistSession: false, autoRefreshToken: false}});
const root = process.cwd();
const contentTypes = {'.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp'};
const availableDays = ['septiembre8', 'septiembre9'];
const requestedDay = process.argv[2];
if (requestedDay && !availableDays.includes(requestedDay)) {
  throw new Error(`Jornada inválida: ${requestedDay}.`);
}
const days = requestedDay ? [requestedDay] : availableDays;
let uploaded = 0;

for (const day of days) {
  for (const variant of ['optimized', 'thumbs']) {
    const directory = path.join(root, 'public', 'gallery', day, variant);
    const files = await fs.readdir(directory).catch(() => []);
    for (const filename of files) {
      const extension = path.extname(filename).toLowerCase();
      if (!contentTypes[extension]) continue;
      const file = await fs.readFile(path.join(directory, filename));
      const objectPath = `${day}/${variant}/${filename}`;
      const {error} = await supabase.storage.from('nikon-phos').upload(objectPath, file, {
        contentType: contentTypes[extension], cacheControl: '31536000', upsert: true,
      });
      if (error) throw new Error(`${objectPath}: ${error.message}`);
      uploaded += 1;
      process.stdout.write(`\r${uploaded} archivos cargados`);
    }
  }
}

console.log(`\nCarga terminada: ${uploaded} archivos.`);
