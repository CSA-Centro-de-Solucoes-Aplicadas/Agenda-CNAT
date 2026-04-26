const DATE_TIME_FORMATTER = new Intl.DateTimeFormat('pt-BR', {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
})

const DATE_FORMATTER = new Intl.DateTimeFormat('pt-BR', {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
})

const HOUR_FORMATTER = new Intl.DateTimeFormat('pt-BR', {
  hour: '2-digit',
  minute: '2-digit',
})

export function toDateInputValue(value?: string | null) {
  if (!value) return null

  const date = new Date(value)
  const timezoneOffset = date.getTimezoneOffset() * 60000
  return new Date(date.getTime() - timezoneOffset).toISOString().slice(0, 16)
}

export function toIsoString(value?: Date | string | null) {
  if (!value) return null
  return new Date(value).toISOString()
}

export function formatDateRange(start?: string | null, end?: string | null) {
  if (!start && !end) return 'Data a definir'
  if (!start || !end) return formatDate(start || end)

  const sameDay =
    new Date(start).toLocaleDateString('pt-BR') === new Date(end).toLocaleDateString('pt-BR')

  if (sameDay) {
    return `${formatDate(start)} • ${formatHour(start)} às ${formatHour(end)}`
  }

  return `${formatDateTime(start)} até ${formatDateTime(end)}`
}

export function formatDate(value?: string | null) {
  if (!value) return '--/--/----'
  return DATE_FORMATTER.format(new Date(value))
}

export function formatHour(value?: string | null) {
  if (!value) return '--:--'
  return HOUR_FORMATTER.format(new Date(value))
}

export function formatDateTime(value?: string | null) {
  if (!value) return '--/--/---- --:--'
  return DATE_TIME_FORMATTER.format(new Date(value))
}

export function isRegistrationOpen(start?: string | null, end?: string | null) {
  if (!start || !end) return false

  const now = new Date().getTime()
  return now >= new Date(start).getTime() && now <= new Date(end).getTime()
}
