# TIA Portal Style React Application

A TIA Portal-style hierarchical tree data table application with classic Windows styling. Simulates the look and feel of Siemens TIA Portal's variable table interface.

---

## Table of Contents

1. [Getting Started](#getting-started)
2. [Testing and Verification](#testing-and-verification)
3. [Features](#features)
4. [Project Structure](#project-structure)
5. [Architecture](#architecture)
6. [中文文档](#中文文档)

---

## Getting Started

### Prerequisites

- **Node.js**: Version 18.0 or higher
  - Download from [nodejs.org](https://nodejs.org/)
  - Verify installation: `node --version`
  - Verify npm: `npm --version`

### Installation

1. **Clone or download the project**
   ```bash
   cd TiaPortalTableTest
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```
   The application will be available at `http://localhost:5173`

### Available Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Build for production (output to `dist/`) |
| `npm run preview` | Preview production build locally |
| `npm run test` | Run tests in watch mode |
| `npm run test:run` | Run the full test suite once |
| `npm run test:coverage` | Run tests and generate coverage report |

---

## Testing and Verification

This project uses **Vitest** with **React Testing Library** and **jsdom** for unit and component testing.

### Test Coverage

Current tests cover:

- Shared table helper functions in `tableStoreUtils.ts`
- Cell editing behavior in `useCellEdit.js`
- Home page navigation links in `App.jsx`
- Flat Ant Design table rendering, row-number visibility, invalid row filtering, row click handling, and selected-row styling in `AntTable.jsx`

### Run Tests

```bash
npm run test:run
```

For interactive watch mode during development:

```bash
npm run test
```

To generate coverage:

```bash
npm run test:coverage
```

### Build Verification

Before submitting changes, run both tests and production build:

```bash
npm run test:run
npm run build
```

Both commands should complete successfully.

---

## Features

### Page Navigation

- **Home Page**: Project introduction and navigation links
- **Flat Table Mode**: Simple table without hierarchy
- **Tree Table Mode**: Hierarchical tree table with parent-child relationships

### Table Operations

#### ✅ Create (Add)
- **Add Root Row**: Click "Add Row" button in toolbar to add a new row at the root level
- **Add Child Row**: Click "Add Child" marker at the end of each parent row to add nested children
- **2-level Hierarchy**: Tree table supports maximum 2 levels of nesting (parent → child)

#### ✅ Read (View)
- **Tree Data Display**: Hierarchical data with expand/collapse functionality
- **Row Numbers**: Beige background row number column (classic Windows style)
- **Alternating Rows**: Zebra striping for better readability
- **All Rows Expanded**: All tree nodes expanded by default

#### ✅ Update (Edit)
All columns support inline editing by clicking the cell:

| Column | Edit Behavior | Validation |
|--------|---------------|------------|
| **Name** | Single-click to edit | Required, max 100 chars, unique (case-insensitive) |
| **Data type** | Double-click to select | Dropdown: Bool, Int, Char, Array |
| **Default value** | Single-click to edit | Type-based validation (Bool: true/false, Int: integer range) |
| **Comment** | Single-click to edit | No validation |
| **Boolean Columns** | Single-click to toggle | Retain, Accessible, Writable, Visible, Setpoint, Supervision |

#### ✅ Delete
- Select a row by clicking anywhere on it
- Click "Delete Row" button in toolbar
- Button is disabled when no row is selected
- Deleting a parent row automatically removes all its children

### UI/UX Features
- **Classic Windows Styling**: Light blue gradient header, 3D border effects
- **Visual Selection**: Highlighted row background when selected
- **Auto-focus**: Input field automatically receives focus when entering edit mode
- **Keyboard Support**: Enter to save, Escape to cancel
- **Error Handling**: Modal dialogs for validation errors with auto-refocus

---

## Project Structure

```
TiaPortal/
├── src/
│   ├── main.tsx              # Application entry point
│   ├── App.jsx               # Root component with routing
│   ├── App.css               # Global app styles
│   ├── index.css             # CSS overrides for TIA Portal styling
│   ├──
│   ├── components/           # Reusable UI components
│   │   ├── Toolbar.jsx       # Top action buttons (Add/Delete)
│   │   ├── HeaderRow.jsx     # Block title display
│   │   ├── AntTable.jsx      # Flat table component (Ant Design)
│   │   ├── AntTableTree.jsx  # Tree table component (Ant Design)
│   │   ├── EditableCell.jsx  # Name column with validation
│   │   ├── DataTypeCell.jsx  # Data type column (select)
│   │   ├── DefaultValueCell.jsx  # Default value with type validation
│   │   └── CommentCell.jsx   # Comment column
│   │
│   ├── pages/                # Page components
│   │   ├── TableWithoutTree.jsx  # Flat table page
│   │   └── TableWithTree.jsx     # Tree table page
│   │
│   ├── hooks/                # Custom React hooks
│   │   └── useCellEdit.js    # Shared cell editing logic
│   │
│   ├── store/                # Zustand state management
│   │   ├── tableStore.ts     # Compatibility layer (legacy API)
│   │   ├── flatTableStore.ts # Flat table state
│   │   ├── treeTableStore.ts # Tree table state
│   │   └── tableStoreUtils.ts  # Shared helper functions
│   │
│   ├── config/               # Configuration files
│   │   ├── tableColumns.json # Column definitions
│   │   ├── mockDataTree.json # Sample hierarchical data
│   │   └── mockDataWithoutTree.json  # Sample flat data
│   │
│   ├── services/             # API services
│   │   └── api.js            # Server integration stub
│   │
│   ├── types/                # TypeScript type definitions
│   │   └── index.ts          # DataType enums and interfaces
│   │
│   └── assets/               # Static assets (images, icons)
│
├── CLAUDE.md                 # Claude Code project instructions
├── index.html                # HTML entry point
├── vite.config.js            # Vite configuration
├── package.json              # Dependencies and scripts
└── README.md                 # This file
```

---

## Architecture

### Core Principles
- **Single Responsibility**: Each module has one clear purpose
- **Separation of Concerns**: UI, state, and logic are separated
- **Code Reuse**: Shared hooks and utilities eliminate duplication
- **Backward Compatibility**: Legacy API preserved via compatibility layer

### Key Technologies

| Technology | Version | Purpose |
|------------|---------|---------|
| React | 18.2 | UI framework |
| Vite | 4.4.5 | Build tool / dev server |
| Ant Design | 6.4.4 | Component library (Tree Data Table) |
| Zustand | Latest | State management |
| React Router | Latest | Client-side routing |

### State Management Architecture

```
tableStoreUtils.ts (shared helpers)
       ├─── flatTableStore.ts (flat table state)
       └─── treeTableStore.ts (tree table state)
                └─── tableStore.ts (compatibility layer)
```

---

---

## 中文文档

# TIA Portal 风格 React 应用程序

一个仿 TIA Portal 风格的层级树形数据表格应用，采用经典 Windows 样式。模拟西门子 TIA Portal 变量表界面的外观和体验。

---

## 目录

1. [快速开始](#快速开始)
2. [测试与验证](#测试与验证)
3. [功能特性](#功能特性)
4. [项目结构](#项目结构)
5. [架构设计](#架构设计)

---

## 快速开始

### 环境要求

- **Node.js**: 版本 18.0 或更高
  - 下载地址: [nodejs.org](https://nodejs.org/)
  - 验证安装: `node --version`
  - 验证 npm: `npm --version`

### 安装步骤

1. **克隆或下载项目**
   ```bash
   cd TiaPortalTableTest
   ```

2. **安装依赖**
   ```bash
   npm install
   ```

3. **启动开发服务器**
   ```bash
   npm run dev
   ```
   应用将在 `http://localhost:5173` 运行

### 可用命令

| 命令 | 说明 |
|------|------|
| `npm run dev` | 启动开发服务器，支持热更新 |
| `npm run build` | 构建生产版本（输出到 `dist/` 目录） |
| `npm run preview` | 本地预览生产构建 |
| `npm run test` | 以监听模式运行测试 |
| `npm run test:run` | 单次运行完整测试套件 |
| `npm run test:coverage` | 运行测试并生成覆盖率报告 |

---

## 测试与验证

本项目使用 **Vitest**、**React Testing Library** 和 **jsdom** 进行单元测试与组件测试。

### 测试覆盖范围

当前测试覆盖：

- `tableStoreUtils.ts` 中的表格共享工具函数
- `useCellEdit.js` 中的单元格编辑行为
- `App.jsx` 中的首页导航链接
- `AntTable.jsx` 中的扁平表格渲染、行号显示/隐藏、无效行过滤、行点击回调和选中行样式

### 运行测试

```bash
npm run test:run
```

开发过程中可使用监听模式：

```bash
npm run test
```

生成测试覆盖率报告：

```bash
npm run test:coverage
```

### 构建验证

提交变更前建议同时运行测试和生产构建：

```bash
npm run test:run
npm run build
```

两个命令都应成功完成。

---

## 功能特性

### 页面导航

- **首页**: 项目介绍和导航链接
- **扁平表格模式**: 无层级结构的简单表格
- **树形表格模式**: 支持父子关系的层级树形表格

### 表格操作

#### ✅ 新增 (Create)
- **添加根行**: 点击工具栏的 "Add Row" 按钮在根层级添加新行
- **添加子行**: 点击每个父行末尾的 "Add Child" 标记添加嵌套子行
- **2 级层级限制**: 树形表格最多支持 2 层嵌套（父 → 子）

#### ✅ 查看 (Read)
- **树形数据展示**: 支持展开/折叠的层级数据
- **行号**: 米色背景的行号列（经典 Windows 风格）
- **交替行**: 斑马纹条纹提高可读性
- **默认全部展开**: 所有树节点默认展开

#### ✅ 编辑 (Update)
所有列都支持点击单元格进行内联编辑：

| 列名 | 编辑行为 | 验证规则 |
|------|---------|----------|
| **Name** | 单击进入编辑 | 必填、最多 100 字符、唯一（大小写不敏感） |
| **Data type** | 双击选择 | 下拉选项: Bool, Int, Char, Array |
| **Default value** | 单击进入编辑 | 基于类型的验证（Bool: true/false, Int: 整数范围） |
| **Comment** | 单击进入编辑 | 无验证 |
| **布尔列** | 单击切换 | Retain, Accessible, Writable, Visible, Setpoint, Supervision |

#### ✅ 删除 (Delete)
- 点击任意位置选中一行
- 点击工具栏的 "Delete Row" 按钮
- 未选中行时按钮禁用
- 删除父行时自动移除其所有子行

### UI/UX 特性
- **经典 Windows 风格**: 浅蓝色渐变表头、3D 边框效果
- **视觉选中**: 选中时行背景高亮
- **自动聚焦**: 进入编辑模式时输入框自动获得焦点
- **键盘支持**: Enter 保存，Escape 取消
- **错误处理**: 验证错误时显示模态对话框并自动重新聚焦

---

## 项目结构

```
TiaPortal/
├── src/
│   ├── main.tsx              # 应用入口文件
│   ├── App.jsx               # 带路由的根组件
│   ├── App.css               # 全局应用样式
│   ├── index.css             # TIA Portal 样式覆盖
│   │
│   ├── components/           # 可复用 UI 组件
│   │   ├── Toolbar.jsx       # 顶部操作按钮（添加/删除）
│   │   ├── HeaderRow.jsx     # 块标题显示
│   │   ├── AntTable.jsx      # 扁平表格组件（Ant Design）
│   │   ├── AntTableTree.jsx  # 树形表格组件（Ant Design）
│   │   ├── EditableCell.jsx  # 带验证的名称列
│   │   ├── DataTypeCell.jsx  # 数据类型列（下拉选择）
│   │   ├── DefaultValueCell.jsx  # 带类型验证的默认值列
│   │   └── CommentCell.jsx   # 注释列
│   │
│   ├── pages/                # 页面组件
│   │   ├── TableWithoutTree.jsx  # 扁平表格页面
│   │   └── TableWithTree.jsx     # 树形表格页面
│   │
│   ├── hooks/                # 自定义 React Hooks
│   │   └── useCellEdit.js    # 共享的单元格编辑逻辑
│   │
│   ├── store/                # Zustand 状态管理
│   │   ├── tableStore.ts     # 兼容层（旧 API）
│   │   ├── flatTableStore.ts # 扁平表格状态
│   │   ├── treeTableStore.ts # 树形表格状态
│   │   └── tableStoreUtils.ts  # 共享工具函数
│   │
│   ├── config/               # 配置文件
│   │   ├── tableColumns.json # 列定义
│   │   ├── mockDataTree.json # 示例层级数据
│   │   └── mockDataWithoutTree.json  # 示例扁平数据
│   │
│   ├── services/             # API 服务
│   │   └── api.js            # 服务端集成桩
│   │
│   ├── types/                # TypeScript 类型定义
│   │   └── index.ts          # DataType 枚举和接口
│   │
│   └── assets/               # 静态资源（图片、图标）
│
├── CLAUDE.md                 # Claude Code 项目说明
├── index.html                # HTML 入口点
├── vite.config.js            # Vite 配置
├── package.json              # 依赖和脚本
└── README.md                 # 本文件
```

---

## 架构设计

### 核心原则
- **单一职责**: 每个模块有一个明确的目的
- **关注点分离**: UI、状态和逻辑相互分离
- **代码复用**: 共享 Hook 和工具函数消除重复代码
- **向后兼容**: 通过兼容层保留旧 API

### 核心技术

| 技术 | 版本 | 用途 |
|------|------|------|
| React | 18.2 | UI 框架 |
| Vite | 4.4.5 | 构建工具 / 开发服务器 |
| Ant Design | 6.4.4 | 组件库（树形数据表格） |
| Zustand | 最新版 | 状态管理 |
| React Router | 最新版 | 客户端路由 |

### 状态管理架构

```
tableStoreUtils.ts (共享工具函数)
       ├─── flatTableStore.ts (扁平表格状态)
       └─── treeTableStore.ts (树形表格状态)
                └─── tableStore.ts (兼容层)
```

---
