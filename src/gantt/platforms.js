import { keyProxy } from '../utility/proxies'

const platforms = keyProxy({
  'drone_loading_dock_1-drone_type_1': {
    backgroundColor: '#D5DDF6',
    borderColor: '#97B0F8',
  },
  'drone_loading_dock_1-drone_type_4': {
    backgroundColor: '#ffecb3',
    borderColor: '#aed581',
  },
  UNDEFINED: {
    backgroundColor: 'lightgrey',
    borderColor: 'darkgrey',
  },
})

export default platforms
