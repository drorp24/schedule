import { useLocale } from '../utility/appUtilities'

import he from '../i18n/he.json'
import en from '../i18n/en.json'

import itemTemplate from './itemTemplate'

const useOptions = () => {
  const { locale, rtl } = useLocale()

  return {
    editable: true,
    groupEditable: true,
    dataAttributes: ['id'],
    locales: {
      en,
      he,
    },
    locale,
    rtl,
    snap: null,
    // template: itemTemplate,
    tooltip: {
      followMouse: true,
      // template: React...
    },
    type: 'range',
    minHeight: '100%',
  }
}

export default useOptions
