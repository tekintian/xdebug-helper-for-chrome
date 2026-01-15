const DEFAULT_TRIGGER_VALUE = 'vsc';

const getCookie = name =>
    document.cookie.split(';').find(cookie => cookie.trim().startsWith(`${name}=`))?.split('=')[1];

const setCookie = (name, value, days = 365) =>
    document.cookie = `${name}=${value};expires=${new Date(Date.now() + days * 24 * 60 * 60 * 1000).toUTCString()};path=/`;

const deleteCookie = (name) => setCookie(name, null, -1);

const getUrlParameter = name => {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
};

const reloadWithSessionStart = (idekey) => {
    const url = new URL(window.location.href);
    url.searchParams.delete('XDEBUG_SESSION_START');
    url.searchParams.set('XDEBUG_SESSION_START', idekey);
    setTimeout(() => {
        window.location.href = url.toString();
    }, 100);
};

const reloadWithoutSessionStart = () => {
    const url = new URL(window.location.href);
    url.searchParams.delete('XDEBUG_SESSION_START');
    setTimeout(() => {
        window.location.href = url.toString();
    }, 100);
};

const getStatusMap = (settings) => {
    const { xdebugDebugTrigger, xdebugTraceTrigger, xdebugProfileTrigger, xdebugUseSessionStart } = settings;
    return {
        1: { name: 'XDEBUG_SESSION', trigger: xdebugDebugTrigger, useSessionStart: xdebugUseSessionStart === '1' },
        2: { name: 'XDEBUG_PROFILE', trigger: xdebugProfileTrigger, useSessionStart: false },
        3: { name: 'XDEBUG_TRACE', trigger: xdebugTraceTrigger, useSessionStart: false },
    };
};

const getCurrentStatus = async () => {
    const settings = await new Promise(resolve => {
        chrome.storage.local.get({
            xdebugDebugTrigger: DEFAULT_TRIGGER_VALUE,
            xdebugTraceTrigger: DEFAULT_TRIGGER_VALUE,
            xdebugProfileTrigger: DEFAULT_TRIGGER_VALUE,
            xdebugUseSessionStart: '0'
        }, resolve);
    });

    const statusMap = getStatusMap(settings);

    // Check for XDEBUG_SESSION_START parameter in URL (debugging mode)
    if (statusMap[1].useSessionStart && getUrlParameter('XDEBUG_SESSION_START') === statusMap[1].trigger) {
        return 1;
    }

    // Fallback to cookie method
    for (const [idx, { name, trigger }] of Object.entries(statusMap)) {
        if (getCookie(name) === trigger) {
            return +idx;
        }
    }

    return 0;
};

const setStatus = async (status) => {
    const settings = await new Promise(resolve => {
        chrome.storage.local.get({
            xdebugDebugTrigger: DEFAULT_TRIGGER_VALUE,
            xdebugTraceTrigger: DEFAULT_TRIGGER_VALUE,
            xdebugProfileTrigger: DEFAULT_TRIGGER_VALUE,
            xdebugUseSessionStart: '0'
        }, resolve);
    });

    const statusMap = getStatusMap(settings);

    // Delete all Xdebug cookies first
    for (const { name } of Object.values(statusMap)) {
        deleteCookie(name);
    }

    if (status === 1) {
        const { name, trigger, useSessionStart } = statusMap[1];
        if (useSessionStart) {
            setCookie(name, trigger);
            reloadWithSessionStart(trigger);
        } else {
            setCookie(name, trigger);
        }
    } else if (status === 2) {
        const { name, trigger } = statusMap[2];
        setCookie(name, trigger);
    } else if (status === 3) {
        const { name, trigger } = statusMap[3];
        setCookie(name, trigger);
    } else {
        setCookie('XDEBUG_DISABLED', '1');
        if (statusMap[1].useSessionStart && getUrlParameter('XDEBUG_SESSION_START')) {
            reloadWithoutSessionStart();
        }
    }
};

chrome.runtime.onMessage.addListener((msg, _, sendResponse) => {
    (async () => {
        try {
            switch (msg.cmd) {
                case 'getStatus':
                    const status = await getCurrentStatus();
                    sendResponse({ status });
                    break;
                case 'setStatus':
                    await setStatus(msg.status);
                    sendResponse({ status: msg.status });
                    break;
                default:
                    sendResponse({ status: 0 });
            }
        } catch (error) {
            console.log('Error in content script:', error);
            sendResponse({ status: 0 });
        }
    })();
    return true;
});
