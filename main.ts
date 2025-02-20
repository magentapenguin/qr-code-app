const loaded = [
    'sl-button',
    'sl-select',
    'sl-tab',
    'sl-tab-group',
    'sl-tab-panel',
    'sl-input',
    'sl-option',
    'sl-qr-code',
    'sl-divider'
];
const promises = loaded.map((name) => (async () => {
    await customElements.whenDefined(name);
    const element = document.createElement('span');
    element.textContent = `${name} loaded`;
    document.getElementById('load-log')?.prepend(element);
})());
Promise.allSettled(promises).then(() => {
    const loadingscreen = document.getElementById('loading');
    if (loadingscreen) {
        loadingscreen.animate([
            {opacity: 1},
            {opacity: 0}
        ], {
            duration: 200,
            easing: 'cubic-bezier(0.7, 0, 0.84, 0)',
            fill: 'forwards'
        }).onfinish = () => {
            loadingscreen.remove();
        }
    }
});
const observer = new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
        const element = document.createElement('span');
        element.textContent = `${entry.name.split('/').pop()} loaded`;
        document.getElementById('load-log')?.prepend(element);
    }
});
observer.observe({entryTypes: ['resource']});
import '@shoelace-style/shoelace/dist/components/button/button.js';
import SlSelect from '@shoelace-style/shoelace/dist/components/select/select.js';
import '@shoelace-style/shoelace/dist/components/tab/tab.js';
import '@shoelace-style/shoelace/dist/components/tab-group/tab-group.js';
import '@shoelace-style/shoelace/dist/components/tab-panel/tab-panel.js';
import SlInput from '@shoelace-style/shoelace/dist/components/input/input.js';
import '@shoelace-style/shoelace/dist/components/option/option.js';
import '@shoelace-style/shoelace/dist/components/qr-code/qr-code.js';
import '@shoelace-style/shoelace/dist/components/divider/divider.js';
import '@shoelace-style/shoelace/dist/components/color-picker/color-picker.js';
import '@shoelace-style/shoelace/dist/components/alert/alert.js';
import '@shoelace-style/shoelace/dist/components/icon/icon.js';
import type * as Shoelace from '@shoelace-style/shoelace';
import { registerIconLibrary } from '@shoelace-style/shoelace';
import './theme-select';

registerIconLibrary('default', {
    resolver: name => import.meta.env.BASE_URL+`icons/${name}.svg`,
    mutator: svg => svg.setAttribute('fill', 'currentColor')
});

const generatorMethods = {} as Record<string, (abort: ()=>string) => string | Shoelace.SlInput | Shoelace.SlSelect>;

// text
generatorMethods['text'] = () => document.getElementById('text') as Shoelace.SlInput;

// url
generatorMethods['url'] = (abort) => {
    const url = document.getElementById('url') as Shoelace.SlInput;
    if (!url.reportValidity()) {
        return abort();
    }
    if (/^.*:\/\//gm.test(url.value)) {
        return url.value;
    } else {
        return 'https://' + url.value;
    }
}

// email
generatorMethods['email'] = (abort) => {
    const email = document.getElementById('email') as Shoelace.SlInput;
    const subject = document.getElementById('email-subject') as Shoelace.SlInput;
    const body = document.getElementById('email-body') as Shoelace.SlInput;
    const params = new URLSearchParams();
    if (!email.reportValidity()) {
        return abort();
    }
    if (subject.value) {
        params.append('subject', subject.value.replaceAll('\n','%0A').replaceAll(' ','%20'));
    }
    if (body.value) {
        params.append('body', body.value.replaceAll('\n','%0A').replaceAll(' ','%20'));
    }
    return `mailto:${email.value}` + (params.toString() ? `?${params.toString()}` : '');
}

// phone
generatorMethods['phone'] = (abort) => {
    const phone = document.getElementById('phone') as Shoelace.SlInput;
    if (!phone.reportValidity()) {
        return abort();
    }
    return `tel:${phone.value}`;
}

// sms
generatorMethods['sms'] = (abort) => {
    const phone = document.getElementById('sms-phone') as Shoelace.SlInput;
    if (!phone.reportValidity()) {
        return abort();
    }
    const message = document.getElementById('sms-message') as Shoelace.SlInput;
    return `sms:${phone.value}` + (message.value ? `:${message.value.replaceAll('\n','%0A').replaceAll(' ','%20')}` : '');
}

