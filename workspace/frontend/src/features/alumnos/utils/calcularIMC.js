// Anchored to REQ-ALU-007, REQ-ALU-008

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
