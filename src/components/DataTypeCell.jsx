import { useState, useRef, useEffect } from 'react'
import { Select } from 'antd'
import { DATA_TYPE_OPTIONS } from '../types/index.ts'
import { useFlatTableStore } from '../store/flatTableStore.ts'
import { useTreeTableStore } from '../store/treeTableStore.ts'

function DataTypeCell({
  value,
  recordId,
  tableType, // 'flat' | 'tree'
  onStartEdit,
  ...props
}) {
  const [editing, setEditing] = useState(false)
  const [selectValue, setSelectValue] = useState(value)
  const selectRef = useRef(null)

  // 从 store 获取对应的 update 函数
  const updateFlatDataType = useFlatTableStore((state) => state.updateDataType)
  const updateTreeDataType = useTreeTableStore((state) => state.updateDataType)

  // 保存 - 直接调用 store action
  const handleSave = (newValue) => {
    if (tableType === 'flat') {
      updateFlatDataType(recordId, newValue)
    } else {
      updateTreeDataType(recordId, newValue)
    }
    setEditing(false)
  }

  // 单击单元格 - 只触发行选中，不进入编辑模式
  const handleClick = (e) => {
    if (onStartEdit) {
      onStartEdit()
    }
    e.stopPropagation()
  }

  // 双击单元格 - 进入编辑模式
  const handleDoubleClick = (e) => {
    e.stopPropagation()
    setSelectValue(value)
    setEditing(true)
  }

  // 进入编辑模式时自动聚焦
  useEffect(() => {
    if (editing && selectRef.current) {
      selectRef.current.focus()
    }
  }, [editing])

  if (editing) {
    return (
      <Select
        ref={selectRef}
        value={selectValue}
        onChange={handleSave}
        onBlur={() => setEditing(false)}
        options={DATA_TYPE_OPTIONS}
        allowClear
        open={true}
        style={{ width: '100%' }}
        size="small"
        onClick={(e) => e.stopPropagation()}
        {...props}
      />
    )
  }

  return (
    <span
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
      style={{
        cursor: 'pointer',
        display: 'block',
        minWidth: 0,
      }}
      {...props}
    >
      {value || <span style={{ color: '#ccc' }}>&nbsp;</span>}
    </span>
  )
}

export default DataTypeCell
