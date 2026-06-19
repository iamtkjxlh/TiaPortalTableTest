/**
 * Store 兼容层
 * 为了向后兼容，导出新旧两个 store 的 actions
 * 新代码建议直接使用 useFlatTableStore 和 useTreeTableStore
 */
import { useFlatTableStore } from './flatTableStore.ts'
import { useTreeTableStore } from './treeTableStore.ts'

// ========== 兼容导出 - Flat Table ==========
export const useTableStore = (selector: (state: any) => any) => {
  const flatState = useFlatTableStore()
  const treeState = useTreeTableStore()

  // 将两个 store 的状态合并，保持与旧 API 兼容
  const combinedState = {
    // Flat Table 状态 - 旧命名
    flatData: flatState.data,
    flatSelectedRowId: flatState.selectedRowId,
    nextFlatId: flatState.nextId,

    // Flat Table actions - 旧命名
    setFlatSelectedRowId: flatState.setSelectedRowId,
    addFlatRow: flatState.addRow,
    deleteFlatRow: flatState.deleteRow,
    updateFlatName: flatState.updateName,
    updateFlatDataType: flatState.updateDataType,
    updateFlatDefaultValue: flatState.updateDefaultValue,
    updateFlatComment: flatState.updateComment,
    isFlatNameDuplicate: flatState.isNameDuplicate,

    // Tree Table 状态 - 旧命名
    treeData: treeState.data,
    treeSelectedRowId: treeState.selectedRowId,
    nextTreeId: treeState.nextId,

    // Tree Table actions - 旧命名
    setTreeSelectedRowId: treeState.setSelectedRowId,
    addTreeRootRow: treeState.addRootRow,
    addTreeChildRow: treeState.addChildRow,
    deleteTreeNode: treeState.deleteNode,
    updateTreeName: treeState.updateName,
    updateTreeDataType: treeState.updateDataType,
    updateTreeDefaultValue: treeState.updateDefaultValue,
    updateTreeComment: treeState.updateComment,
    isTreeNameDuplicate: treeState.isNameDuplicate,
  }

  return selector(combinedState)
}

// 同时导出新的 store，方便新代码使用
export { useFlatTableStore, useTreeTableStore }
