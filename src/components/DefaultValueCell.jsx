import { useState, useRef, useEffect } from 'react'
import { Modal } from 'antd'
import { DataType, INT_MIN, INT_MAX } from '../types/index.ts'
import { useFlatTableStore } from '../store/flatTableStore.ts'
import { useTreeTableStore } from '../store/treeTableStore.ts'

/**
 * DefaultValue 单元格 - 由于有复杂的验证逻辑和 isEditable 判断
 * 保留独立的状态管理而不使用 useCellEdit Hook
 */
function DefaultValueCell({
  value,
  recordId,
  tableType, // 'flat' | 'tree'
  dataType,
  onStartEdit,
  ...props
}) {
  const [editing, setEditing] = useState(false)
  const [inputValue, setInputValue] = useState(value)
  const [errorModalVisible, setErrorModalVisible] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const inputRef = useRef(null)

  // 从 store 获取对应的 update 函数
  const updateFlatDefaultValue = useFlatTableStore((state) => state.updateDefaultValue)
  const updateTreeDefaultValue = useTreeTableStore((state) => state.updateDefaultValue)

  // 当 dataType 为空时，不可编辑
  const isEditable = !!dataType

  // 验证函数
  const validate = (val) => {
    if (dataType === DataType.Bool) {
      const upperVal = val.toUpperCase()
      if (upperVal !== 'TRUE' && upperVal !== 'FALSE') {
        setErrorMessage('Bool value must be either "true" or "false" (case-insensitive).')
        setErrorModalVisible(true)
        return false
      }
    } else if (dataType === DataType.Int) {
      if (!/^-?\d+$/.test(val)) {
        setErrorMessage('Int value must be a valid integer (digits only, optional leading minus sign).')
        setErrorModalVisible(true)
        return false
      }
      const num = parseInt(val, 10)
      if (num < INT_MIN || num > INT_MAX) {
        setErrorMessage(`Int value must be between ${INT_MIN} and ${INT_MAX}.`)
        setErrorModalVisible(true)
        return false
      }
    }
    return true
  }

  // 格式化保存的值
  const formatValue = (val) => {
    if (dataType === DataType.Bool) return val.toUpperCase()
    if (dataType === DataType.Int) return String(parseInt(val, 10))
    return val
  }

  // 保存
  const handleSave = () => {
    if (inputValue.trim() === '') {
      setInputValue(value)
      setEditing(false)
      return
    }
    if (validate(inputValue)) {
      if (tableType === 'flat') {
        updateFlatDefaultValue(recordId, formatValue(inputValue))
      } else {
        updateTreeDefaultValue(recordId, formatValue(inputValue))
      }
      setEditing(false)
    }
  }

  // 键盘事件
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleSave()
    } else if (e.key === 'Escape') {
      setInputValue(value)
      setEditing(false)
    }
  }

  // 关闭错误弹窗并重新聚焦
  const handleCloseErrorModal = () => {
    setErrorModalVisible(false)
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus()
        inputRef.current.select()
      }
    }, 200)
  }

  // 点击进入编辑模式
  const handleClick = (e) => {
    if (!isEditable) {
      e.stopPropagation()
      return
    }
    if (onStartEdit) onStartEdit()
    e.stopPropagation()
    setInputValue(value)
    setEditing(true)
  }

  // 自动聚焦
  useEffect(() => {
    if (editing && inputRef.current) {
      inputRef.current.focus()
      inputRef.current.select()
    }
  }, [editing])

  return (
    <>
      {editing && isEditable ? (
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onBlur={handleSave}
          onKeyDown={handleKeyDown}
          onClick={(e) => e.stopPropagation()}
          style={{
            width: '100%',
            padding: '2px 4px',
            border: '1px solid #1890ff',
            borderRadius: 2,
            outline: 'none',
          }}
          {...props}
        />
      ) : (
        <span
          onClick={handleClick}
          style={{
            cursor: isEditable ? 'text' : 'not-allowed',
            display: 'block',
            minWidth: 0,
            color: isEditable ? 'inherit' : '#999',
          }}
          {...props}
        >
          {value || <span style={{ color: '#ccc' }}>&nbsp;</span>}
        </span>
      )}
      <Modal
        title="Validation Error"
        open={errorModalVisible}
        onOk={handleCloseErrorModal}
        okText="Close"
        cancelButtonProps={{ style: { display: 'none' } }}
        closable={false}
      >
        <p>{errorMessage}</p>
      </Modal>
    </>
  )
}

export default DefaultValueCell
