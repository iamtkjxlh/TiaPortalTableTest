import { act, renderHook } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { useCellEdit } from '../hooks/useCellEdit.js'

describe('useCellEdit', () => {
  it('starts in read mode with the provided value', () => {
    const { result } = renderHook(() => useCellEdit({ value: 'start' }))

    expect(result.current.editing).toBe(false)
    expect(result.current.inputValue).toBe('start')
  })

  it('enters edit mode and calls onStartEdit when clicked', () => {
    const onStartEdit = vi.fn()
    const stopPropagation = vi.fn()
    const { result } = renderHook(() => useCellEdit({ value: 'start', onStartEdit }))

    act(() => {
      result.current.handleClick({ stopPropagation })
    })

    expect(onStartEdit).toHaveBeenCalledTimes(1)
    expect(stopPropagation).toHaveBeenCalledTimes(1)
    expect(result.current.editing).toBe(true)
    expect(result.current.inputValue).toBe('start')
  })

  it('saves formatted values and exits edit mode', () => {
    const onSave = vi.fn()
    const { result } = renderHook(() =>
      useCellEdit({
        value: 'start',
        onSave,
        formatValue: (value) => value.trim(),
      })
    )

    act(() => {
      result.current.handleClick({ stopPropagation: vi.fn() })
      result.current.setInputValue('  stop  ')
    })

    act(() => {
      result.current.handleSave()
    })

    expect(onSave).toHaveBeenCalledWith('stop')
    expect(result.current.editing).toBe(false)
  })

  it('keeps editing when validation fails', () => {
    const onSave = vi.fn()
    const { result } = renderHook(() =>
      useCellEdit({
        value: 'start',
        onSave,
        validate: () => false,
      })
    )

    act(() => {
      result.current.handleClick({ stopPropagation: vi.fn() })
      result.current.setInputValue('')
    })

    let saved
    act(() => {
      saved = result.current.handleSave()
    })

    expect(saved).toBe(false)
    expect(onSave).not.toHaveBeenCalled()
    expect(result.current.editing).toBe(true)
  })

  it('saves on Enter and cancels on Escape', () => {
    const onSave = vi.fn()
    const preventDefault = vi.fn()
    const { result } = renderHook(() => useCellEdit({ value: 'start', onSave }))

    act(() => {
      result.current.handleClick({ stopPropagation: vi.fn() })
      result.current.setInputValue('stop')
    })

    act(() => {
      result.current.handleKeyDown({ key: 'Enter', preventDefault })
    })

    expect(preventDefault).toHaveBeenCalledTimes(1)
    expect(onSave).toHaveBeenCalledWith('stop')
    expect(result.current.editing).toBe(false)

    act(() => {
      result.current.handleClick({ stopPropagation: vi.fn() })
      result.current.setInputValue('changed')
    })

    act(() => {
      result.current.handleKeyDown({ key: 'Escape' })
    })

    expect(result.current.inputValue).toBe('start')
    expect(result.current.editing).toBe(false)
  })

  it('saves on blur', () => {
    const onSave = vi.fn()
    const { result } = renderHook(() => useCellEdit({ value: 'start', onSave }))

    act(() => {
      result.current.handleClick({ stopPropagation: vi.fn() })
      result.current.setInputValue('stop')
    })

    act(() => {
      result.current.handleBlur()
    })

    expect(onSave).toHaveBeenCalledWith('stop')
    expect(result.current.editing).toBe(false)
  })
})
