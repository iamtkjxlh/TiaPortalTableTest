import { useMemo } from 'react'
import { Table } from 'antd'
import tableConfig from '../config/tableColumns.json'
import EditableCell from './EditableCell'
import DataTypeCell from './DataTypeCell'
import DefaultValueCell from './DefaultValueCell'
import CommentCell from './CommentCell'

function AntTable({
  columns,
  data,
  showRowNumbers = true,
  onRowClick,
  selectedRowId,
}) {
  // 过滤掉无效数据行 + 确保 id 是有效数字
  const validData = (data || [])
    .filter((row) => {
      if (!row) return false
      if (row.id == null || row.id === '' || row.id === undefined) return false
      if (typeof row.id === 'number' && isNaN(row.id)) return false
      return true
    })
    .map((row, index) => ({
      ...row,
      // 确保 id 总是有效数字（兜底用数组索引）
      id: typeof row.id === 'number' && !isNaN(row.id) ? row.id : index
    }))

  // 列配置转换
  const tableColumns = useMemo(() => {
    const cols = columns || tableConfig.columns

    // 修改col里的每个值，形成一个新的列数组
    const result = cols.map((col) => ({
      key: col.key,
      title: col.title,
      dataIndex: col.key,
      width: col.width,
      ellipsis: true,
    }))

    // name 列添加编辑功能 - 使用 Flat Table 的 store action
    const nameCol = result.find((c) => c.key === 'name')
    if (nameCol) {
      nameCol.render = (text, record) => (
        <EditableCell
          value={text}
          recordId={record.id}
          tableType="flat"
          onStartEdit={() => onRowClick && onRowClick(record)}
          maxLength={100}
        />
      )
    }

    // dataType 列添加下拉编辑功能 - 使用 Flat Table 的 store action
    const dataTypeCol = result.find((c) => c.key === 'dataType')
    if (dataTypeCol) {
      dataTypeCol.render = (text, record) => (
        <DataTypeCell
          value={text}
          recordId={record.id}
          tableType="flat"
          onStartEdit={() => onRowClick && onRowClick(record)}
        />
      )
    }

    // defaultValue 列添加编辑功能（依赖 dataType）- 使用 Flat Table 的 store action
    const defaultValueCol = result.find((c) => c.key === 'defaultValue')
    if (defaultValueCol) {
      defaultValueCol.render = (text, record) => (
        <DefaultValueCell
          value={text}
          recordId={record.id}
          tableType="flat"
          dataType={record.dataType}
          onStartEdit={() => onRowClick && onRowClick(record)}
        />
      )
    }

    // comment 列添加编辑功能 - 使用 Flat Table 的 store action
    const commentCol = result.find((c) => c.key === 'comment')
    if (commentCol) {
      commentCol.render = (text, record) => (
        <CommentCell
          value={text}
          recordId={record.id}
          tableType="flat"
          onStartEdit={() => onRowClick && onRowClick(record)}
        />
      )
    }

    return result
  }, [columns, onRowClick])

  // 行号列配置
  const rowNumberColumn = useMemo(
    () => ({
      title: 'Index',
      key: '_rowNumber',
      width: 50,
      fixed: 'left',
      render: (_, __, index) => index + 1,
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

  // 正常显示 placeholder
  const localeConfig = {}

  return (
    <div className="ant-table-wrapper">
      <Table
        columns={finalColumns}
        dataSource={validData}
        rowKey="id"
        pagination={false}
        size="small"
        rowClassName={(record) => (record.id === selectedRowId ? 'selected-row' : '')}
        onRow={(record) => ({
          onClick: () => handleRowClick(record),
        })}
        scroll={{ y: 'calc(100vh - 160px)' }}
        locale={localeConfig}
      />
    </div>
  )
}

export default AntTable
