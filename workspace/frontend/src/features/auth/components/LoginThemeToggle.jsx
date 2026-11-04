// Anchored to REQ-AUTH-001
import { Moon, Sun } from 'lucide-react'

export function LoginThemeToggle({ theme, onToggleTheme }) {
  if (!onToggleTheme) return null

  return (
    <button
      type="button"
      onClick={onToggleTheme}
      aria-label="Alternar tema"
      className="absolute top-4 right-4 p-2.5 rounded-full border border-border bg-card text-foreground hover:bg-secondary cursor-pointer transition-colors"
    >
      {theme === 'dark' ? (
        <Sun className="size-4 text-primary" />
      ) : (
        <Moon className="size-4 text-primary" />
      )}
    </button>
  )
}
