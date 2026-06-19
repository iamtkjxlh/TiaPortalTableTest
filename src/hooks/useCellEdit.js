import { useState, useEffect, useRef, useCallback } from 'react'

/**
 * 单元格编辑的共享 Hook
 * 提供编辑状态管理、自动聚焦、键盘事件处理
 */
export function useCellEdit({
  value,
  onStartEdit,
  onSave,
  validate,
  formatValue = (val) => val,
}) {
  const [editing, setEditing] = useState(false)
  const [inputValue, setInputValue] = useState(value)
  const [originalValue, setOriginalValue] = useState(value)
  const ref = useRef(null)

  // 进入编辑模式时自动聚焦并选中内容
  useEffect(() => {
    if (editing && ref.current) {
      ref.current.focus()
      if (ref.current.select) {
        ref.current.select()
      }
    }
  }, [editing])

  // 保存
  const handleSave = useCallback(() => {
    // 如果有验证函数且验证失败，保持编辑状态
    if (validate && !validate(inputValue)) {
      return false
    }

    if (onSave) {
      onSave(formatValue(inputValue))
    }
    setEditing(false)
    return true
  }, [inputValue, validate, onSave, formatValue])

  // 取消编辑
  const handleCancel = useCallback(() => {
    setInputValue(originalValue)
    setEditing(false)
  }, [originalValue])

  // 键盘事件 - 回车保存，ESC 取消
  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === 'Enter') {
        e.preventDefault()
        handleSave()
      } else if (e.key === 'Escape') {
        handleCancel()
      }
    },
    [handleSave, handleCancel]
  )

  // 点击单元格进入编辑模式
  const handleClick = useCallback(
    (e) => {
      if (onStartEdit) {
        onStartEdit()
      }
      e.stopPropagation()
      setOriginalValue(value)
      setInputValue(value)
      setEditing(true)
    },
    [onStartEdit, value]
  )

  // 失焦保存
  const handleBlur = useCallback(() => {
    handleSave()
  }, [handleSave])

  return {
    editing,
    setEditing,
    inputValue,
    setInputValue,
    originalValue,
    ref,
    handleSave,
    handleCancel,
    handleKeyDown,
    handleClick,
    handleBlur,
  }
}

export default useCellEdit
