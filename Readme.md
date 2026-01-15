XDebug Helper for Google Chrome
===============================

Debugging, profiling and tracing PHP code with [Xdebug](http://xdebug.org/) is very powerful, but enabling
Xdebug with cookies or adding POST/GET variables is way too hard. This extension will help you to enable/disable
debugging, profiling and tracing of your PHP-code easily.

## What's New in Version 2.1.0

### Code Refactoring & Modernization
- **Removed jQuery Dependency**: Migrated to native JavaScript for better performance and smaller bundle size
- **Removed keymaster.js**: Removed keyboard shortcut library (keyboard shortcuts now handled by Chrome's native commands)
- **Cleaner Codebase**: Simplified and refactored all JavaScript files for better maintainability
- **Modern ES6+ Syntax**: Used async/await, arrow functions, and other modern JavaScript features

### UI/UX Improvements
- **Updated Popup Design**: Simplified popup with radio buttons and custom icons
- **Removed External Dependencies**: No longer relies on Google Fonts or Material Icons
- **System Font Stack**: Using native system fonts for better performance and consistency
- **CSS-Based Icons**: Using background images for icons instead of icon fonts

### Bug Fixes
- **Fixed Message Port Closure Error**: Properly handles async operations to prevent "The message port closed before a response was received" errors
- **Improved Error Handling**: Better error handling throughout the codebase
- **Removed Auto-Enable Logic**: Removed automatic Xdebug enable on page load to prevent conflicts

## What's New in Version 2.0.0

### Manifest V3 Upgrade
- **Upgraded to Manifest V3**: The extension now uses Chrome's latest extension manifest format (Manifest V3)
- **Minimum Chrome version**: Requires Chrome 88 or later
- **Service Worker**: Background script now runs as a service worker for better performance
- **Chrome Storage API**: Migrated from localStorage to chrome.storage for improved data management

### Xdebug 3.x Support
- **XDEBUG_SESSION_START URL Parameter**: Added support for Xdebug 3.x's recommended URL parameter method
- **Cookie + URL Hybrid Mode**: When using XDEBUG_SESSION_START, the extension also sets cookies to maintain debugging state during page navigation
- **Backward Compatibility**: Full backward compatibility with Xdebug 2.x (cookie-based mode)

### New Features
- **IDE Key Selection**: Choose from predefined IDE keys (VSCode, IntelliJ IDEA, Eclipse, NetBeans, MacGDBp, PhpStorm) or use a custom key
- **Trace & Profile Triggers**: Configure custom trigger keys for profiling and tracing
- **Disable Popup Option**: Option to disable popup and use direct click-to-toggle functionality
- **Enhanced Error Handling**: Improved error handling for edge cases and better user experience

### Technical Improvements
- **Code Optimization**: Refactored code for better maintainability and readability
- **Simplified Conditionals**: Replaced multiple OR conditions with array-based checks
- **Bug Fixes**: Fixed issues with cookie synchronization and URL parameter handling
- **Async Response Handling**: Proper async handling to prevent message port closure errors

## Hotkeys
-------
Ctrl+Shift+X (Cmd+Shift+X on Mac) opens the popup.
Alt+Shift+X toggles the debugging state.

## How to Install
------------------------------
**Stable version:** Go to the [Google Chrome Web Store](https://chrome.google.com/webstore/detail/eadndfjplgieldjbigjakmdgkmoaaaoc)
and click "Add to Chrome".

**Development version:** [Download the source from GitHub](https://github.com/tekintian/xdebug-helper-for-chrome/archive/master.zip)
and [load the extension into Chrome](https://developer.chrome.com/docs/extensions/mv3/getstarted/#unpacked)
yourself!

### Installation Steps for Development Version
1. Download and extract the source code
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode" (toggle in the top right corner)
4. Click "Load unpacked" button
5. Select the extracted folder

## Configuration Options
--------------------
The extension provides several configuration options accessible via the options page:

### IDE Key
Select your IDE from the dropdown:
- Visual Studio Code (`vsc`)
- IntelliJ IDEA (`idea`)
- Eclipse (`eclipse`)
- NetBeans (`netbeans-xdebug`)
- MacGDBp (`macgdbp`)
- PhpStorm (`PHPSTORM`)
- Other (custom IDE key)

### Trace & Profile Trigger Values
Configure custom trigger keys for profiling and tracing if your Xdebug setup requires unique values.

### Xdebug 3.x Mode
Enable "Use XDEBUG_SESSION_START URL parameter" to use Xdebug 3.x's recommended method. This mode:
- Uses URL parameter `?XDEBUG_SESSION_START=<idekey>` for initial debugging trigger
- Sets cookies to maintain debugging state during page navigation
- Recommended for Xdebug 3.0 and later versions

### Disable Popup
Check this option to disable the popup menu. When enabled, clicking the extension icon will toggle debugging state directly without showing the popup.

## How It Works
---------------

### Debugging Mode (Status 1)
The extension enables debugging by:
- **Cookie Mode (Xdebug 2.x)**: Sets `XDEBUG_SESSION=<idekey>` cookie
- **URL Parameter Mode (Xdebug 3.x)**: Sets `XDEBUG_SESSION=<idekey>` cookie AND adds `?XDEBUG_SESSION_START=<idekey>` to URL and reloads the page

### Profiling Mode (Status 2)
Sets `XDEBUG_PROFILE=<trigger>` cookie to enable Xdebug profiling

### Tracing Mode (Status 3)
Sets `XDEBUG_TRACE=<trigger>` cookie to enable Xdebug code tracing

### Disabled Mode (Status 0)
Clears all Xdebug-related cookies and URL parameters, then sets `XDEBUG_DISABLED=1` cookie

## Contributing
--------------------
### How to contribute?
A: [Submit issues and ideas](https://github.com/tekintian/xdebug-helper-for-chrome/issues)

B: [Submit a pull request](https://help.github.com/articles/using-pull-requests)

1. Fork this repo and create a branch
2. Commit and push your changes to your branch
3. When you're happy send us a pull request!

_**Pro-tip:** Make sure to build upon the latest version of the code and keep pull request as small as possible. This makes your pull request easy to merge._

## Firefox Support
-------------------------
There is also [Firefox version](https://github.com/BrianGilbert/xdebug-helper-for-firefox) created by BrianGilbert that you could try.

## License
-------
The code of this project is licensed under the [MIT license](https://raw.github.com/mac-cain13/xdebug-helper-for-chrome/master/source/License)
so you can use it in nearly every project you want, commercial and non-commercial.

## Special Thanks
--------------
* [remailednet](http://blog.remailed.net) for creating the original [XDebug Enabler](https://chrome.google.com/webstore/detail/eippbhbeglgcphcjmpjcjinjamabeoln) for Chrome
* [Guilherme Pim](https://github.com/pimguilherme) for contributing a Manifest V2 version
* [All contributors](https://github.com/tekintian/xdebug-helper-for-chrome/graphs/contributors) for taking the time to create a pull request