// wifi
generatorMethods['wifi'] = (abort) => {
    const ssid = document.getElementById('wifi-ssid') as Shoelace.SlInput;
    const password = document.getElementById('wifi-password') as Shoelace.SlInput;
    const security = document.getElementById('wifi-security') as Shoelace.SlSelect;
    const hidden = document.getElementById('wifi-hidden') as Shoelace.SlInput;
    if (!ssid.reportValidity()) {
        return abort();
    }
    if (!password.value && security.value !== 'nopass') {
        password.setCustomValidity('Password is required');
        return abort();
    }
    if (!security.reportValidity()) {
        return abort();
    }
    if (!hidden.reportValidity()) {
        return abort();
    }
    let correctedSSID = ssid.value.replaceAll(';','\\;');
    correctedSSID = correctedSSID.replaceAll(',','\\,');
    correctedSSID = correctedSSID.replaceAll(':','\\:');
    correctedSSID = correctedSSID.replaceAll('"','\\"');
    // make wifi info
    return `WIFI:S:${correctedSSID};T:${security.value};P:${password.value};H:${hidden.value ?? false};`;
}

generatorMethods['contact'] = (abort) => {
    const name = document.getElementById('contact-name') as Shoelace.SlInput;
    const phone = document.getElementById('contact-phone') as Shoelace.SlInput;
    const email = document.getElementById('contact-email') as Shoelace.SlInput;
    const address = document.getElementById('contact-address') as Shoelace.SlInput;
    const url = document.getElementById('contact-url') as Shoelace.SlInput;
    const org = document.getElementById('contact-org') as Shoelace.SlInput;
    const title = document.getElementById('contact-title') as Shoelace.SlInput;
    // const note = document.getElementById('contact-note') as Shoelace.SlInput;
    const contact = [] as string[];
    if (name.reportValidity()) {
        contact.push('N:'+name.value+';');
    } else {
        return abort()
    }
    if (phone.value) {
        contact.push('TEL:'+phone.value+';');
    }
    if (email.value) {
        contact.push('EMAIL:'+email.value+';');
    }
    if (address.value) {
        contact.push('ADR:'+address.value+';');
    }
    if (url.value) {
        if (/^.*:\/\//gm.test(url.value)) {
            contact.push('URL:'+url.value+';');
        } else {
            contact.push('URL:https://'+url.value+';');
        }
    }
    if (org.value) {
        contact.push('ORG:'+org.value+';');
    }
    if (title.value) {
        contact.push('TITLE:'+title.value+';');
    }
    /*
    if (note.value) {
        contact.push('NOTE:'+note.value+';');
    }
    */
    return `MECARD:${contact.join('')};`;
}

const qr = document.getElementById('qr') as Shoelace.SlQrCode;
const qrFill = document.getElementById('qr-fg-color') as Shoelace.SlColorPicker;
const qrBg = document.getElementById('qr-bg-color') as Shoelace.SlColorPicker;
const warning = document.getElementById('color-warning') as Shoelace.SlTooltip;
const warningText = document.getElementById('color-warning-hover') as HTMLDivElement;
const checkContrast = () => {
    const fg = qrFill.value;
    const bg = qrBg.value;
    const luminance = (rgb: number[]) => {
        return 0.2126 * rgb[0] + 0.7152 * rgb[1] + 0.0722 * rgb[2];
    }
    const contrast = (l1: number, l2: number) => {
        return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
    }
    console.log(fg, bg);
    // convert hex to rgb
    const hexToRgb = (hex: string) => {
        return [parseInt(hex.slice(1,3), 16), parseInt(hex.slice(3,5), 16), parseInt(hex.slice(5,7), 16)];
    }
    const fgRgb = hexToRgb(fg);
    const bgRgb = hexToRgb(bg);
    const fgLuminance = luminance(fgRgb);
    const bgLuminance = luminance(bgRgb);
    const contrastRatio = contrast(fgLuminance, bgLuminance);
    console.log(fgLuminance, bgLuminance, contrastRatio);
    if (contrastRatio < 4.5) {
        warning.hidden = false;
        warningText.innerHTML = `Contrast ratio: ${contrastRatio.toFixed(2)}. (minimum: 4.5) The QR code may be hard to scan. <strong>Click to fix.<strong>`;
        return false;
    } else {
        warning.hidden = true;
        return true;
    }
}

