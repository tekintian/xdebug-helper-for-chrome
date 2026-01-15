// Listen for messages from popup to update icon
chrome.runtime.onMessage.addListener(function(request, _sender, _sendResponse) {
	if (request.cmd === "updateIcon") {
		updateIcon(request.status, request.tabId);
	}
});

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab)
{
	// We only react on a complete load of a http(s) page,
	//  only then we're sure the content.js is loaded.
	if (changeInfo.status !== "complete" || tab.url.indexOf("http") !== 0)
	{
		return;
	}

	// Load settings from chrome.storage and update icon
	chrome.storage.local.get(['xdebugIdeKey', 'xdebugTraceTrigger', 'xdebugProfileTrigger', 'xdebugUseSessionStart'], function(result)
	{
		// Prep some variables
		var ideKey = result.xdebugIdeKey || "vsc",
			traceTrigger = result.xdebugTraceTrigger || ideKey,
			profileTrigger = result.xdebugProfileTrigger || ideKey,
			useSessionStart = result.xdebugUseSessionStart === '1';

		// Request the current status and update the icon accordingly
		chrome.tabs.sendMessage(
			tabId,
			{
				cmd: "getStatus",
				idekey: ideKey,
				traceTrigger: traceTrigger,
				profileTrigger: profileTrigger,
				useSessionStart: useSessionStart
			},
			function(response)
			{
				if (chrome.runtime.lastError) {
					console.log("Error: ", chrome.runtime.lastError);
					return;
				}

				// Update the icon
				updateIcon(response.status, tabId);
			}
		);
	});
});

chrome.commands.onCommand.addListener(function(command)
{
	if ('toggle_debug_action' == command)
	{
		// Load settings from chrome.storage
		chrome.storage.local.get(['xdebugIdeKey', 'xdebugTraceTrigger', 'xdebugProfileTrigger', 'xdebugDisablePopup', 'xdebugUseSessionStart'], function(result)
		{
			var ideKey = result.xdebugIdeKey || "vsc";
			var traceTrigger = result.xdebugTraceTrigger || ideKey;
			var profileTrigger = result.xdebugProfileTrigger || ideKey;
			var useSessionStart = result.xdebugUseSessionStart === '1';

			// Fetch the active tab
			chrome.tabs.query({ active: true, currentWindow: true }, function(tabs)
			{
				// Do nothing when there is no active tab atm
				if (tabs.length == 0) {
					return;
				}

				// Get the current state
				chrome.tabs.sendMessage(
					tabs[0].id,
					{
						cmd: "getStatus",
						idekey: ideKey,
						traceTrigger: traceTrigger,
						profileTrigger: profileTrigger,
						useSessionStart: useSessionStart
					},
					function(response)
					{
						// Get new status by current status
						const newStatus = getNewStatus(response.status, result.xdebugDisablePopup);

						chrome.tabs.sendMessage(
							tabs[0].id,
							{
								cmd: "setStatus",
								status: newStatus,
								idekey: ideKey,
								traceTrigger: traceTrigger,
								profileTrigger: profileTrigger,
								useSessionStart: useSessionStart
							},
							function(response)
							{
								// Update the icon
								updateIcon(response.status, tabs[0].id);
							}
						);
					}
				);
			});
		});
	}
});

// Will not be called, if popup is disabled, so not needed to wrap this in a if statement
chrome.action.onClicked.addListener((tab) => {
	// Load settings from chrome.storage
	chrome.storage.local.get(['xdebugIdeKey', 'xdebugTraceTrigger', 'xdebugProfileTrigger', 'xdebugDisablePopup', 'xdebugUseSessionStart'], function(result)
	{
		var ideKey = result.xdebugIdeKey || "vsc";
		var traceTrigger = result.xdebugTraceTrigger || ideKey;
		var profileTrigger = result.xdebugProfileTrigger || ideKey;
		var useSessionStart = result.xdebugUseSessionStart === '1';

		// Get the current state
		chrome.tabs.sendMessage(
			tab.id,
			{
				cmd: "getStatus",
				idekey: ideKey,
				traceTrigger: traceTrigger,
				profileTrigger: profileTrigger,
				useSessionStart: useSessionStart
			},
			function(response)
			{
				// Get new status by current status
				const newStatus = getNewStatus(response.status, result.xdebugDisablePopup);

				chrome.tabs.sendMessage(
					tab.id,
					{
						cmd: "setStatus",
						status: newStatus,
						idekey: ideKey,
						traceTrigger: traceTrigger,
						profileTrigger: profileTrigger,
						useSessionStart: useSessionStart
					},
					function(response)
					{
						// Update the icon
						updateIcon(response.status, tab.id);
					}
				);
			}
		);
	});
});

/**
 * Get new status by current status.
 *
 * @param {number} status - Current status from sendMessage() cmd: 'getStatus'.
 * @param {string} disablePopup - Whether popup is disabled.
 *
 * @returns {number}
 */
function getNewStatus(status, disablePopup) {
	// Reset status, when trace or profile is selected and popup is disabled
	if ((disablePopup === '1')
		&& ((status === 2) || (status === 3))
	) {
		return 0;
	}

	// If state is debugging (1) toggle to disabled (0), else toggle to debugging
	return (status === 1) ? 0 : 1;
}

function updateIcon(status, tabId)
{
	// Load settings to check if popup is disabled
	chrome.storage.local.get(['xdebugDisablePopup'], function(result) {
		// Reset status, when trace or profile is selected and popup is disabled
		if ((result.xdebugDisablePopup === '1')
			&& ((status === 2) || (status === 3))
		) {
			status = 0;
		}

		// Figure the correct title / image by the given state
		let image = "images/bug-gray.png";
		let title = (result.xdebugDisablePopup === '1')
			? 'Debugging disabled' : 'Debugging, profiling & tracing disabled';

		if (status == 1)
		{
			title = "Debugging enabled";
			image = "images/bug.png";
		}
		else if (status == 2)
		{
			title = "Profiling enabled";
			image = "images/clock.png";
		}
		else if (status == 3)
		{
			title = "Tracing enabled";
			image = "images/script.png";
		}

		// Update title
		chrome.action.setTitle({
			tabId: tabId,
			title: title
		});

		// Update image
		chrome.action.setIcon({
			tabId: tabId,
			path: image
		});
	});
}

/**
 * @deprecated
 * @todo to remove silver
 */
function isValueInArray(arr, val)
{
	for (i = 0; i < arr.length; i++)
	{
		var re = new RegExp(arr[i], "gi");
		if (re.test(val))
		{
			return true;
		}
	}

	return false;
}

// Disable / Enable Popup by chrome.storage
chrome.storage.local.get(['xdebugDisablePopup'], function(result) {
	if (result.xdebugDisablePopup === '1') {
		chrome.action.setPopup({
			popup: '',
		});
	} else {
		chrome.action.setPopup({
			popup: 'popup.html',
		});
	}
});

// Listen for storage changes to update popup setting dynamically
chrome.storage.onChanged.addListener(function(changes, namespace) {
	if (namespace === 'local' && changes.xdebugDisablePopup) {
		if (changes.xdebugDisablePopup.newValue === '1') {
			chrome.action.setPopup({
				popup: '',
			});
		} else {
			chrome.action.setPopup({
				popup: 'popup.html',
			});
		}
	}
});
