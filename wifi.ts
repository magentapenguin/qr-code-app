import type * as Shoelace from '@shoelace-style/shoelace';
const security = document.getElementById('wifi-security') as Shoelace.SlSelect;
const password = document.getElementById('wifi-password') as Shoelace.SlInput;

security.addEventListener('sl-change', () => {
    if (security.value === 'nopass') {
        password.disabled = true;
    } else {
        password.disabled = false;
    }
});