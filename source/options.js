const PREDEFINED_IDE_KEYS = ["vsc", "idea", "eclipse", "netbeans-xdebug", "macgdbp", "PHPSTORM"];

document.addEventListener('DOMContentLoaded', () => {
    const ideSelect = document.getElementById('ide');
    const idekeyInput = document.getElementById('idekey');
    const tracetriggerInput = document.getElementById('tracetrigger');
    const profiletriggerInput = document.getElementById('profiletrigger');
    const disablePopupCheckbox = document.getElementById('disable-popup');
    const useSessionStartCheckbox = document.getElementById('use-session-start');
    const saveButtons = document.querySelectorAll('.save-button');

    const saveOptions = () => {
        chrome.storage.local.set({
            xdebugIdeKey: idekeyInput.value || 'vsc',
            xdebugTraceTrigger: tracetriggerInput.value || '',
            xdebugProfileTrigger: profiletriggerInput.value || '',
            xdebugDisablePopup: disablePopupCheckbox.checked ? '1' : '0',
            xdebugUseSessionStart: useSessionStartCheckbox.checked ? '1' : '0'
        });
    };

    const restoreOptions = () => {
        chrome.storage.local.get({
            xdebugIdeKey: 'vsc',
            xdebugTraceTrigger: '',
            xdebugProfileTrigger: '',
            xdebugDisablePopup: '0',
            xdebugUseSessionStart: '0'
        }, (result) => {
            const ideKey = result.xdebugIdeKey || 'vsc';
            const isPredefined = PREDEFINED_IDE_KEYS.includes(ideKey);

            ideSelect.value = isPredefined ? ideKey : 'null';
            idekeyInput.disabled = isPredefined;
            idekeyInput.value = ideKey;
            tracetriggerInput.value = result.xdebugTraceTrigger || '';
            profiletriggerInput.value = result.xdebugProfileTrigger || '';
            disablePopupCheckbox.checked = result.xdebugDisablePopup === '1';
            useSessionStartCheckbox.checked = result.xdebugUseSessionStart === '1';
        });
    };

    ideSelect.addEventListener('change', () => {
        if (ideSelect.value !== 'null') {
            idekeyInput.disabled = true;
            idekeyInput.value = ideSelect.value;
            saveOptions();
        } else {
            idekeyInput.disabled = false;
        }
    });

    idekeyInput.addEventListener('change', saveOptions);
    tracetriggerInput.addEventListener('change', saveOptions);
    profiletriggerInput.addEventListener('change', saveOptions);
    disablePopupCheckbox.addEventListener('change', saveOptions);
    useSessionStartCheckbox.addEventListener('change', saveOptions);

    saveButtons.forEach(button => {
        button.addEventListener('click', saveOptions);
    });

    restoreOptions();
});
