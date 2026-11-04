import { createContext, useContext, useState } from 'react'
import { cn } from '@/lib/utils'

// Anchored to REQ-FND-001, REQ-FND-002
const TabsContext = createContext({ value: '', onValueChange: () => {} })

export function Tabs({ defaultValue, value: controlledValue, onValueChange, className, children }) {
  const [uncontrolledValue, setUncontrolledValue] = useState(defaultValue || '')
  const activeValue = controlledValue !== undefined ? controlledValue : uncontrolledValue

  function handleValueChange(nextValue) {
    setUncontrolledValue(nextValue)
    if (onValueChange) onValueChange(nextValue)
  }

  return (
    <TabsContext.Provider value={{ value: activeValue, onValueChange: handleValueChange }}>
      <div className={cn('flex flex-col gap-4', className)}>{children}</div>
    </TabsContext.Provider>
  )
}

export function TabsList({ className, ...props }) {
  return (
    <div
      role="tablist"
      className={cn(
        'inline-flex min-h-10 items-center justify-start gap-1 rounded-lg border border-border bg-secondary p-1 text-muted-foreground',
        className
      )}
      {...props}
    />
  )
}

export function TabsTrigger({ value, className, ...props }) {
  const { value: activeValue, onValueChange } = useContext(TabsContext)
  const isActive = activeValue === value

  return (
    <button
      type="button"
      role="tab"
      aria-selected={isActive}
      onClick={() => onValueChange(value)}
      className={cn(
        'inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1.5 text-xs font-semibold transition-all cursor-pointer',
        isActive
          ? 'bg-primary text-primary-foreground shadow-sm'
          : 'text-muted-foreground hover:text-foreground',
        className
      )}
      {...props}
    />
  )
}

export function TabsContent({ value, className, children, ...props }) {
  const { value: activeValue } = useContext(TabsContext)
  if (activeValue !== value) return null

  return (
    <div role="tabpanel" className={cn('flex flex-col gap-4', className)} {...props}>
      {children}
    </div>
  )
}
