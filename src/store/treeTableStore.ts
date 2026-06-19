import { create } from 'zustand'
import { DataType, DEFAULT_BOOL_VALUE, DEFAULT_INT_VALUE } from '../types/index.ts'
import type { TableRowTree } from '../types/index.ts'
import initialTreeData from '../config/mockDataTree.json'
import {
  isRowEmpty,
  createNewTreeNode,
  findMaxId,
  collectAllNamesRecursive,
  updateTreeNodeRecursive,
  deleteTreeNodeRecursive,
} from './tableStoreUtils.ts'

interface TreeTableState {
  // ========== State ==========
  data: TableRowTree[]
  selectedRowId: number | null
  nextId: number

  // ========== Actions ==========
  setSelectedRowId: (id: number | null) => void
  addRootRow: () => void
  addChildRow: (parentId: number) => void
  deleteNode: () => void
  updateName: (id: number, newValue: string) => void
  updateDataType: (id: number, newValue: string) => void
  updateDefaultValue: (id: number, newValue: string) => void
  updateComment: (id: number, newValue: string) => void
  isNameDuplicate: (id: number, name: string) => boolean
}

export const useTreeTableStore = create<TreeTableState>((set, get) => ({
  // ========== Initial State ==========
  data: initialTreeData,
  selectedRowId: null,
  nextId: findMaxId(initialTreeData) + 1,

  // ========== Actions ==========

  setSelectedRowId: (id) => set({ selectedRowId: id }),

  addRootRow: () => {
    const { data, nextId } = get()
    // 检查第一级最后一行是否为空，如果为空则不添加新行
    if (data.length > 0 && isRowEmpty(data[data.length - 1])) {
      return
    }
    // 第一级行需要 children 字段，以便可以展开并添加子行
    const newRow = createNewTreeNode(nextId, true)
    set({
      data: [...data, newRow],
      nextId: nextId + 1,
    })
  },

  addChildRow: (parentId) => {
    const { data, nextId } = get()

    // 检查父节点是否在第一级（直接在 data 中）
    // 只有第一级节点才能添加子行，第二级不能添加子行
    const isParentInFirstLevel = data.some((item) => item.id === parentId)
    if (!isParentInFirstLevel) {
      // 父节点不在第一级，说明是第二级或更深，不能添加子行
      return
    }

    const addToParent = (items: TableRowTree[]): TableRowTree[] => {
      return items.map((item) => {
        if (item.id === parentId) {
          const children = item.children || []
          // 检查父节点的子列表最后一行是否为空，如果为空则不添加新行
          if (children.length > 0 && isRowEmpty(children[children.length - 1])) {
            return item
          }
          // 第二级行不应该有 children 字段，不能再添加子行
          const newRow = createNewTreeNode(nextId, false)
          return {
            ...item,
            children: [...children, newRow],
          }
        }
        if (item.children) {
          return {
            ...item,
            children: addToParent(item.children),
          }
        }
        return item
      })
    }

    set({
      data: addToParent(data),
      nextId: nextId + 1,
    })
  },

  deleteNode: () => {
    const { selectedRowId, data } = get()
    if (!selectedRowId) return
    set({
      data: deleteTreeNodeRecursive(data, selectedRowId),
      selectedRowId: null,
    })
  },

  updateName: (id, newValue) => {
    set((state) => ({
      data: updateTreeNodeRecursive(state.data, id, (item) => ({
        ...item,
        name: newValue,
      })),
    }))
  },

  updateDataType: (id, newValue) => {
    set((state) => ({
      data: updateTreeNodeRecursive(state.data, id, (item) => {
        let defaultValue = ''
        if (newValue === DataType.Bool) {
          defaultValue = DEFAULT_BOOL_VALUE
        } else if (newValue === DataType.Int) {
          defaultValue = DEFAULT_INT_VALUE
        }
        return { ...item, dataType: newValue, defaultValue }
      }),
    }))
  },

  updateDefaultValue: (id, newValue) => {
    set((state) => ({
      data: updateTreeNodeRecursive(state.data, id, (item) => ({
        ...item,
        defaultValue: newValue,
      })),
    }))
  },

  updateComment: (id, newValue) => {
    set((state) => ({
      data: updateTreeNodeRecursive(state.data, id, (item) => ({
        ...item,
        comment: newValue,
      })),
    }))
  },

  isNameDuplicate: (id, name) => {
    const { data } = get()
    const nameMap = collectAllNamesRecursive(data)
    const trimmedName = name.trim().toLowerCase()
    for (const [rowId, rowName] of nameMap.entries()) {
      if (rowId !== id && (rowName || '').trim().toLowerCase() === trimmedName) {
        return true
      }
    }
    return false
  },
}))
