import type * as Shoelace from '@shoelace-style/shoelace';

const selector = document.getElementById('theme-selector') as Shoelace.SlSelect;
const theme = localStorage.getItem('theme') || 'system';
const applyTheme = (theme: string) => {
    if (theme === 'system') {
        theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    if (theme === 'dark') {
        document.documentElement.classList.add('sl-theme-dark');
    }
    if (theme === 'light') {
        document.documentElement.classList.remove('sl-theme-dark');
    }
}
selector.value = theme;
selector.addEventListener('sl-change', () => {
    localStorage.setItem('theme', selector.value as string);
    applyTheme(selector.value as string);
});
applyTheme(theme);
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
    if (selector.value === 'system') {
        applyTheme(e.matches ? 'dark' : 'light');
    }
});