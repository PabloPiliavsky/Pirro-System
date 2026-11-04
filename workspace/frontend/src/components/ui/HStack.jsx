import { cn } from '@/lib/utils'

const ALIGN_MAP = {
  start: 'items-start',
  center: 'items-center',
  end: 'items-end',
  stretch: 'items-stretch',
  baseline: 'items-baseline',
}

const JUSTIFY_MAP = {
  start: 'justify-start',
  center: 'justify-center',
  end: 'justify-end',
  between: 'justify-between',
  around: 'justify-around',
  evenly: 'justify-evenly',
}

export function HStack({
  as: Component = 'div',
  align = 'center',
  justify,
  gap,
  wrap = false,
  className,
  ...props
}) {
  return (
    <Component
      className={cn(
        'flex flex-row',
        wrap ? 'flex-wrap' : 'flex-nowrap',
        align && ALIGN_MAP[align],
        justify && JUSTIFY_MAP[justify],
        gap && `gap-${gap}`,
        className
      )}
      {...props}
    />
  )
}
