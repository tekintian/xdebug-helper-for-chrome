# Xdebug Helper for Chrome

Xdebug调试助手 - 轻松启用/禁用PHP代码的调试、分析和跟踪功能

## 简介

Xdebug Helper 是一个Chrome浏览器扩展，专为PHP开发者设计，让使用 [Xdebug](http://xdebug.org/) 进行代码调试、性能分析和代码跟踪变得极其简单。

通过点击浏览器工具栏上的图标，你就可以快速切换Xdebug的调试模式，无需手动设置Cookie或修改URL参数。

## 主要特性

- ✅ **简单易用**：一键切换调试、分析、跟踪模式
- ✅ **Xdebug 3.x 支持**：原生支持 XDEBUG_SESSION_START URL 参数
- ✅ **多IDE兼容**：支持 VSCode、PHPStorm、IntelliJ IDEA、Eclipse、NetBeans 等
- ✅ **Manifest V3**：采用最新扩展标准，性能更优
- ✅ **零依赖**：纯原生JavaScript，无jQuery等外部库依赖
- ✅ **多标签页支持**：每个标签页独立控制调试状态

## 安装方式

### 开发版本（推荐）

1. 下载源码：[GitHub](https://github.com/tekintian/xdebug-helper-for-chrome/archive/master.zip)
2. 打开 Chrome，访问 `chrome://extensions/`
3. 开启右上角的「开发者模式」
4. 点击「加载已解压的扩展程序」
5. 选择解压后的源码目录

### Chrome Web Store

前往 [Chrome Web Store](https://chrome.google.com/webstore/detail/eadndfjplgieldjbigjakmdgkmoaaaoc) 安装最新版本。

## 版本历史

### Version 3.0.0

#### 重大重构与现代化
- **移除 jQuery 依赖**：全面采用原生 JavaScript，大幅减小扩展体积
- **移除 keymaster.js**：使用 Chrome 原生命令处理键盘快捷键
- **代码现代化**：使用 ES6+ 语法（async/await、箭头函数等）
- **UI 重设计**：简化界面，采用 CSS 图标替代图标字体
- **移除外部依赖**：不再依赖 Google Fonts 和 Material Icons

#### Bug 修复
- 修复消息端口关闭错误（Message port closed before response）
- 移除页面加载时自动启用Xdebug的逻辑，避免冲突
- 优化异步操作处理

### Version 2.0.0

#### Manifest V3 升级
- 升级到 Manifest V3，最低支持 Chrome 88
- 后台脚本改为 Service Worker
- 从 localStorage 迁移到 chrome.storage API

#### Xdebug 3.x 支持
- 新增 XDEBUG_SESSION_START URL 参数支持
- Cookie + URL 混合模式，保证页面导航时调试状态保持
- 完全向后兼容 Xdebug 2.x（Cookie模式）

#### 新功能
- IDE Key 预设选择（VSCode、PHPStorm、IntelliJ IDEA 等）
- 自定义 Trace/Profile 触发器
- 禁用弹窗选项，支持直接点击切换
- 增强的错误处理

## 快捷键

| 快捷键 | 功能 |
|--------|------|
| `Ctrl+Shift+X` (Mac: `Cmd+Shift+X`) | 打开扩展弹窗 |
| `Alt+Shift+X` | 直接切换调试状态 |

## 配置说明

### IDE Key 设置

从下拉菜单选择你的 IDE：

| IDE | IDE Key |
|-----|---------|
| Visual Studio Code | `vsc` |
| PhpStorm | `PHPSTORM` |
| IntelliJ IDEA | `idea` |
| Eclipse | `eclipse` |
| NetBeans | `netbeans-xdebug` |
| MacGDBp | `macgdbp` |
| 自定义 | 输入任意值 |

### 调试模式说明

| 状态 | 图标 | 说明 |
|------|------|------|
| 禁用 | 🐛 灰色 | 禁用所有Xdebug功能 |
| 调试 | 🐛 绿色 | 启用断点调试 |
| 分析 | ⏰ 蓝色 | 启用性能分析 |
| 跟踪 | 📄 紫色 | 启用代码跟踪 |

### Xdebug 3.x 模式

勾选「使用 XDEBUG_SESSION_START URL 参数」后：
- 首次触发时使用 `?XDEBUG_SESSION_START=<idekey>` URL参数
- 同时设置 Cookie 以保持页面导航时的调试状态
- 推荐 Xdebug 3.0 及以上版本使用

### 禁用弹窗

勾选此选项后：
- 点击扩展图标直接切换调试状态（不显示弹窗）
- 只支持在「调试」和「禁用」之间切换

## 工作原理

### 调试模式（Status 1）
- **Cookie 模式**：设置 `XDEBUG_SESSION=<idekey>` Cookie
- **URL 参数模式**：设置 `XDEBUG_SESSION=<idekey>` Cookie 并在URL中添加 `?XDEBUG_SESSION_START=<idekey>`，然后重新加载页面

### 分析模式（Status 2）
设置 `XDEBUG_PROFILE=<trigger>` Cookie 启用性能分析

### 跟踪模式（Status 3）
设置 `XDEBUG_TRACE=<trigger>` Cookie 启用代码跟踪

### 禁用模式（Status 0）
清除所有 Xdebug 相关的 Cookie 和 URL 参数，设置 `XDEBUG_DISABLED=1` Cookie

## 开发

### 贡献代码

欢迎提交 Issue 和 Pull Request！

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

### 项目结构

```
xdebug-helper-for-chrome/
├── source/
│   ├── manifest.json      # 扩展配置文件
│   ├── background.js      # Service Worker 后台脚本
│   ├── content.js         # 内容脚本（注入到网页）
│   ├── popup.js           # 弹窗逻辑
│   ├── popup.html         # 弹窗页面
│   ├── popup.css          # 弹窗样式
│   ├── options.js         # 选项页逻辑
│   ├── options.html       # 选项页面
│   ├── options.css        # 选项页样式
│   └── images/            # 图标资源
└── Readme.md
```

## Firefox 版本

Firefox 用户可以尝试 [BrianGilbert 开发的 Firefox 版本](https://github.com/BrianGilbert/xdebug-helper-for-firefox)。

## 许可证

本项目采用 [MIT 许可证](./source/License) 开源，可自由用于商业和非商业项目。

## 致谢

- [remailednet](http://blog.remailed.net) 创建了原始的 [XDebug Enabler](https://chrome.google.com/webstore/detail/eippbhbeglgcphcjmpjcjinjamabeoln)
- [Guilherme Pim](https://github.com/pimguilherme) 贡献了 Manifest V2 版本
- [所有贡献者](https://github.com/tekintian/xdebug-helper-for-chrome/graphs/contributors) 的代码贡献

## 相关链接

- [Xdebug 官方文档](https://xdebug.org/docs)
- [Chrome 扩展开发文档](https://developer.chrome.com/docs/extensions/)
- [GitHub 仓库](https://github.com/tekintian/xdebug-helper-for-chrome)
- [提交问题](https://github.com/tekintian/xdebug-helper-for-chrome/issues)
