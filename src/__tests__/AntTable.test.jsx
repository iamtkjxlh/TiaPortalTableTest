import { fireEvent, render, screen, within } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import AntTable from '../components/AntTable.jsx'

const columns = [
  { key: 'name', title: 'Name', width: 160 },
  { key: 'dataType', title: 'Data type', width: 120 },
  { key: 'defaultValue', title: 'Default value', width: 120 },
  { key: 'comment', title: 'Comment', width: 160 },
]

const data = [
  { id: 1, name: 'start', dataType: 'Bool', defaultValue: 'TRUE', comment: 'Start button' },
  { id: 2, name: 'counter', dataType: 'Int', defaultValue: '0', comment: 'Counter value' },
]

const expectColumnHeader = (title) => {
  expect(screen.getAllByText(title).length).toBeGreaterThan(0)
}

describe('AntTable', () => {
  it('renders configured columns and row data', () => {
    render(<AntTable columns={columns} data={data} />)

    expectColumnHeader('Index')
    expectColumnHeader('Name')
    expectColumnHeader('Data type')
    expectColumnHeader('Default value')
    expectColumnHeader('Comment')
    expect(screen.getByText('start')).toBeInTheDocument()
    expect(screen.getByText('counter')).toBeInTheDocument()
    expect(screen.getByText('Start button')).toBeInTheDocument()
  })

  it('hides row numbers when showRowNumbers is false', () => {
    render(<AntTable columns={columns} data={data} showRowNumbers={false} />)

    expect(screen.queryAllByText('Index')).toHaveLength(0)
    expectColumnHeader('Name')
  })

  it('filters rows with invalid ids', () => {
    render(
      <AntTable
        columns={columns}
        data={[
          null,
          { id: undefined, name: 'missing id' },
          { id: Number.NaN, name: 'nan id' },
          { id: 3, name: 'valid row', dataType: 'Bool', defaultValue: 'TRUE', comment: '' },
        ]}
      />
    )

    expect(screen.getByText('valid row')).toBeInTheDocument()
    expect(screen.queryByText('missing id')).not.toBeInTheDocument()
    expect(screen.queryByText('nan id')).not.toBeInTheDocument()
  })

  it('calls onRowClick when a row is clicked', () => {
    const onRowClick = vi.fn()
    render(<AntTable columns={columns} data={data} onRowClick={onRowClick} />)

    fireEvent.click(screen.getByText('Start button'))

    expect(onRowClick).toHaveBeenCalledWith(data[0])
  })

  it('marks the selected row', () => {
    render(<AntTable columns={columns} data={data} selectedRowId={2} />)

    const selectedCell = screen.getByText('counter')
    const selectedRow = selectedCell.closest('tr')

    expect(selectedRow).toHaveClass('selected-row')
    expect(within(selectedRow).getByText('Counter value')).toBeInTheDocument()
  })
})
