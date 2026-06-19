/**
 * 表格数据 API 接口层
 * 为未来服务端数据加载做准备
 */

// 模拟网络延迟
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

/**
 * 获取表格数据
 * @param {Object} params - 查询参数
 * @param {string} params.blockId - 数据块 ID
 * @param {number} params.page - 页码
 * @param {number} params.pageSize - 每页数量
 * @returns {Promise<Object>} 表格数据
 */
export const fetchTableData = async (params = {}) => {
  // 模拟网络请求
  await delay(300)

  // 未来替换为真实 API 调用
  // const response = await fetch('/api/table-data', {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify(params),
  // })
  //
  // if (!response.ok) {
  //   throw new Error('Failed to fetch table data')
  // }
  //
  // return response.json()

  // 目前返回模拟数据
  return {
    success: true,
    data: [
      {
        id: 1,
        path: ["Input"],
        name: "Input",
        dataType: "",
        defaultValue: "",
        retain: "",
        accessible: "",
        writable: "",
        visible: "",
        setpoint: "",
        supervision: "",
        comment: ""
      },
      {
        id: 2,
        path: ["Input", "start"],
        name: "start",
        dataType: "Bool",
        defaultValue: "false",
        retain: "",
        accessible: "",
        writable: "",
        visible: "",
        setpoint: "",
        supervision: "",
        comment: ""
      },
      {
        id: 3,
        path: ["Input", "stop"],
        name: "stop",
        dataType: "Bool",
        defaultValue: "false",
        retain: "",
        accessible: "",
        writable: "",
        visible: "",
        setpoint: "",
        supervision: "",
        comment: ""
      },
    ],
    total: 3,
    page: params.page || 1,
    pageSize: params.pageSize || 50,
  }
}

/**
 * 保存表格数据
 * @param {Object} data - 要保存的数据
 * @returns {Promise<Object>} 保存结果
 */
export const saveTableData = async (data) => {
  await delay(200)
  return { success: true, message: '保存成功' }
}

/**
 * 删除行数据
 * @param {number|string} rowId - 行 ID
 * @returns {Promise<Object>} 删除结果
 */
export const deleteTableRow = async (rowId) => {
  await delay(200)
  return { success: true, message: '删除成功' }
}
