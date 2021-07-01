import lime from '@material-ui/core/colors/lime'
import lightBlue from '@material-ui/core/colors/lightBlue'
import lightGreen from '@material-ui/core/colors/lightGreen'
import deepOrange from '@material-ui/core/colors/deepOrange'
import yellow from '@material-ui/core/colors/yellow'
import RequestsIcon from '@material-ui/icons/ContentPasteOutlined'
import ZonesIcon from '@material-ui/icons/TravelExploreOutlined'
import DepotsIcon from '@material-ui/icons/FlightTakeoffOutlined'

import MatchedIcon from '@material-ui/icons/AssignmentTurnedInOutlined'
import UnmatchedIcon from '@material-ui/icons/AssignmentLateOutlined'

const config = {
  requests: {
    name: 'requests',
    // color: lime['A400'],
    color: yellow[200],
    icon: <RequestsIcon />,
    avatar: <RequestsIcon />,
    criteriaControls: true,
    popupTitle: 'request',
  },
  depots: {
    name: 'depots',
    color: lightBlue['A200'],
    icon: <DepotsIcon />,
    exclude: ['geolocation'],
    avatar: <DepotsIcon />,
    criteriaControls: false,
    popupTitle: 'depot',
    listheader: 'depotDeliveries',
  },
  zones: {
    name: 'zones',
    color: lightGreen['A400'],
    icon: <ZonesIcon />,
    exclude: ['geolocation'],
    avatar: <ZonesIcon />,
    criteriaControls: false,
    popupTitle: 'zone',
    listheader: 'zoneMoreDetails',
  },
  matched: {
    icon: <MatchedIcon />,
    // color: delivery's color
  },
  unmatched: {
    icon: <UnmatchedIcon />,
    color: 'grey',
  },
}

export default config
