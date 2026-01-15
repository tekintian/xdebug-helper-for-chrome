# Xdebug Helper for Chrome

Easy debugging, profiling and tracing for PHP with Xdebug

## Overview

Xdebug Helper is a Chrome extension designed for PHP developers that makes it incredibly easy to enable or disable [Xdebug](http://xdebug.org/) debugging, profiling, and tracing.

Simply click the icon in your browser toolbar to quickly switch between Xdebug modes without manually setting cookies or modifying URL parameters.

## Key Features

- ✅ **Simple to Use**: One-click toggle between debug, profile, and trace modes
- ✅ **Xdebug 3.x Support**: Native support for XDEBUG_SESSION_START URL parameter
- ✅ **Multi-IDE Compatible**: Supports VSCode, PhpStorm, IntelliJ IDEA, Eclipse, NetBeans, and more
- ✅ **Manifest V3**: Built with the latest extension standards for better performance
- ✅ **Zero Dependencies**: Pure native JavaScript, no jQuery or external libraries
- ✅ **Multi-tab Support**: Independent debug state control for each tab

## Installation

### Development Version (Recommended)

1. Download the source code: [GitHub](https://github.com/tekintian/xdebug-helper-for-chrome/archive/master.zip)
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode" (toggle in the top right corner)
4. Click "Load unpacked"
5. Select the extracted source directory

### Chrome Web Store

Visit the [Chrome Web Store](https://chrome.google.com/webstore/detail/eadndfjplgieldjbigjakmdgkmoaaaoc) to install the latest version.

## Changelog

### Version 3.0.0

#### Major Refactoring & Modernization
- **Removed jQuery Dependency**: Full migration to native JavaScript, significantly reducing extension size
- **Removed keymaster.js**: Using Chrome's native commands for keyboard shortcuts
- **Code Modernization**: ES6+ syntax (async/await, arrow functions, etc.)
- **UI Redesign**: Simplified interface with CSS-based icons
- **No External Dependencies**: No longer depends on Google Fonts or Material Icons

#### Bug Fixes
- Fixed message port closure errors
- Removed auto-enable Xdebug logic on page load to prevent conflicts
- Optimized async operation handling

### Version 2.0.0

#### Manifest V3 Upgrade
- Upgraded to Manifest V3, minimum Chrome version 88
- Background script changed to Service Worker
- Migrated from localStorage to chrome.storage API

#### Xdebug 3.x Support
- Added XDEBUG_SESSION_START URL parameter support
- Cookie + URL hybrid mode to maintain debug state during page navigation
- Full backward compatibility with Xdebug 2.x (Cookie mode)

#### New Features
- IDE Key presets (VSCode, PhpStorm, IntelliJ IDEA, etc.)
- Custom Trace/Profile trigger values
- Disable popup option for direct click-to-toggle
- Enhanced error handling

## Keyboard Shortcuts

| Shortcut | Function |
|----------|----------|
| `Ctrl+Shift+X` (Mac: `Cmd+Shift+X`) | Open extension popup |
| `Alt+Shift+X` | Directly toggle debug state |

## Configuration

### IDE Key Settings

Select your IDE from the dropdown menu:

| IDE | IDE Key |
|-----|---------|
| Visual Studio Code | `vsc` |
| PhpStorm | `PHPSTORM` |
| IntelliJ IDEA | `idea` |
| Eclipse | `eclipse` |
| NetBeans | `netbeans-xdebug` |
| MacGDBp | `macgdbp` |
| Custom | Enter any value |

### Debug Mode Status

| Status | Icon | Description |
|--------|------|-------------|
| Disabled | 🐛 Gray | All Xdebug functions disabled |
| Debug | 🐛 Green | Enable breakpoint debugging |
| Profile | ⏰ Blue | Enable performance profiling |
| Trace | 📄 Purple | Enable code tracing |

### Xdebug 3.x Mode

When "Use XDEBUG_SESSION_START URL parameter" is enabled:
- Initial trigger uses `?XDEBUG_SESSION_START=<idekey>` URL parameter
- Also sets cookies to maintain debug state during page navigation
- Recommended for Xdebug 3.0 and later versions

### Disable Popup

When this option is checked:
- Clicking the extension icon toggles debug state directly (no popup)
- Only toggles between "Debug" and "Disabled" modes

## How It Works

### Debug Mode (Status 1)
- **Cookie Mode**: Sets `XDEBUG_SESSION=<idekey>` cookie
- **URL Parameter Mode**: Sets `XDEBUG_SESSION=<idekey>` cookie AND adds `?XDEBUG_SESSION_START=<idekey>` to URL, then reloads the page

### Profile Mode (Status 2)
Sets `XDEBUG_PROFILE=<trigger>` cookie to enable performance profiling

### Trace Mode (Status 3)
Sets `XDEBUG_TRACE=<trigger>` cookie to enable code tracing

### Disabled Mode (Status 0)
Clears all Xdebug-related cookies and URL parameters, sets `XDEBUG_DISABLED=1` cookie

## Development

### Contributing

Issues and Pull Requests are welcome!

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Project Structure

```
xdebug-helper-for-chrome/
├── source/
│   ├── manifest.json      # Extension manifest
│   ├── background.js      # Service Worker script
│   ├── content.js         # Content script (injected into pages)
│   ├── popup.js           # Popup logic
│   ├── popup.html         # Popup page
│   ├── popup.css          # Popup styles
│   ├── options.js         # Options page logic
│   ├── options.html       # Options page
│   ├── options.css        # Options page styles
│   └── images/            # Icon resources
└── Readme.md
```

## Firefox Version

Firefox users can try the [Firefox version developed by BrianGilbert](https://github.com/BrianGilbert/xdebug-helper-for-firefox).

## License

This project is licensed under the [MIT License](./source/License), free for use in both commercial and non-commercial projects.

## Acknowledgments

- [remailednet](http://blog.remailed.net) for creating the original [XDebug Enabler](https://chrome.google.com/webstore/detail/eippbhbeglgcphcjmpjcjinjamabeoln)
- [Guilherme Pim](https://github.com/pimguilherme) for contributing the Manifest V2 version
- [All contributors](https://github.com/tekintian/xdebug-helper-for-chrome/graphs/contributors) for their code contributions

## Related Links

- [Xdebug Official Documentation](https://xdebug.org/docs)
- [Chrome Extensions Documentation](https://developer.chrome.com/docs/extensions/)
- [GitHub Repository](https://github.com/tekintian/xdebug-helper-for-chrome)
- [Report Issues](https://github.com/tekintian/xdebug-helper-for-chrome/issues)
