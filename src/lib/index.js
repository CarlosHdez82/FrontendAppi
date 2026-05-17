// ============================================================
// index.js — Barrel de exportaciones de $lib
// ============================================================
// Este archivo actúa como punto central de exportación para
// los módulos de la carpeta src/lib.
// Permite importar con el alias '$lib' desde cualquier parte
// del proyecto en lugar de usar rutas relativas largas.
//
// Ejemplo de uso:
//   import { userName } from '$lib';
//   en lugar de: import { userName } from '../../lib/stores/user';
// ============================================================

// Actualmente vacío — las importaciones se hacen directamente
// desde sus archivos (ej: '$lib/stores/user', '$lib/menus').
// Agregar exportaciones aquí cuando se quieran centralizar.