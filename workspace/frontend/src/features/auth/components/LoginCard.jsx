// Anchored to REQ-AUTH-001
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'

export function LoginCard({ children }) {
  return (
    <Card className="border-border bg-card/90 shadow-xl backdrop-blur-sm">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-bold">Ingresar a tu Cuenta</CardTitle>
        <CardDescription className="text-xs">
          Ingresá con tu email o nombre de usuario registrado
        </CardDescription>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  )
}
