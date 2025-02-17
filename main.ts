import '@shoelace-style/shoelace/dist/themes/light.css';
import '@shoelace-style/shoelace/dist/themes/dark.css';
import '@shoelace-style/shoelace/dist/components/button/button.js';
import '@shoelace-style/shoelace/dist/components/select/select.js';
import '@shoelace-style/shoelace/dist/components/tab/tab.js';
import '@shoelace-style/shoelace/dist/components/tab-group/tab-group.js';
import '@shoelace-style/shoelace/dist/components/tab-panel/tab-panel.js';
import '@shoelace-style/shoelace/dist/components/input/input.js';
import '@shoelace-style/shoelace/dist/components/option/option.js';
import '@shoelace-style/shoelace/dist/components/qr-code/qr-code.js';
import './style.css';
import * as Shoelace from '@shoelace-style/shoelace';
import { registerIconLibrary } from '@shoelace-style/shoelace';

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
        params.append('subject', subject.value);
    }
    if (body.value) {
        params.append('body', body.value);
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
    return `sms:${phone.value}` + (message.value ? `?body=${message.value}` : '');
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
    if (!password.value && security.value[0] !== 'nopass') {
        password.setCustomValidity('Password is required');
        return abort();
    }
    if (!security.reportValidity()) {
        return abort();
    }
    if (!hidden.reportValidity()) {
        return abort();
    }
    const params = new URLSearchParams();
    params.append('S', ssid.value);
    params.append('T', security.value[0]);
    params.append('P', password.value);
    if (hidden.value) {
        params.append('H', hidden.value);
    }
    return `WIFI:${params.toString()}`;
}

// generate QR code
const generate = () => {
    const tabs = document.getElementById('type-selector') as Shoelace.SlTabGroup;
    const type = (tabs.querySelector('sl-tab[active]') as Shoelace.SlTab).panel;
    const qr = document.getElementById('qr') as Shoelace.SlQrCode;
    const errorCorrection = document.getElementById('error-correction') as Shoelace.SlSelect;
    qr.errorCorrection = errorCorrection.value[0] as 'L' | 'M' | 'Q' | 'H';
    console.log(type);
    let flag = false;
    const abort = () => {
        flag = true;
        return ''
    };
    let output = data[type](abort);
    if (flag) {
        console.warn('Invalid input');
        return;
    }
    if (output instanceof Shoelace.SlInput) {
        if (!output.reportValidity()) {
            return;
        }
        output = output.value;
    }
    if (output instanceof Shoelace.SlSelect) {
        if (!output.reportValidity()) {
            return;
        }
        output = output.value[0];
    }
    qr.hidden = false;
    qr.value = output;
}

document.getElementById('generate')!.addEventListener('click', generate);