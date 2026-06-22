// Data Type 枚举
export enum DataType {
  Bool = 'Bool',
  Int = 'Int',
}

// Data Type 选项
export const DATA_TYPE_OPTIONS = [
  { value: DataType.Bool, label: 'Bool' },
  { value: DataType.Int, label: 'Int' },
]

// Int 范围常量
export const INT_MIN = -2147483648
export const INT_MAX = 2147483647

// Bool 默认值
export const DEFAULT_BOOL_VALUE = 'TRUE'
export const DEFAULT_INT_VALUE = '0'

// 表格行基础类型
export interface TableRow {
  id: number
  name: string
  dataType: DataType | ''
  defaultValue: string
  comment: string
}

// 树形表格行类型
export interface TableRowTree extends TableRow {
  children?: TableRowTree[]
}
