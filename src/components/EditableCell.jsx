import { useState } from 'react'
import { Modal } from 'antd'
import { useFlatTableStore } from '../store/flatTableStore.ts'
import { useTreeTableStore } from '../store/treeTableStore.ts'
import { useCellEdit } from '../hooks/useCellEdit.js'

/**
 * 可编辑单元格 - Name 列
 * 包含空值、长度、重复名称验证
 */
function EditableCell({
  value,
  recordId,
  tableType, // 'flat' | 'tree'
  maxLength = 100,
  onStartEdit,
  ...props
}) {
  const [errorModalVisible, setErrorModalVisible] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  // 从 store 获取对应的 update 函数和验证函数
  const updateFlatName = useFlatTableStore((state) => state.updateName)
  const updateTreeName = useTreeTableStore((state) => state.updateName)
  const isFlatNameDuplicate = useFlatTableStore((state) => state.isNameDuplicate)
  const isTreeNameDuplicate = useTreeTableStore((state) => state.isNameDuplicate)

  // 验证函数
  const validate = (val) => {
    // 空值验证
    if (!val || val.trim() === '') {
      setErrorMessage('Name cannot be empty.')
      setErrorModalVisible(true)
      return false
    }

    // 长度验证
    if (val.length > maxLength) {
      setErrorMessage(`Name must not exceed ${maxLength} characters. Current length: ${val.length}`)
      setErrorModalVisible(true)
      return false
    }

    // 重复验证（大小写不敏感）
    const isDuplicate = tableType === 'flat'
      ? isFlatNameDuplicate(recordId, val)
      : isTreeNameDuplicate(recordId, val)

    if (isDuplicate) {
      setErrorMessage(`Name "${val}" already exists. Please use a different name.`)
      setErrorModalVisible(true)
      return false
    }

    return true
  }

  // 保存逻辑
  const handleSave = (newValue) => {
    if (validate(newValue)) {
      if (tableType === 'flat') {
        updateFlatName(recordId, newValue)
      } else {
        updateTreeName(recordId, newValue)
      }
      return true
    }
    return false
  }

  // 使用共享的编辑 Hook
  const {
    editing,
    inputValue,
    setInputValue,
    ref,
    handleKeyDown,
    handleBlur,
    handleClick: hookHandleClick,
  } = useCellEdit({
    value,
    onStartEdit,
    onSave: handleSave,
  })

  // 包装点击处理，增加错误弹窗关闭
  const handleClick = (e) => {
    setErrorModalVisible(false)
    hookHandleClick(e)
  }

  // 关闭错误弹窗并重新聚焦
  const handleCloseErrorModal = () => {
    setErrorModalVisible(false)
    setTimeout(() => {
      if (ref.current) {
        ref.current.focus()
        ref.current.select()
      }
    }, 50)
  }

  if (editing) {
    return (
      <>
        <input
          ref={ref}
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          onClick={(e) => e.stopPropagation()}
          style={{
            minWidth: 0,
            display: 'inline-block',
            padding: '2px 4px',
            border: '1px solid #1890ff',
            borderRadius: 2,
            outline: 'none',
          }}
          {...props}
        />
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

  return (
    <span
      onClick={handleClick}
      style={{
        cursor: 'text',
        display: 'block',
        minWidth: 0,
      }}
      {...props}
    >
      {value || <span style={{ color: '#ccc' }}>&nbsp;</span>}
    </span>
  )
}

export default EditableCell
