# Cargar fotografías de Nikon Phos 2026

## Jornadas

- `septiembre8`: martes 8 de septiembre.
- `septiembre9`: miércoles 9 de septiembre.

## Flujo local

1. Copia los JPG originales en `public/gallery/<jornada>/full`.
2. Ejecuta `npm run photos:sync`.
3. El proceso crea automáticamente:
   - `thumbs`: miniaturas WebP de 640 × 480 px.
   - `optimized`: JPG de hasta 2400 px para previsualizar y descargar.
   - `app/gallery-data.ts`: listado ordenado por metadatos cuando estén disponibles.

## Flujo de producción

1. Ejecuta la migración incluida en `supabase/migrations` desde el SQL Editor del nuevo proyecto.
2. Crea `.env.upload.local` a partir de `.env.upload.example` y agrega temporalmente la secret key del nuevo proyecto.
3. Ejecuta `npm run photos:upload`. Sólo se publican las carpetas `thumbs` y `optimized` en el bucket `nikon-phos`.
4. Elimina `.env.upload.local` al terminar.

## Variables futuras en Vercel

```text
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
NEXT_PUBLIC_GALLERY_STORAGE=supabase
```

No agregues la secret key de carga ni la contraseña de la base de datos a Vercel.
