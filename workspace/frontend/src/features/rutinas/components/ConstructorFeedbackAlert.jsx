// Anchored to REQ-RUT-008

export function ConstructorFeedbackAlert({ mensaje }) {
  if (!mensaje) return null

  const isSuccess = mensaje.tipo === 'success'
  const colorClass = isSuccess
    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
    : 'bg-red-500/10 border-red-500/30 text-red-400'

  return (
    <div className={`p-3.5 rounded-xl text-xs font-bold border transition-all ${colorClass}`}>
      {mensaje.texto}
    </div>
  )
}

export default ConstructorFeedbackAlert
