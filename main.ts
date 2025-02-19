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
import type * as Shoelace from '@shoelace-style/shoelace';
import { registerIconLibrary } from '@shoelace-style/shoelace';
import './theme-select';

registerIconLibrary('default', {
    resolver: name => import.meta.env.BASE_URL+`icons/${name}.svg`,
    mutator: svg => svg.setAttribute('fill', 'currentColor')
});

const data = {} as Record<string, (abort: ()=>string) => string | Shoelace.SlInput | Shoelace.SlSelect>;

// text
data['text'] = () => document.getElementById('text') as Shoelace.SlInput;

// url
data['url'] = (abort) => {
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
data['email'] = (abort) => {
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
data['phone'] = (abort) => {
    const phone = document.getElementById('phone') as Shoelace.SlInput;
    if (!phone.reportValidity()) {
        return abort();
    }
    return `tel:${phone.value}`;
}

// sms
data['sms'] = (abort) => {
    const phone = document.getElementById('sms-phone') as Shoelace.SlInput;
    if (!phone.reportValidity()) {
        return abort();
    }
    const message = document.getElementById('sms-message') as Shoelace.SlInput;
    return `sms:${phone.value}` + (message.value ? `:${message.value.replaceAll('\n','%0A').replaceAll(' ','%20')}` : '');
}

// wifi
data['wifi'] = (abort) => {
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

data['contact'] = (abort) => {
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
document.addEventListener('themechange', () => {
    const stylemap = document.documentElement.computedStyleMap();
    if (stylemap.has('color')) {
        qr.fill = stylemap.get('color')!.toString();
    }
    if (stylemap.has('background-color')) {
        qr.background = stylemap.get('background-color')!.toString();
        qr.shadowRoot!.querySelector('canvas')!.style.border = `0.4rem solid ${qr.background}`;
    }
    // if the background color is dark, swap the colors
    const bg = stylemap.get('background-color')!.toString();
    const lum = (r: number, g: number, b: number) => {
        const a = [r, g, b].map((v) => {
            v /= 255;
            return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
        });
        return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
    }
    console.log(bg);
    const rgb = bg.match(/\d+/g);
    if (rgb) {
        const l = lum(parseInt(rgb[0]), parseInt(rgb[1]), parseInt(rgb[2]));
        console.log(l);
        if (l < 0.179) {
            let temp = qr.fill;
            qr.fill = qr.background;
            qr.background = temp;
            qr.shadowRoot!.querySelector('canvas')!.style.border = `0.4rem solid ${qr.background}`;
        }
    }
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
        document.getElementById('error-message')!.textContent = message;
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
    const func = data[type];
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
                showerror('Failed to generate QR code');
            }
        }
    });
}

document.getElementById('generate')!.addEventListener('click', generate);