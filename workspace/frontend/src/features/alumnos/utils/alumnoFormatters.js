// Anchored to REQ-ALU-007, REQ-ALU-008

export function calcularEdad(fechaNacimiento) {
  if (!fechaNacimiento) return null
  const nacimiento = new Date(fechaNacimiento)
  if (isNaN(nacimiento.getTime())) return null

  const hoy = new Date()
  let edad = hoy.getFullYear() - nacimiento.getFullYear()
  const mesDiff = hoy.getMonth() - nacimiento.getMonth()
  if (mesDiff < 0 || (mesDiff === 0 && hoy.getDate() < nacimiento.getDate())) {
    edad--
  }
  return edad >= 0 ? edad : null
}

export function calcularIMC(pesoKg, alturaCm) {
  const peso = Number(pesoKg)
  const altura = Number(alturaCm)
  if (!peso || !altura || peso <= 0 || altura <= 0) return null

  const alturaMetros = altura / 100
  const valor = Number((peso / (alturaMetros * alturaMetros)).toFixed(1))

  let categoria = 'Peso normal'
  let color = 'text-emerald-500'

  if (valor < 18.5) {
    categoria = 'Bajo peso'
    color = 'text-amber-500'
  } else if (valor >= 25 && valor < 30) {
    categoria = 'Sobrepeso'
    color = 'text-amber-500'
  } else if (valor >= 30) {
    categoria = 'Obesidad'
    color = 'text-destructive'
  }

  return { valor, categoria, color }
}

export function formatearWhatsAppLink(telefono, alumnoNombre = '') {
  if (!telefono || typeof telefono !== 'string') return null
  const digitos = telefono.replace(/\D/g, '')
  if (!digitos || digitos.length < 8) return null

  let cleanNumber = digitos
  if (!cleanNumber.startsWith('54') && cleanNumber.length === 10) {
    cleanNumber = `549${cleanNumber}`
  }

  const saludo = alumnoNombre ? `¡Hola ${alumnoNombre}!` : '¡Hola!'
  const mensaje = `${saludo} Te contacto de Pirro-System para coordinar tu entrenamiento.`
  return `https://wa.me/${cleanNumber}?text=${encodeURIComponent(mensaje)}`
}

export function formatearFecha(fechaStr) {
  if (!fechaStr) return '-'
  try {
    const parts = String(fechaStr).split('-')
    if (parts.length === 3) {
      return `${parts[2]}/${parts[1]}/${parts[0]}`
    }
    return new Date(fechaStr).toLocaleDateString('es-AR')
  } catch {
    return String(fechaStr)
  }
}
