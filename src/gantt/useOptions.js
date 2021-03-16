import { useSelector } from 'react-redux'
import { useDirection } from '../utility/appUtilities'

import he from '../i18n/he.json'
import en from '../i18n/en.json'

const useOptions = () => {
  const { locale } = useSelector(store => store.app)
  const direction = useDirection()
  const rtl = direction === 'rtl'

  return {
    editable: true,
    groupdEditable: true,
    locales: {
      en,
      he,
    },
    locale,
    rollingMode: {
      // follow: true,
    },
    rtl,
    snap: null,
    // template: React...
    tooltip: {
      followMouse: true,
      // template: React...
    },
    type: 'range',
  }
}

export default useOptions
