import { Link } from 'react-router-dom'
import Toolbar from '../components/Toolbar'
import HeaderRow from '../components/HeaderRow'
import AntTable from '../components/AntTable'
import { useFlatTableStore } from '../store/flatTableStore.ts'

function TableWithoutTree() {
  // 从 store 获取状态和 actions
  const data = useFlatTableStore((state) => state.data)
  const selectedRowId = useFlatTableStore((state) => state.selectedRowId)
  const setSelectedRowId = useFlatTableStore((state) => state.setSelectedRowId)
  const addRow = useFlatTableStore((state) => state.addRow)
  const deleteRow = useFlatTableStore((state) => state.deleteRow)

  // 行点击处理 - 选中/取消选中行
  const handleRowClick = (record) => {
    if (selectedRowId === record.id) {
      setSelectedRowId(null) // 取消选中
    } else {
      setSelectedRowId(record.id) // 选中新行
    }
  }

  return (
    <div className="app-container">
      <div className="page-header">
        <Link to="/" className="back-link">
          ← 返回首页
        </Link>
      </div>
      <Toolbar
        onAdd={addRow}
        onDelete={deleteRow}
        canDelete={selectedRowId !== null}
      />
      <HeaderRow title="Block_1 (Flat)" />
      <div className="table-container">
        <AntTable
          data={data}
          showRowNumbers={true}
          onRowClick={handleRowClick}
          selectedRowId={selectedRowId}
        />
      </div>
    </div>
  )
}

export default TableWithoutTree
