import { describe, expect, it } from 'vitest'
import {
  collectAllNamesRecursive,
  createNewRow,
  createNewTreeNode,
  deleteTreeNodeRecursive,
  findMaxId,
  isRowEmpty,
  updateTreeNodeRecursive,
} from '../store/tableStoreUtils.ts'
import { DataType } from '../types/index.ts'

const makeRow = (overrides = {}) => ({
  id: 1,
  name: '',
  dataType: '',
  defaultValue: '',
  comment: '',
  ...overrides,
})

describe('tableStoreUtils', () => {
  describe('isRowEmpty', () => {
    it('returns true when editable fields are empty', () => {
      expect(isRowEmpty(makeRow())).toBe(true)
    })

    it('returns false when any editable field has a value', () => {
      expect(isRowEmpty(makeRow({ name: 'start' }))).toBe(false)
      expect(isRowEmpty(makeRow({ dataType: DataType.Bool }))).toBe(false)
      expect(isRowEmpty(makeRow({ defaultValue: 'TRUE' }))).toBe(false)
      expect(isRowEmpty(makeRow({ comment: 'button' }))).toBe(false)
    })
  })

  it('creates a new flat row with empty defaults', () => {
    expect(createNewRow(42)).toEqual({
      id: 42,
      name: '',
      dataType: '',
      defaultValue: '',
      comment: '',
    })
  })

  it('creates tree nodes with optional children', () => {
    expect(createNewTreeNode(1)).toEqual({
      id: 1,
      name: '',
      dataType: '',
      defaultValue: '',
      comment: '',
      children: undefined,
    })

    expect(createNewTreeNode(2, true)).toEqual({
      id: 2,
      name: '',
      dataType: '',
      defaultValue: '',
      comment: '',
      children: [],
    })
  })

  it('collects names from all tree levels', () => {
    const data = [
      makeRow({ id: 1, name: 'Input', children: [makeRow({ id: 2, name: 'start' })] }),
      makeRow({ id: 3, name: undefined }),
    ]

    expect(collectAllNamesRecursive(data)).toEqual(new Map([
      [1, 'Input'],
      [2, 'start'],
      [3, ''],
    ]))
  })

  it('updates a nested tree node without changing unrelated nodes', () => {
    const data = [
      makeRow({
        id: 1,
        name: 'Input',
        children: [makeRow({ id: 2, name: 'start' })],
      }),
      makeRow({ id: 3, name: 'Output' }),
    ]

    const updated = updateTreeNodeRecursive(data, 2, (item) => ({
      ...item,
      name: 'stop',
    }))

    expect(updated[0].children?.[0].name).toBe('stop')
    expect(updated[1]).toBe(data[1])
  })

  it('deletes nodes at any tree level', () => {
    const data = [
      makeRow({
        id: 1,
        name: 'Input',
        children: [makeRow({ id: 2, name: 'start' }), makeRow({ id: 3, name: 'stop' })],
      }),
      makeRow({ id: 4, name: 'Output' }),
    ]

    expect(deleteTreeNodeRecursive(data, 2)).toEqual([
      makeRow({
        id: 1,
        name: 'Input',
        children: [makeRow({ id: 3, name: 'stop' })],
      }),
      makeRow({ id: 4, name: 'Output' }),
    ])

    expect(deleteTreeNodeRecursive(data, 4)).toEqual([
      makeRow({
        id: 1,
        name: 'Input',
        children: [makeRow({ id: 2, name: 'start' }), makeRow({ id: 3, name: 'stop' })],
      }),
    ])
  })

  it('finds the maximum id recursively', () => {
    const data = [
      makeRow({ id: 1, children: [makeRow({ id: 8 }), makeRow({ id: 3 })] }),
      makeRow({ id: 5 }),
    ]

    expect(findMaxId(data)).toBe(8)
    expect(findMaxId([])).toBe(0)
  })
})
