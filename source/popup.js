$(function() {
	var ideKey = "vsc";
	var traceTrigger = ideKey;
	var profileTrigger = ideKey;
	var useSessionStart = false;

	// Get the ideKey from chrome.storage
	chrome.storage.local.get(['xdebugIdeKey', 'xdebugTraceTrigger', 'xdebugProfileTrigger', 'xdebugUseSessionStart'], function(result) {
		ideKey = result.xdebugIdeKey || "vsc";
		traceTrigger = result.xdebugTraceTrigger || ideKey;
		profileTrigger = result.xdebugProfileTrigger || ideKey;
		useSessionStart = result.xdebugUseSessionStart === '1';

		// Request the current state from the active tab
		chrome.tabs.query({ active: true, currentWindow: true }, function(tabs)
		{
			if (tabs.length > 0 && tabs[0].url && tabs[0].url.startsWith("http")) {
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
						if (chrome.runtime.lastError) {
							console.log("Error: ", chrome.runtime.lastError.message);
							return;
						}

						// Highlight correct option
						if (response && response.status !== undefined) {
							$('a[data-status="' + response.status + '"]').addClass("active");
						}
					}
				);
			}
		});
	});

	// Attach handler when user clicks on
	$("a").on("click", function(_eventObject) {
		var newStatus = $(this).data("status");

		// Set the new state on the active tab
		chrome.tabs.query({ active: true, currentWindow: true }, function(tabs)
		{
			if (tabs.length > 0 && tabs[0].url && tabs[0].url.startsWith("http")) {
				chrome.tabs.sendMessage(
					tabs[0].id,
					{
						cmd: "setStatus",
						status: newStatus,
						idekey: ideKey,
						traceTrigger : traceTrigger,
						profileTrigger : profileTrigger,
						useSessionStart : useSessionStart
					},
					function(response)
					{
						if (chrome.runtime.lastError) {
							console.log("Error: ", chrome.runtime.lastError.message);
							window.close();
							return;
						}

						// In Manifest V3, we cannot access the background page directly.
						// Instead, we send a message to the service worker to update the icon.
						if (response && response.status !== undefined) {
							chrome.runtime.sendMessage({
								cmd: "updateIcon",
								status: response.status,
								tabId: tabs[0].id
							}, function() {
								window.close();
							});
						} else {
							window.close();
						}
					}
				);
			} else {
				// Close popup if not on a valid page
				window.close();
			}
		});
	});

	// Shortcuts
	key("d", function() { $("#action-debug").click(); });
	key("p", function() { $("#action-profile").click(); });
	key("t", function() { $("#action-trace").click(); });
	key("s", function() { $("#action-disable").click(); });
	key("space,enter", function() { $("a:focus").click(); });
	key("down,right", function()
	{
		var current = $(".action:focus");
		if (current.length === 0)
		{
			$(".action:first").focus();
		}
		else
		{
			current.parent().next().find("a").focus();
		}
	});
	key("up,left", function()
	{
		var current = $(".action:focus");
		if (current.length === 0)
		{
			$(".action:last").focus();
		}
		else
		{
			current.parent().prev().find("a").focus();
		}
	});

	// Bit of a hack to prevent Chrome from focussing the first option automaticly
	$("a").on("focus", function()
	{
		$(this).blur();
		$("a").off("focus");
	});
});