warning.addEventListener('click', () => {
    const fg = qrFill.value;
    const bg = qrBg.value;
    console.log(fg, bg);
    // convert hex to rgb
    const hexToRgb = (hex: string) => {
        return [parseInt(hex.slice(1,3), 16), parseInt(hex.slice(3,5), 16), parseInt(hex.slice(5,7), 16)];
    }
    const fgRgb = hexToRgb(fg);
    const bgRgb = hexToRgb(bg);
    let interations = 0;
    while (!checkContrast()) {
        interations++;
        if (interations > 20) {
            console.error('Too many iterations');
            break;
        }
        console.log('Iteration:', interations);
        // update the colors
        fgRgb[0] = Math.max(0, fgRgb[0] - 50);
        fgRgb[1] = Math.max(0, fgRgb[1] - 50);
        fgRgb[2] = Math.max(0, fgRgb[2] - 50);
        qrFill.value = `#${fgRgb.map(x => x.toString(16).padStart(2, '0')).join('')}`;
        qr.fill = qrFill.value;
        // background should also be updated
        bgRgb[0] = Math.min(255, bgRgb[0] + 50);
        bgRgb[1] = Math.min(255, bgRgb[1] + 50);
        bgRgb[2] = Math.min(255, bgRgb[2] + 50);
        qrBg.value = `#${bgRgb.map(x => x.toString(16).padStart(2, '0')).join('')}`;
        qr.background = qrBg.value;
        qr.shadowRoot!.querySelector('canvas')!.style.setProperty('--qr-code-border-color', qrBg.value, 'important');
    }
});

qrFill.addEventListener('sl-change', () => {
    qr.fill = qrFill.value;
    checkContrast();
});
qrBg.addEventListener('sl-change', () => {
    qr.background = qrBg.value;
    qr.shadowRoot!.querySelector('canvas')!.style.setProperty('--qr-code-border-color', qrBg.value, 'important');
    checkContrast();
});



// generate QR code
const generate = () => {
    const tabs = document.getElementById('type-selector') as Shoelace.SlTabGroup;
    const type = (tabs.querySelector('sl-tab[active]') as Shoelace.SlTab).panel;
    const errorCorrection = document.getElementById('error-correction') as Shoelace.SlSelect;
    qr.errorCorrection = errorCorrection.value as 'L' | 'M' | 'Q' | 'H';
    const showerror = (message: string) => {
        qr.hidden = true;
        const error = document.getElementById('error') as Shoelace.SlAlert;
        error.open = true;
        document.getElementById('error-message')!.innerHTML = message;
    }
    const error = document.getElementById('error') as Shoelace.SlAlert;
    error.open = false;
    console.log(type);
    let flag = false;
    const abort = (msg?: string) => {
        flag = true;
        showerror(msg ?? 'Invalid input');
        return ''
    };
    const func = generatorMethods[type];
    if (typeof func !== 'function' ) {
        console.warn('No function found for type:', type);
        showerror('No implementation found');
        return;
    }
    let output = func(abort);
    if (flag) {
        return;
    }
    if (output instanceof SlInput) {
        if (!output.reportValidity()) {
            showerror('Invalid input');
            return;
        }
        output = output.value;
    }
    if (output instanceof SlSelect) {
        if (!output.reportValidity()) {
            showerror('Invalid input');
            return;
        }
        output = output.value[0];
    }
    qr.hidden = false;
    qr.value = output;
    qr.updateComplete.then(() => {
        const canvas = qr.shadowRoot?.querySelector('canvas');
        if (canvas) {
            // check if the canvas is empty
            const ctx = canvas.getContext('2d');
            const imageData = ctx?.getImageData(0, 0, 1, 1);
            console.log(imageData, imageData?.data);
            if (imageData && imageData.data[3] === 0) {
                // if empty, hide the qr code and show the error message
                showerror('Failed to generate QR code!<br><small>Try reducing the error correction level or the amount of data.<small>');
            }
        }
    });
}

document.getElementById('generate')!.addEventListener('click', generate);