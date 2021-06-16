import he from '../i18n/he.json'
import en from '../i18n/en.json'

export const timelineOptions = ({ locale, rtl }) => ({
  editable: true,
  selectable: true,
  groupEditable: true,
  dataAttributes: 'all',
  locales: {
    en,
    he,
  },
  locale,
  rtl,
  snap: null,
  multiselect: true,
  // template: itemTemplate,
  // tooltip: {
  //   followMouse: true,
  //   // template: React...
  // },
  type: 'range',
  zoomable: false,
  onMove: (item, callback) => {
    console.log('onMove called')
    console.log('item: ', item)
    // callback(item)
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
})
