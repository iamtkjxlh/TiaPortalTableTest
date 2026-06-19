import { useFlatTableStore } from '../store/flatTableStore.ts'
import { useTreeTableStore } from '../store/treeTableStore.ts'
import { useCellEdit } from '../hooks/useCellEdit.js'

function CommentCell({
  value,
  recordId,
  tableType, // 'flat' | 'tree'
  onStartEdit,
  ...props
}) {
  // 从 store 获取对应的 update 函数
  const updateFlatComment = useFlatTableStore((state) => state.updateComment)
  const updateTreeComment = useTreeTableStore((state) => state.updateComment)

  // 保存 - 直接调用 store action
  const handleSave = (newValue) => {
    if (tableType === 'flat') {
      updateFlatComment(recordId, newValue)
    } else {
      updateTreeComment(recordId, newValue)
    }
  }

  // 使用共享的编辑 Hook
  const {
    editing,
    inputValue,
    setInputValue,
    ref,
    handleKeyDown,
    handleClick,
    handleBlur,
  } = useCellEdit({
    value: value || '',
    onStartEdit,
    onSave: handleSave,
  })

  if (editing) {
    return (
      <input
        ref={ref}
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onBlur={handleBlur}
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

export default CommentCell
