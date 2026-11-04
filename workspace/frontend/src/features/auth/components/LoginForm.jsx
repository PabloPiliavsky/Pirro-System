// Anchored to REQ-AUTH-001, REQ-AUTH-003, REQ-AUTH-004, REQ-AUTH-012
import { useState } from 'react'
import { VStack } from '@/components/ui/VStack'
import { LoginErrorAlert } from './LoginErrorAlert'
import { LoginCredentialsFields } from './LoginCredentialsFields'
import { LoginSubmitButton } from './LoginSubmitButton'
import { DevQuickLogin } from './DevQuickLogin'

export function LoginForm({ onSubmit, isSubmitting, errorMessage }) {
  const [identifier, setIdentifier] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!identifier.trim() || !password) return
    onSubmit({ identifier: identifier.trim(), password })
  }

  const handleQuickAccount = (quickId, quickPass) => {
    setIdentifier(quickId)
    setPassword(quickPass)
    onSubmit({ identifier: quickId, password: quickPass })
  }

  const isButtonDisabled = !identifier.trim() || !password

  return (
    <form onSubmit={handleSubmit}>
      <VStack className="gap-4">
        <LoginErrorAlert errorMessage={errorMessage} />
        <LoginCredentialsFields
          identifier={identifier}
          password={password}
          onIdentifierChange={setIdentifier}
          onPasswordChange={setPassword}
          isSubmitting={isSubmitting}
        />
        <LoginSubmitButton
          isSubmitting={isSubmitting}
          isDisabled={isButtonDisabled}
        />
        <DevQuickLogin
          onSelectAccount={handleQuickAccount}
          isSubmitting={isSubmitting}
        />
      </VStack>
    </form>
  )
}

export default LoginForm
