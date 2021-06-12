import { useSelector } from 'react-redux'

export const useMode = () => {
  const mode = useSelector(store => store.app.mode)
  const otherMode = mode === 'light' ? 'dark' : 'light'
  const light = mode === 'light'
  return { mode, otherMode, light }
}

export const useLocale = () => {
  const locale = useSelector(store => store.app.locale)
  const direction = locale === 'he' ? 'rtl' : 'ltr'
  const rtl = direction === 'rtl'
  const ltr = direction === 'ltr'
  const placement = rtl ? 'left' : 'right'
  const antiPlacement = rtl ? 'right' : 'left'
  const capitalPlacement = capitalize(placement)
  const capitalAntiPlacement = capitalize(antiPlacement)
  return {
    locale,
    direction,
    rtl,
    ltr,
    placement,
    antiPlacement,
    capitalPlacement,
    capitalAntiPlacement,
  }
}

export const useDrawer = () => useSelector(store => store.app.drawerOpen)

const dateOptions = {
  weekday: 'long',
  day: 'numeric',
  month: 'long',
  year: 'numeric',
}

const timeOptions = {
  hour: 'numeric',
  minute: 'numeric',
  hour12: false,
}

export const useLocaleDate = date => {
  const locale = useSelector(store => store.app.locale)
  const dateFormat = new Date(date)

  return dateFormat.toLocaleDateString(locale, dateOptions)
}

export const useUser = () => {
  let username = useSelector(store => store.users.loggedIn?.username)
  username = username || ''
  return { username }
}

export const useRunId = () => {
  const runId = useSelector(store => store.runs.selectedId)
  return runId
}

export const capitalize = s => {
  if (typeof s !== 'string') return ''
  return s.charAt(0).toUpperCase() + s.slice(1)
}

export const humanize = s => {
  if (typeof s !== 'string') return ''
  return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase().replace(/_/g, ' ')
}
export const localeDateTime = locale => date => {
  if (!locale || !date) return
  const dateFormat = new Date(date)
  return dateFormat.toLocaleTimeString(locale, {
    ...dateOptions,
    ...timeOptions,
  })
}
export const useLocalDate = date => {
  const locale = useSelector(store => store.app.locale)
  const dateFormat = new Date(date)

  return dateFormat.toLocaleDateString(locale, dateOptions)
}
export const useLocalDateTime = date => {
  const locale = useSelector(store => store.app.locale)
  const dateFormat = new Date(date)

  return dateFormat.toLocaleDateString(locale, {
    ...dateOptions,
    ...timeOptions,
  })
}
