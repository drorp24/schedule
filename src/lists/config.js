import blue from '@material-ui/core/colors/blue'
import orange from '@material-ui/core/colors/orange'
import red from '@material-ui/core/colors/red'
import RequestsIcon from '@material-ui/icons/ListAltOutlined'
import ResourcesIcon from '@material-ui/icons/ArtTrackOutlined'
import DirectivesIcon from '@material-ui/icons/LandscapeOutlined'

const config = {
  requests: {
    color: orange[500],
    filter: 'fulfilled',
    icon: <RequestsIcon style={{ fontSize: '1.2rem' }} />,
  },
  resources: {
    color: blue[500],
    filter: 'employed',
    icon: <ResourcesIcon />,
  },
  directives: {
    color: red[500],
    icon: <DirectivesIcon />,
  },
}

export default config
