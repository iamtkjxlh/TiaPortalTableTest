# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a TIA Portal-style React application featuring a hierarchical tree data table with classic Windows styling. It simulates the look and feel of Siemens TIA Portal's variable table interface.

## Tech Stack

- **React 18.2** - UI framework
- **Vite 4.4.5** - Build tool / dev server
- **Ant Design 6.4.4** - Component library (Table used for tree data support)

## Commands

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
```

## Architecture

### Core Component: AntTable

**File:** [src/components/AntTable.jsx](src/components/AntTable.jsx)

The main table component with native tree data support:
- Uses Ant Design Table with `children` field for hierarchical data
- `expandIconColumnIndex={1}` places expand/collapse arrows on the Name column (index 1), after row numbers (index 0)
- `defaultExpandAllRows={true}` - All rows expanded by default
- `indentSize={16}` - Visual indent for hierarchy levels

**Key Props:**
- `columns` - Column config (falls back to tableColumns.json)
- `data` - Direct data source
- `loadData` - Async function for server-side data loading (future integration)
- `showRowNumbers` - Display row number column (default: true)
- `onRowClick` - Row click handler

### Data Structure

**Tree Data Format** ([src/config/mockData.json](src/config/mockData.json)):
```json
{
  "id": 1,
  "name": "Input",
  "children": [
    {"id": 2, "name": "start", "dataType": "Bool"}
  ]
}
```
Hierarchy levels use nested `children` arrays for Ant Design's tree data feature.

### Column Configuration

Externalized in [src/config/tableColumns.json](src/config/tableColumns.json).
Column order: Name → Data type → Default value → Retain → Accessible → Writable → Visible → Setpoint → Supervision → Comment

### Styling

**File:** [src/index.css](src/index.css)

Classic Windows / TIA Portal visual style implemented via CSS overrides:
- **Header**: Light blue gradient (#eaf2ff → #d4e0f0) with 3D border effects
- **Row numbers**: Beige background (#ece9d8)
- **Alternating rows**: White / #f5f5f5 zebra striping
- **Expand icons**: ▶ / ▼ characters
- **Scrollbars**: Classic Windows 3D style

### Future Server Integration

**Service stub:** [src/services/api.js](src/services/api.js)
- `fetchTableData()` function prepared for backend integration
- In App.jsx, uncomment `loadData` prop to enable server fetching

## Layout Structure

```
App
├── Toolbar (top action buttons)
├── HeaderRow (block title display)
└── AntTable (main tree data table)
```

## Important Configuration Points

1. **Expand icon position**: Controlled by `expandIconColumnIndex={1}` in AntTable.jsx. Index 0 = row numbers, 1 = Name column.
2. **Tree data format**: Must use `children` array for nesting, not ag-Grid's path-based approach.
3. **Row key**: Uses `id` field - ensure unique IDs across all hierarchy levels.
4. **Pagination**: Disabled (`pagination={false}`) for continuous scrolling.
