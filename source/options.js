(function () {

	// setTimeout() return value
	let disablePopupTimeout;

	// Predefined IDE keys
	const PREDEFINED_IDE_KEYS = ["vsc", "idea", "eclipse", "netbeans-xdebug", "macgdbp", "PHPSTORM"];

	function save_options()
	{
		chrome.storage.local.set({
			"xdebugIdeKey": document.getElementById("idekey").value,
			"xdebugTraceTrigger": document.getElementById("tracetrigger").value,
			"xdebugProfileTrigger": document.getElementById("profiletrigger").value,
			"xdebugDisablePopup": document.getElementById('disable-popup').checked ? '1' : '0',
			"xdebugUseSessionStart": document.getElementById('use-session-start').checked ? '1' : '0'
		});
	}

	function restore_options()
	{
		chrome.storage.local.get(['xdebugIdeKey', 'xdebugTraceTrigger', 'xdebugProfileTrigger', 'xdebugDisablePopup', 'xdebugUseSessionStart'], function(result) {
			// Restore IDE Key
			idekey = result.xdebugIdeKey || "vsc";

			const isPredefined = PREDEFINED_IDE_KEYS.includes(idekey);

			$("#ide").val(isPredefined ? idekey : "null");
			$("#idekey").prop('disabled', isPredefined);
			$('#idekey').val(idekey);

			// Restore Trace Triggers
			$("#tracetrigger").val(result.xdebugTraceTrigger || "");

			// Restore Profile Triggers
			$("#profiletrigger").val(result.xdebugProfileTrigger || "");

			// Restore Disable Popup
			document.getElementById('disable-popup').checked = (result.xdebugDisablePopup === '1');

			// Restore Use Session Start (Xdebug 3.x)
			document.getElementById('use-session-start').checked = (result.xdebugUseSessionStart === '1');
		});
	}

	$(function()
	{
		$("#ide").change(function ()
		{
			if ($("#ide").val() != "null")
			{
				$("#idekey").prop('disabled', true);
				$("#idekey").val($("#ide").val());

				save_options();
			}
			else
			{
				$("#idekey").prop('disabled', false);
			}
		});

		$("#idekey").change(save_options);

		// Persist Disable Popup on onChange event
		$('#disable-popup').change(disablePopupChanged);

		// Persist Use Session Start on onChange event
		$('#use-session-start').change(save_options);

		$('.save-button').click(save_options);

		restore_options();
	});

	/**
	 * Disable Popup checkbox changed, persist it.
	 */
	function disablePopupChanged() {
		const $disablePopupSaved = $('.disable-popup-saved');

		$disablePopupSaved.addClass('show');

		// First clear interval
		clearInterval(disablePopupTimeout);
		// Hide after 2 seconds
		disablePopupTimeout = setTimeout(() => $disablePopupSaved.removeClass('show'), 2000);

		// Persist
		save_options();

		// In Manifest V3, we cannot reload the service worker directly.
		// The popup setting will be automatically updated via storage.onChanged listener in background.js.
	}

})();
