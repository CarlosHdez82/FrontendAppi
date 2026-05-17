// ============================================================
// user.ts — Store global de sesión del usuario
// ============================================================
// Define los stores de Svelte que mantienen los datos del
// usuario autenticado disponibles en toda la aplicación.
//
// Usa localStorage para persistir la sesión entre recargas
// de página. La bandera 'browser' evita errores en SSR
// (Server-Side Rendering), ya que localStorage solo existe
// en el navegador, no en el servidor de SvelteKit.
// ============================================================

import { writable } from 'svelte/store';
import { browser } from '$app/environment';

// ------------------------------------------------------------
// Inicialización de stores desde localStorage
// Al cargar la app, se recuperan los valores guardados para
// que el usuario no tenga que volver a iniciar sesión.
// Si no hay valor guardado, se inicializa en null.
// ------------------------------------------------------------
const initialRole = browser ? localStorage.getItem('user_role') : null;
export const userRole = writable<string | null>(initialRole); // Rol: 'admi', 'faculty', 'teacher'

const initialName = browser ? localStorage.getItem('user_name') : null;
export const userName = writable<string | null>(initialName); // Nombre completo del usuario

const initialId = browser ? localStorage.getItem('user_id') : null;
export const userId = writable<string | null>(initialId);     // ID numérico del usuario

// ------------------------------------------------------------
// Sincronización automática con localStorage
// Cada vez que un store cambia, se actualiza localStorage.
// Si el valor es null (logout), se elimina la clave.
// El bloque 'if (browser)' garantiza que solo se ejecuta
// en el navegador, nunca durante el renderizado del servidor.
// ------------------------------------------------------------
if (browser) {
    userRole.subscribe((value) => {
        if (value) localStorage.setItem('user_role', value);
        else localStorage.removeItem('user_role');
    });
    userName.subscribe((value) => {
        if (value) localStorage.setItem('user_name', value);
        else localStorage.removeItem('user_name');
    });
    userId.subscribe((value) => {
        if (value) localStorage.setItem('user_id', value);
        else localStorage.removeItem('user_id');
    });
}