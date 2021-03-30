import { useLocale } from '../utility/appUtilities'

import he from '../i18n/he.json'
import en from '../i18n/en.json'

// import itemTemplate from './itemTemplate'

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
    onMove: (item, callback) => {
      console.log('onMove called')
      console.log('item: ', item)
      callback(item)
    },
    onAdd: (item, callback) => {
      console.log('onAdd called')
      console.log('item: ', item)
      callback(item)
    },
    onUpdate: (item, callback) => {
      console.log('onUpdate called')
      console.log('item: ', item)
      const response = prompt('Update recommendation', 'Edit me')
      if (response) {
        item.content = response
        callback(item)
      } else {
        callback(null)
      }
    },
    onRemove: (item, callback) => {
      console.log('onRemove called')
      console.log('item: ', item)
      callback(item)
    },
  }
}

export default useOptions
