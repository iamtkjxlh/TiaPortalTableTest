import { useMemo, useCallback } from 'react'
import { Table } from 'antd'
import tableConfig from '../config/tableColumns.json'
import EditableCell from './EditableCell'
import DataTypeCell from './DataTypeCell'
import DefaultValueCell from './DefaultValueCell'
import CommentCell from './CommentCell'

function AntTableTree({
  columns,
  data,
  showRowNumbers = true,
  onRowClick,
  selectedRowId,
}) {
  // 过滤掉无效数据行
  const validData = (data || []).filter((row) => row && row.id != null)

  // 为每个父节点的 children 末尾添加 <Add new> marker，并添加层级行号和层级信息
  const processDataWithAddMarker = useCallback((items, parentRowNumber = '', level = 0) => {
    return items.map((item, index) => {
      const result = { ...item }
      // 计算当前行号：如果有父行号，则为 "父行号-当前索引+1"，否则为 "当前索引+1"
      const currentRowNumber = parentRowNumber
        ? `${parentRowNumber}-${index + 1}`
        : `${index + 1}`
      result._rowNumber = currentRowNumber
      result._level = level // 保存层级，用于手动缩进

      // 只有第1级（level === 0）才能有子行，显示 <Add new> marker
      // 第2级及以下不显示添加 marker，也不能有子行
      if (level === 0 && result.children && result.children.length > 0) {
        result.children = [
          ...processDataWithAddMarker(result.children, currentRowNumber, level + 1),
          {
            id: `marker-${result.id}`,
            name: '<Add new>',
            isAddMarker: true,
            parentId: result.id,
            _level: level + 1,
          },
        ]
      } else if (level === 0 && result.children) {
        // children 为空数组时，直接添加 marker
        result.children = [
          {
            id: `marker-${result.id}`,
            name: '<Add new>',
            isAddMarker: true,
            parentId: result.id,
            _level: level + 1,
          },
        ]
      }

      return result
    })
  }, [])

  const processedData = useMemo(() => {
    if (!validData) return []
    return processDataWithAddMarker(validData)
  }, [validData, processDataWithAddMarker])

  // 列配置转换
  const tableColumns = useMemo(() => {
    const cols = columns || tableConfig.columns

    const result = cols.map((col) => ({
      key: col.key,
      title: col.title,
      dataIndex: col.key,
      width: col.width,
      ellipsis: true,
    }))

    // name 列添加树形展开列（包含展开箭头）和自定义 render，以及手动缩进 - 使用 Tree Table 的 store action
    const nameCol = result.find((c) => c.key === 'name')
    if (nameCol) {
      nameCol.className = 'tree-name-column'
      nameCol.render = (text, record) => {
        // 根据层级计算左边距，手动控制缩进
        const paddingLeft = record._level * 16

        if (record.isAddMarker) {
          return (
            <span className="add-new-marker" style={{ paddingLeft }}>
              {text}
            </span>
          )
        }
        return (
          <div style={{ paddingLeft }}>
            <EditableCell
              value={text}
              recordId={record.id}
              tableType="tree"
              onStartEdit={() => onRowClick && onRowClick(record)}
              maxLength={100}
            />
          </div>
        )
      }
    }

    // dataType 列添加下拉编辑功能和手动缩进 - 使用 Tree Table 的 store action
    // 第一级（_level === 0）不可编辑，只显示文本
    const dataTypeCol = result.find((c) => c.key === 'dataType')
    if (dataTypeCol) {
      dataTypeCol.render = (text, record) => {
        const paddingLeft = record._level * 16
        if (record.isAddMarker) {
          return text
        }
        // 第一级只显示文本，不可编辑
        if (record._level === 0) {
          return (
            <div style={{ paddingLeft }}>
              {text || <span style={{ color: '#ccc' }}>&nbsp;</span>}
            </div>
          )
        }
        return (
          <div style={{ paddingLeft }}>
            <DataTypeCell
              value={text}
              recordId={record.id}
              tableType="tree"
              onStartEdit={() => onRowClick && onRowClick(record)}
            />
          </div>
        )
      }
    }

    // defaultValue 列添加编辑功能（依赖 dataType）和手动缩进 - 使用 Tree Table 的 store action
    // 第一级（_level === 0）不可编辑，只显示文本
    const defaultValueCol = result.find((c) => c.key === 'defaultValue')
    if (defaultValueCol) {
      defaultValueCol.render = (text, record) => {
        const paddingLeft = record._level * 16
        if (record.isAddMarker) {
          return text
        }
        // 第一级只显示文本，不可编辑
        if (record._level === 0) {
          return (
            <div style={{ paddingLeft }}>
              {text || <span style={{ color: '#ccc' }}>&nbsp;</span>}
            </div>
          )
        }
        return (
          <div style={{ paddingLeft }}>
            <DefaultValueCell
              value={text}
              recordId={record.id}
              tableType="tree"
              dataType={record.dataType}
              onStartEdit={() => onRowClick && onRowClick(record)}
            />
          </div>
        )
      }
    }

    // comment 列添加编辑功能和手动缩进 - 使用 Tree Table 的 store action
    // 第一级（_level === 0）不可编辑，只显示文本
    const commentCol = result.find((c) => c.key === 'comment')
    if (commentCol) {
      commentCol.render = (text, record) => {
        const paddingLeft = record._level * 16
        if (record.isAddMarker) {
          return text
        }
        // 第一级只显示文本，不可编辑
        if (record._level === 0) {
          return (
            <div style={{ paddingLeft }}>
              {text || <span style={{ color: '#ccc' }}>&nbsp;</span>}
            </div>
          )
        }
        return (
          <div style={{ paddingLeft }}>
            <CommentCell
              value={text}
              recordId={record.id}
              tableType="tree"
              onStartEdit={() => onRowClick && onRowClick(record)}
            />
          </div>
        )
      }
    }

    return result
  }, [columns, onRowClick])

  // 行号列配置 - 使用层级行号（如 1, 1-1, 1-2, 2, 2-1...）
  const rowNumberColumn = useMemo(
    () => ({
      title: 'Index',
      key: '_rowNumber',
      width: 50,
      fixed: 'left',
      render: (_, record) => record._rowNumber,
      className: 'row-number-cell',
    }),
    []
  )

  // 最终列配置
  const finalColumns = useMemo(() => {
    if (showRowNumbers) {
      return [rowNumberColumn, ...tableColumns]
    }
    return tableColumns
  }, [showRowNumbers, rowNumberColumn, tableColumns])

  // 行点击事件
  const handleRowClick = (record) => {
    if (onRowClick) {
      onRowClick(record)
    }
  }

  // 展开配置 - 设置 indentSize: 0 禁用 Ant Design 的自动缩进，改用手动缩进
  const expandableConfig = useMemo(
    () => ({
      indentSize: 0, // 禁用 Ant Design 自动缩进，我们手动控制
      expandIconColumnIndex: 1,
      defaultExpandAllRows: true,
      // 自定义展开图标逻辑 - 只有第1级（_level === 0）可以展开，第2级及以下不能展开
      rowExpandable: (record) => record._level === 0,
    }),
    []
  )

  // 正常显示 placeholder
  const localeConfig = {}

  return (
    <div className="ant-table-wrapper">
      <Table
        columns={finalColumns}
        dataSource={processedData}
        rowKey="id"
        pagination={false}
        size="small"
        expandable={expandableConfig}
        rowClassName={(record) => !record.isAddMarker && record.id === selectedRowId ? 'selected-row' : ''}
        onRow={(record) => ({
          onClick: () => handleRowClick(record),
        })}
        scroll={{ y: 'calc(100vh - 160px)' }}
        locale={localeConfig}
      />
    </div>
  )
}

export default AntTableTree
