import { useCallback } from 'react'
import { Link } from 'react-router-dom'
import Toolbar from '../components/Toolbar'
import HeaderRow from '../components/HeaderRow'
import AntTableTree from '../components/AntTableTree'
import { useTreeTableStore } from '../store/treeTableStore.ts'

function TableWithTree() {
  // 从 store 获取状态和 actions
  const data = useTreeTableStore((state) => state.data)
  const selectedRowId = useTreeTableStore((state) => state.selectedRowId)
  const setSelectedRowId = useTreeTableStore((state) => state.setSelectedRowId)
  const addRootRow = useTreeTableStore((state) => state.addRootRow)
  const addChildRow = useTreeTableStore((state) => state.addChildRow)
  const deleteNode = useTreeTableStore((state) => state.deleteNode)

  // 行点击处理 - 检查是否点击的是 <Add new> marker
  const handleRowClick = useCallback(
    (record) => {
      if (record.isAddMarker) {
        addChildRow(record.parentId)
      } else if (selectedRowId === record.id) {
        setSelectedRowId(null) // 取消选中
      } else {
        setSelectedRowId(record.id) // 选中新行
      }
    },
    [selectedRowId, setSelectedRowId, addChildRow]
  )

  return (
    <div className="app-container">
      <div className="page-header">
        <Link to="/" className="back-link">
          ← 返回首页
        </Link>
      </div>
      <Toolbar
        onAdd={addRootRow}
        onDelete={deleteNode}
        canDelete={selectedRowId !== null}
      />
      <HeaderRow title="Block_1" />
      <div className="table-container">
        <AntTableTree
          data={data}
          showRowNumbers={true}
          onRowClick={handleRowClick}
          selectedRowId={selectedRowId}
        />
      </div>
    </div>
  )
}

export default TableWithTree
