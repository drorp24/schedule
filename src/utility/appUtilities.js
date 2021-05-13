import { useSelector } from 'react-redux'

export const capitalize = s => {
  if (typeof s !== 'string') return ''
  return s.charAt(0).toUpperCase() + s.slice(1)
}

export const humanize = s => {
  if (typeof s !== 'string') return ''
  return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase().replace(/_/g, ' ')
}

export const useDirection = () => {
  const locale = useSelector(store => store.app.locale)
  return locale === 'he' ? 'rtl' : 'ltr'
}

export const useLocale = () => {
  const locale = useSelector(store => store.app.locale)
  const direction = locale === 'he' ? 'rtl' : 'ltr'
  const rtl = direction === 'rtl'
  const placement = rtl ? 'left' : 'right'
  const antiPlacement = rtl ? 'right' : 'left'
  const capitalPlacement = capitalize(placement)
  const capitalAntiPlacement = capitalize(antiPlacement)
  return {
    locale,
    direction,
    rtl,
    placement,
    antiPlacement,
    capitalPlacement,
    capitalAntiPlacement,
  }
}

export const useOtherDirection = () => {
  const locale = useSelector(store => store.app.locale)
  return locale === 'he' ? 'ltr' : 'trl'
}

export const useOtherMode = () => {
  const mode = useSelector(store => store.app.mode)
  return mode === 'light' ? 'dark' : 'light'
}

export const useMode = () => {
  const mode = useSelector(store => store.app.mode)
  const otherMode = mode === 'light' ? 'dark' : 'light'
  const light = mode === 'light'
  return { mode, otherMode, light }
}

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

// unlike useLocalDate, which returns a hook, hence cannot be invoked inside a callback (e.g., 'map'),
// useLocaleDate returns a function. which can be invoked inside a callback
// so you would do something like const d = useLocaleDate(), then you can use the 'd' function anywhere you like.
export const useLocaleDate = () => useLocalDate

// following is yet another version, which is not hook based and requires locale as input
// since the hook-based version don't always work, for some unknown reason
export const localeDate = locale => date => {
  if (!locale || !date) return
  const dateFormat = new Date(date)
  return dateFormat.toLocaleDateString(locale, dateOptions)
}

export const localeDateTime = locale => date => {
  if (!locale || !date) return
  const dateFormat = new Date(date)
  return dateFormat.toLocaleTimeString(locale, {
    ...dateOptions,
    ...timeOptions,
  })
}

// assumption: element is smaller than box
export const inside = (box, element) => {
  if (!Object.values(element).length) return false

  const elementX1 = element.x + element.width
  const elementY1 = element.y + element.height
  const boxX1 = box.x + box.width
  const boxY1 = box.y + box.height

  const result =
    ((elementX1 < boxX1 && elementX1 > box.x) ||
      (element.x < boxX1 && element.x > box.x)) &&
    ((elementY1 < boxY1 && elementY1 > box.y) ||
      (element.y < boxY1 && element.y > box.y))

  return result
}
