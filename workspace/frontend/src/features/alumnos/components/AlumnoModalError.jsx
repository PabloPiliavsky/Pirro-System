// Anchored to REQ-ALU-002

export function AlumnoModalError({ message }) {
  if (!message) return null
  return (
    <div className="mt-3 p-3 bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-lg">
      {message}
    </div>
  )
}
