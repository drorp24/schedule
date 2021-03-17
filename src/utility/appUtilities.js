import { useSelector } from 'react-redux'

export const useDirection = () => {
  const locale = useSelector(store => store.app.locale)
  return locale === 'he' ? 'rtl' : 'ltr'
}

export const useLocale = () => {
  const locale = useSelector(store => store.app.locale)
  const direction = locale === 'he' ? 'rtl' : 'ltr'
  const rtl = direction === 'rtl'
  return { locale, direction, rtl }
}

export const useOtherDirection = () => {
  const locale = useSelector(store => store.app.locale)
  return locale === 'he' ? 'ltr' : 'trl'
}

export const useOtherMode = () => {
  const mode = useSelector(store => store.app.mode)
  return mode === 'light' ? 'dark' : 'light'
}

const dateOptions = {
  weekday: 'long',
  day: 'numeric',
  month: 'long',
  year: 'numeric',
}

const dateTimeOptions = {
  ...dateOptions,
  hour: 'numeric',
  minute: 'numeric',
  hour12: true,
}

export const useLocalDate = date => {
  const { locale } = useSelector(store => store.app)
  const dateFormat = new Date(date)

  return dateFormat.toLocaleDateString(locale, dateOptions)
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
