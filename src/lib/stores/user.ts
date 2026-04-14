import { writable } from 'svelte/store';
import { browser } from '$app/environment';

// Al arrancar, intenta leer el rol del localStorage si estamos en el navegador
const initialRole = browser ? localStorage.getItem('user_role') : null;

export const userRole = writable<string | null>(initialRole);

// Nos aseguramos de que cada vez que el rol cambie, se guarde en el navegador
if (browser) {
    userRole.subscribe((value) => {
        if (value) {
            localStorage.setItem('user_role', value);
        } else {
            localStorage.removeItem('user_role');
        }
    });
}