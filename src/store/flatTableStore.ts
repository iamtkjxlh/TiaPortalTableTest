import { create } from 'zustand'
import { DataType, DEFAULT_BOOL_VALUE, DEFAULT_INT_VALUE } from '../types/index.ts'
import type { TableRow } from '../types/index.ts'
import initialFlatDataJson from '../config/mockDataWithoutTree.json'

const initialFlatData = initialFlatDataJson as TableRow[]
import { isRowEmpty, createNewRow } from './tableStoreUtils.ts'

interface FlatTableState {
  // ========== State ==========
  data: TableRow[]
  selectedRowId: number | null
  nextId: number

  // ========== Actions ==========
  setSelectedRowId: (id: number | null) => void
  addRow: () => void
  deleteRow: () => void
  updateName: (id: number, newValue: string) => void
  updateDataType: (id: number, newValue: DataType) => void
  updateDefaultValue: (id: number, newValue: string) => void
  updateComment: (id: number, newValue: string) => void
  isNameDuplicate: (id: number, name: string) => boolean
}

export const useFlatTableStore = create<FlatTableState>((set, get) => ({
  // ========== Initial State ==========
  data: initialFlatData,
  selectedRowId: null,
  nextId: Math.max(...initialFlatData.map((r) => r.id), 0) + 1,

  // ========== Actions ==========

  setSelectedRowId: (id) => set({ selectedRowId: id }),

  addRow: () => {
    const { data, nextId } = get()
    // 检查最后一行是否为空，如果为空则不添加新行
    if (data.length > 0 && isRowEmpty(data[data.length - 1])) {
      return
    }
    const newRow = createNewRow(nextId)
    set({
      data: [...data, newRow],
      nextId: nextId + 1,
    })
  },

  deleteRow: () => {
    const { selectedRowId, data } = get()
    if (!selectedRowId) return
    set({
      data: data.filter((row) => row.id !== selectedRowId),
      selectedRowId: null,
    })
  },

  updateName: (id, newValue) => {
    set((state) => ({
      data: state.data.map((row) =>
        row.id === id ? { ...row, name: newValue } : row
      ),
    }))
  },

  updateDataType: (id, newValue) => {
    set((state) => ({
      data: state.data.map((row) => {
        if (row.id === id) {
          let defaultValue = ''
          if (newValue === DataType.Bool) {
            defaultValue = DEFAULT_BOOL_VALUE
          } else if (newValue === DataType.Int) {
            defaultValue = DEFAULT_INT_VALUE
          }
          return { ...row, dataType: newValue, defaultValue }
        }
        return row
      }),
    }))
  },

  updateDefaultValue: (id, newValue) => {
    set((state) => ({
      data: state.data.map((row) =>
        row.id === id ? { ...row, defaultValue: newValue } : row
      ),
    }))
  },

  updateComment: (id, newValue) => {
    set((state) => ({
      data: state.data.map((row) =>
        row.id === id ? { ...row, comment: newValue } : row
      ),
    }))
  },

  isNameDuplicate: (id, name) => {
    const { data } = get()
    const trimmedName = name.trim().toLowerCase()
    return data.some((row) => row.id !== id && (row.name || '').trim().toLowerCase() === trimmedName)
  },
}))
