// Anchored to REQ-FND-010, REQ-FND-015
import { describe, expect, test } from 'vitest'
import {
  DEV_DATA_MODE_STORAGE_KEY,
  getActiveDataMode,
  getProvider,
  setDevDataMode,
} from '@/services/dataProvider'

describe('Selector de Proveedor Dual (dataProvider.js)', () => {
  test('REQ-FND-010: Por defecto utiliza mockAdapter cuando no hay override', () => {
    expect(getActiveDataMode()).toBe('mock')
    expect(getProvider().mode).toBe('mock')
  })

  test('REQ-FND-010: Permite alternar en caliente entre mock y supabase en modo DEV', () => {
    setDevDataMode('supabase')
    expect(localStorage.getItem(DEV_DATA_MODE_STORAGE_KEY)).toBe('supabase')
    expect(getActiveDataMode()).toBe('supabase')
    expect(getProvider().mode).toBe('supabase')

    setDevDataMode('mock')
    expect(getActiveDataMode()).toBe('mock')
    expect(getProvider().mode).toBe('mock')
  })

  test('REQ-FND-010: Lanza error si se intenta configurar un modo desconocido', () => {
    expect(() => setDevDataMode('invalid-mode')).toThrow('Modo de datos inválido')
  })
})
