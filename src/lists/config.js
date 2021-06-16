import lime from '@material-ui/core/colors/lime'
import lightBlue from '@material-ui/core/colors/lightBlue'
import deepOrange from '@material-ui/core/colors/deepOrange'
import RequestsIcon from '@material-ui/icons/ContentPasteOutlined'
import DepotsIcon from '@material-ui/icons/HomeWorkOutlined'
import ZonesIcon from '@material-ui/icons/TravelExploreOutlined'

const config = {
  requests: {
    name: 'requests',
    color: lime['A400'],
    filters: ['fulfilledBySelected', 'fulfilled', 'unfulfilled'],
    icon: <RequestsIcon />,
    avatar: <RequestsIcon />,
  },
  depots: {
    name: 'depots',
    color: lightBlue['A200'],
    filters: ['emplyedBySelected', 'employed', 'unemployed'],
    icon: <DepotsIcon />,
    exclude: ['geolocation'],
    avatar: <DepotsIcon />,
  },
  zones: {
    name: 'zones',
    color: deepOrange[500],
    filters: null,
    icon: <ZonesIcon />,
    exclude: ['geolocation'],
    avatar: <ZonesIcon />,
  },
}

export default config
