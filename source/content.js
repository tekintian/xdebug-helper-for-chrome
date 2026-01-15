var xdebug = (function() {
	// Set a cookie
	function setCookie(name, value, days)
	{
		var exp = new Date();
		exp.setTime(exp.getTime() + (days * 24 * 60 * 60 * 1000));
		document.cookie = name + "=" + value + "; expires=" + exp.toGMTString() + "; path=/";
	}

	// Get the content in a cookie
	function getCookie(name)
	{
		// Search for the start of the goven cookie
		var prefix = name + "=",
			cookieStartIndex = document.cookie.indexOf(prefix),
			cookieEndIndex;

		// If the cookie is not found return null
		if (cookieStartIndex == -1)
		{
			return null;
		}

		// Look for the end of the cookie
		cookieEndIndex = document.cookie.indexOf(";", cookieStartIndex + prefix.length);
		if (cookieEndIndex == -1)
		{
			cookieEndIndex = document.cookie.length;
		}

		// Extract the cookie content
		return decodeURIComponent(document.cookie.substring(cookieStartIndex + prefix.length, cookieEndIndex));
	}

	// Remove a cookie
	function deleteCookie(name)
	{
		setCookie(name, null, -1);
	}

	// Get URL parameter
	function getUrlParameter(name)
	{
		var regex = new RegExp('[?&]' + name + '=([^&#]*)', 'i');
		var results = regex.exec(window.location.href);
		return results === null ? null : results[1];
	}

	// Reload page with XDEBUG_SESSION_START parameter
	function reloadWithSessionStart(idekey)
	{
		var url = new URL(window.location.href);
		// Clear any existing Xdebug URL parameters
		url.searchParams.delete('XDEBUG_SESSION_START');
		url.searchParams.delete('XDEBUG_PROFILE');
		url.searchParams.delete('XDEBUG_TRACE');
		// Set the new session start parameter
		url.searchParams.set('XDEBUG_SESSION_START', idekey);
		// Delay reload to allow message response to be sent
		setTimeout(function() {
			window.location.href = url.toString();
		}, 100);
	}

	// Public methods
	var exposed = {
		// Handles messages from other extension parts
		messageListener : function(request, _sender, sendResponse)
		{
			var newStatus,
				idekey = "vsc",
				traceTrigger = idekey,
				profileTrigger = idekey,
				useSessionStart = false;

			// Use the IDE key from the request, if any is given
			if (request.idekey)
			{
				idekey = request.idekey;
			}
			if (request.traceTrigger)
			{
				traceTrigger = request.traceTrigger;
			}
			if (request.profileTrigger)
			{
				profileTrigger = request.profileTrigger;
			}
			if (request.useSessionStart)
			{
				useSessionStart = request.useSessionStart;
			}

			// Execute the requested command
			if (request.cmd == "getStatus")
			{
				newStatus = exposed.getStatus(idekey, traceTrigger, profileTrigger, useSessionStart);
			}
			else if (request.cmd == "toggleStatus")
			{
				newStatus = exposed.toggleStatus(idekey, traceTrigger, profileTrigger, useSessionStart);
			}
			else if (request.cmd == "setStatus")
			{
				newStatus = exposed.setStatus(request.status, idekey, traceTrigger, profileTrigger, useSessionStart);
			}

			// Respond with the current status
			sendResponse({ status: newStatus });
		},

	// Get current state
	getStatus : function(idekey, traceTrigger, profileTrigger, useSessionStart)
	{
		var status = 0;

		// Check for XDEBUG_SESSION_START parameter in URL (debugging mode)
		if (useSessionStart && getUrlParameter('XDEBUG_SESSION_START') == idekey)
		{
			status = 1;
		}
		// Fallback to cookie method for debugging
		else if (getCookie("XDEBUG_SESSION") == idekey)
		{
			status = 1;
		}
		// Check for profiling
		else if (getCookie("XDEBUG_PROFILE") == profileTrigger)
		{
			status = 2;
		}
		// Check for tracing
		else if (getCookie("XDEBUG_TRACE") == traceTrigger)
		{
			status = 3;
		}

		return status;
	},

		// Toggle to the next state
		toggleStatus : function(idekey, traceTrigger, profileTrigger, useSessionStart)
		{
			var nextStatus = (exposed.getStatus(idekey, traceTrigger, profileTrigger, useSessionStart) + 1) % 4;
			return exposed.setStatus(nextStatus, idekey, traceTrigger, profileTrigger, useSessionStart);
		},

	// Set the state
	setStatus : function(status, idekey, traceTrigger, profileTrigger, useSessionStart)
	{
		if (status == 1)
		{
			// Set debugging on
			if (useSessionStart)
			{
				// Use XDEBUG_SESSION_START parameter (Xdebug 3.x preferred method)
				// Also set cookie to maintain session during navigation
				setCookie("XDEBUG_SESSION", idekey, 365);
				reloadWithSessionStart(idekey);
			}
			else
			{
				// Use cookie method (Xdebug 2.x compatible)
				setCookie("XDEBUG_SESSION", idekey, 365);
			}
			// Clear other states
			deleteCookie("XDEBUG_PROFILE");
			deleteCookie("XDEBUG_TRACE");
			deleteCookie("XDEBUG_DISABLED");
		}
		else if (status == 2)
		{
			// Set profiling on
			deleteCookie("XDEBUG_SESSION");
			setCookie("XDEBUG_PROFILE", profileTrigger, 365);
			deleteCookie("XDEBUG_TRACE");
			deleteCookie("XDEBUG_DISABLED");
		}
		else if (status == 3)
		{
			// Set tracing on
			deleteCookie("XDEBUG_SESSION");
			deleteCookie("XDEBUG_PROFILE");
			setCookie("XDEBUG_TRACE", traceTrigger, 365);
			deleteCookie("XDEBUG_DISABLED");
		}
		else
		{
			// Disable all Xdebug functions
			deleteCookie("XDEBUG_SESSION");
			deleteCookie("XDEBUG_PROFILE");
			deleteCookie("XDEBUG_TRACE");
			deleteCookie("XDEBUG_DISABLED");
			setCookie("XDEBUG_DISABLED", 1);

			// Remove XDEBUG_SESSION_START parameter from URL if present
			if (useSessionStart && getUrlParameter('XDEBUG_SESSION_START'))
			{
				var url = new URL(window.location.href);
				url.searchParams.delete('XDEBUG_SESSION_START');
				// Delay reload to allow message response to be sent
				setTimeout(function() {
					window.location.href = url.toString();
				}, 100);
			}
		}

		// Return the new status
		return exposed.getStatus(idekey, traceTrigger, profileTrigger, useSessionStart);
	}
	};

	return exposed;
})();

// Attach the message listener
chrome.runtime.onMessage.addListener(xdebug.messageListener);
// 默认开启xdebug
if(document.cookie.indexOf("XDEBUG_DISABLED=1")<0){
	xdebug.setStatus(1,'vsc');
}
