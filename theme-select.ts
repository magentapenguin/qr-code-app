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
    // fire a custom event so that the icons can update
    document.dispatchEvent(new Event('themechange'));
}
selector.value = theme;
const onChange = () => {
    localStorage.setItem('theme', selector.value as string);
    applyTheme(selector.value as string);
    let selected = selector.selectedOptions[0];
    if (!selected) {
        selected = selector.querySelector(`sl-option[value="${selector.value}"]`)!;
    }
    if (selected) {
        const icon = selected.querySelector('sl-icon');
        if (icon && icon.getAttribute('name')) {
            selector.querySelector('& > sl-icon')!.setAttribute('name', icon.getAttribute('name')!);
        }
    }
}
onChange();

selector.addEventListener('sl-change', onChange);
requestAnimationFrame(() => applyTheme(theme));
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
    if (selector.value === 'system') {
        applyTheme(e.matches ? 'dark' : 'light');
    }
});