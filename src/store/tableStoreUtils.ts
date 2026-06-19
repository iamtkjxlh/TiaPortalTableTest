import type { TableRow, TableRowTree } from '../types/index.ts'

// ========== 通用 Helper 函数 ==========

/**
 * 检查行是否为空（所有字段无值）
 */
export const isRowEmpty = (row: TableRow): boolean => {
  return !row.name && !row.dataType && !row.defaultValue && !row.comment
}

/**
 * 创建新的空表格行
 */
export const createNewRow = (id: number): TableRow => ({
  id,
  name: '',
  dataType: '',
  defaultValue: '',
  comment: '',
})

/**
 * 创建新的树形表格行
 */
export const createNewTreeNode = (id: number, hasChildren = false): TableRowTree => ({
  ...createNewRow(id),
  children: hasChildren ? [] : undefined,
})

// ========== 树形结构递归操作 ==========

/**
 * 递归收集所有节点的 name 用于重复检查
 */
export const collectAllNamesRecursive = (items: TableRowTree[]): Map<number, string> => {
  const nameMap = new Map<number, string>()
  const traverse = (nodes: TableRowTree[]) => {
    nodes.forEach((item) => {
      nameMap.set(item.id, item.name || '')
      if (item.children) traverse(item.children)
    })
  }
  traverse(items)
  return nameMap
}

/**
 * 递归更新树形节点
 */
export const updateTreeNodeRecursive = (
  items: TableRowTree[],
  id: number,
  updater: (item: TableRowTree) => TableRowTree
): TableRowTree[] => {
  return items.map((item) => {
    if (item.id === id) {
      return updater(item)
    }
    if (item.children) {
      return {
        ...item,
        children: updateTreeNodeRecursive(item.children, id, updater),
      }
    }
    return item
  })
}

/**
 * 递归删除树形节点
 */
export const deleteTreeNodeRecursive = (items: TableRowTree[], id: number): TableRowTree[] => {
  return items
    .filter((item) => item.id !== id)
    .map((item) => {
      if (item.children) {
        return {
          ...item,
          children: deleteTreeNodeRecursive(item.children, id),
        }
      }
      return item
    })
}

/**
 * 查找树中的最大 ID
 */
export const findMaxId = (items: TableRowTree[]): number => {
  let maxId = 0
  const traverse = (nodes: TableRowTree[]) => {
    nodes.forEach((item) => {
      if (item.id > maxId) maxId = item.id
      if (item.children) traverse(item.children)
    })
  }
  traverse(items)
  return maxId
}
