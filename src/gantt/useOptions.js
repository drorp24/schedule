import { useLocale } from '../utility/appUtilities'

import he from '../i18n/he.json'
import en from '../i18n/en.json'

const useOptions = () => {
  const { locale, rtl } = useLocale()

  return {
    editable: true,
    groupEditable: true,
    locales: {
      en,
      he,
    },
    locale,
    rtl,
    snap: null,
    // template: React...
    tooltip: {
      followMouse: true,
      // template: React...
    },
    type: 'range',
    minHeight: '100%',
  }
}

export default useOptions
