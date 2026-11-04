// Anchored to REQ-AUTH-001, REQ-AUTH-006, REQ-AUTH-009
import { Navigate } from 'react-router-dom'
import { VStack } from '@/components/ui/VStack'
import { LoginForm } from './LoginForm'
import { LoginBrandingHeader } from './LoginBrandingHeader'
import { LoginCard } from './LoginCard'
import { LoginThemeToggle } from './LoginThemeToggle'
import { useLoginFlow } from '../hooks/useLoginFlow'

export function LoginPage({ theme, onToggleTheme }) {
  const { destination, isSubmitting, errorMessage, handleLogin } = useLoginFlow()

  if (destination) {
    return <Navigate to={destination} replace />
  }

  return (
    <VStack
      justify="center"
      align="center"
      className="min-h-screen px-4 py-8 bg-background relative overflow-hidden"
    >
      <LoginThemeToggle theme={theme} onToggleTheme={onToggleTheme} />

      <VStack className="w-full max-w-md gap-6">
        <LoginBrandingHeader />
        <LoginCard>
          <LoginForm
            onSubmit={handleLogin}
            isSubmitting={isSubmitting}
            errorMessage={errorMessage}
          />
        </LoginCard>
      </VStack>
    </VStack>
  )
}

export default LoginPage
