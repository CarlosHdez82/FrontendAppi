import { writable } from 'svelte/store';
import { browser } from '$app/environment';

const initialRole = browser ? localStorage.getItem('user_role') : null;
export const userRole = writable<string | null>(initialRole);

const initialName = browser ? localStorage.getItem('user_name') : null;
export const userName = writable<string | null>(initialName);

const initialId = browser ? localStorage.getItem('user_id') : null;
export const userId = writable<string | null>(initialId);

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
