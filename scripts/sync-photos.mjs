import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';
import exifr from 'exifr';

const root=process.cwd();
const supported=new Set(['.jpg','.jpeg','.png','.webp','.tif','.tiff']);
const days=['septiembre8','septiembre9'];
const result={septiembre8:[],septiembre9:[]};

for(const day of days){
  const source=path.join(root,'public','gallery',day,'full');
  const optimizedDir=path.join(root,'public','gallery',day,'optimized');
  const thumbDir=path.join(root,'public','gallery',day,'thumbs');
  await fs.mkdir(source,{recursive:true}); await fs.mkdir(optimizedDir,{recursive:true}); await fs.mkdir(thumbDir,{recursive:true});
  const files=(await fs.readdir(source)).filter(file=>supported.has(path.extname(file).toLowerCase()));
  const photos=[];
  for(const file of files){
    const input=path.join(source,file); const stem=path.parse(file).name.replace(/[^a-zA-Z0-9_-]+/g,'-').toLowerCase();
    const metadata=await sharp(input).metadata(); const exif=await exifr.parse(input,{pick:['DateTimeOriginal','CreateDate']}).catch(()=>null); const date=exif?.DateTimeOriginal||exif?.CreateDate; const capturedAt=date instanceof Date?date.toISOString():undefined;
    const fullName=`${stem}.jpg`; const thumbName=`${stem}.webp`;
    const optimizedPath=path.join(optimizedDir,fullName); const thumbPath=path.join(thumbDir,thumbName); const inputStat=await fs.stat(input);
    const current=await Promise.all([fs.stat(optimizedPath).catch(()=>null),fs.stat(thumbPath).catch(()=>null)]);
    if(!current[0]||!current[1]||current[0].mtimeMs<inputStat.mtimeMs||current[1].mtimeMs<inputStat.mtimeMs){
      await sharp(input).rotate().resize({width:2400,height:2400,fit:'inside',withoutEnlargement:true}).jpeg({quality:90,mozjpeg:true}).toFile(optimizedPath);
      await sharp(input).rotate().resize({width:640,height:480,fit:'cover',position:'attention'}).webp({quality:80}).toFile(thumbPath);
    }
    photos.push({original:`/gallery/${day}/full/${encodeURIComponent(file)}`,optimized:`/gallery/${day}/optimized/${fullName}`,thumb:`/gallery/${day}/thumbs/${thumbName}`,filename:file,capturedAt,sort:capturedAt||file});
  }
  photos.sort((a,b)=>a.sort.localeCompare(b.sort)); result[day]=photos.map(({sort,...photo})=>photo);
}

if(days.some(day=>result[day].length)){
  const output=`export type GalleryPhoto = { original: string; optimized: string; thumb: string; filename: string; capturedAt?: string };\nexport type GalleryDay = 'septiembre8'|'septiembre9';\nexport const galleries = ${JSON.stringify(result,null,2)} as { [day in GalleryDay]: GalleryPhoto[] };\n`;
  await fs.writeFile(path.join(root,'app','gallery-data.ts'),output,'utf8');
  console.log(`Galería actualizada: ${days.map(day=>`${result[day].length} en ${day}`).join(', ')}.`);
}else console.log('No hay fotos locales todavía; se conservan las fotografías de demostración.');
