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
    icon: <RequestsIcon />,
    avatar: <RequestsIcon />,
    criteriaControls: true,
  },
  depots: {
    name: 'depots',
    color: lightBlue['A200'],
    icon: <DepotsIcon />,
    exclude: ['geolocation'],
    avatar: <DepotsIcon />,
    criteriaControls: true,
  },
  zones: {
    name: 'zones',
    color: deepOrange[500],
    icon: <ZonesIcon />,
    exclude: ['geolocation'],
    avatar: <ZonesIcon />,
    criteriaControls: false,
  },
}

export default config
