# La oficina de David

Panel visual de agentes virtuales: plano isométrico, ficha por agente y bandeja de aprobaciones.

## Probarlo ya (modo demo)

    npm install
    npm run dev

Sin variables de entorno funciona con datos de ejemplo. Los agentes siguen su horario con la hora de Madrid.

## Conectarlo a Supabase

1. Crea un proyecto Supabase **nuevo** (separado de Vetra y Finexa).
2. Ejecuta `supabase/migrations/0001_init.sql`, `0002_owner_only.sql` (cambia antes el correo) y `supabase/seed.sql` en el SQL Editor.
3. En Authentication > URL Configuration, pon como Site URL la dirección donde despliegues el panel. Aunque alguien se registre, solo el correo de `private.allowed_emails` ve datos.
4. Copia `.env.example` a `.env.local` y rellena la URL y la clave anónima.
5. `npm run dev`, entra con tu correo (enlace mágico) y verás el estado en vivo.

## Cómo está organizado

- `src/lib/config.ts`: posición, horario y rutas de cada agente (código).
- Tabla `agents`: estado y textos en vivo. `events`: historial. `approvals`: propuestas que esperan tu OK.
- `src/lib/generated/scene.ts`: el plano exportado desde la maqueta; no se edita a mano.
- Los agentes reales escribirán en estas tablas con la service role key desde un runner en el servidor, nunca desde el navegador.
