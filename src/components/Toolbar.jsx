/**
 * 表格工具栏
 * 目前只实现了添加和删除功能
 * 编辑、刷新、导出功能预留接口
 */
function Toolbar({ onAdd, onDelete, canDelete = true }) {
  return (
    <div className="toolbar">
      <button className="toolbar-btn" onClick={onAdd}>
        Add Row
      </button>
      <button className="toolbar-btn danger" onClick={onDelete} disabled={!canDelete}>
        Delete Row
      </button>
    </div>
  )
}

export default Toolbar
