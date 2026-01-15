const DEFAULT_TRIGGER_VALUE = 'vsc';

const getSettings = async () => {
    return new Promise((resolve) => {
        chrome.storage.local.get({
            xdebugDebugTrigger: DEFAULT_TRIGGER_VALUE,
            xdebugTraceTrigger: DEFAULT_TRIGGER_VALUE,
            xdebugProfileTrigger: DEFAULT_TRIGGER_VALUE,
            xdebugDisablePopup: '0'
        }, resolve);
    });
};

const updateIcon = (status, tabId) => {
    const iconInfo = {
        0: { title: 'Debugging disabled', path: 'images/bug-gray.png' },
        1: { title: 'Debugging enabled', path: 'images/bug.png' },
        2: { title: 'Profiling enabled', path: 'images/clock.png' },
        3: { title: 'Tracing enabled', path: 'images/script.png' }
    }[status] || iconInfo[0];

    chrome.action.setTitle({ tabId, title: iconInfo.title });
    chrome.action.setIcon({ tabId, path: iconInfo.path });
};

chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
    if (changeInfo?.status !== 'complete' || !tab?.url?.startsWith('http')) {
        return;
    }

    try {
        const settings = await getSettings();
        const response = await chrome.tabs.sendMessage(tabId, {
            cmd: 'getStatus',
            debugTrigger: settings.xdebugDebugTrigger,
            traceTrigger: settings.xdebugTraceTrigger,
            profileTrigger: settings.xdebugProfileTrigger
        });
        updateIcon(response?.status ?? 0, tabId);
    } catch (error) {
        // Content script may not be ready, ignore
    }
});

chrome.commands.onCommand.addListener(async (command) => {
    if (command !== 'toggle_debug_action') return;

    try {
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        if (!tab) return;

        const response = await chrome.tabs.sendMessage(tab.id, {
            cmd: 'getStatus'
        });

        const currentStatus = response?.status ?? 0;
        const newStatus = (currentStatus === 1) ? 0 : 1;

        const setResponse = await chrome.tabs.sendMessage(tab.id, {
            cmd: 'setStatus',
            status: newStatus
        });
        updateIcon(setResponse?.status ?? newStatus, tab.id);
    } catch (error) {
        console.log('Error during command execution:', error);
    }
});

chrome.action.onClicked.addListener(async (tab) => {
    try {
        const response = await chrome.tabs.sendMessage(tab.id, {
            cmd: 'getStatus'
        });

        const currentStatus = response?.status ?? 0;
        const newStatus = (currentStatus === 1) ? 0 : 1;

        const setResponse = await chrome.tabs.sendMessage(tab.id, {
            cmd: 'setStatus',
            status: newStatus
        });
        updateIcon(setResponse?.status ?? newStatus, tab.id);
    } catch (error) {
        console.log('Error during action click:', error);
    }
});

chrome.runtime.onMessage.addListener((request) => {
    if (request.cmd !== 'updateIcon') return;

    const { status, tabId } = request;
    if (tabId) {
        updateIcon(status, tabId);
    }
});

const updatePopupSetting = (disablePopup) => {
    chrome.action.setPopup({
        popup: disablePopup === '1' ? '' : 'popup.html'
    });
};

chrome.storage.local.get({ xdebugDisablePopup: '0' }, (result) => {
    updatePopupSetting(result.xdebugDisablePopup);
});

chrome.storage.onChanged.addListener((changes, namespace) => {
    if (namespace === 'local' && changes.xdebugDisablePopup) {
        updatePopupSetting(changes.xdebugDisablePopup.newValue);
    }
});
