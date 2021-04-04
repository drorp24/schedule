import blue from '@material-ui/core/colors/blue'
import orange from '@material-ui/core/colors/orange'
import red from '@material-ui/core/colors/red'
import RequestsIcon from '@material-ui/icons/ListAltOutlined'
import ResourcesIcon from '@material-ui/icons/ArtTrackOutlined'
import DirectivesIcon from '@material-ui/icons/LandscapeOutlined'

const config = {
  requests: {
    color: orange[500],
    filters: ['fulfilledBySelected', 'fulfilled', 'unfulfilled'],
    icon: <RequestsIcon style={{ fontSize: '1.2rem' }} />,
  },
  resources: {
    color: blue[500],
    filters: ['emplyedBySelected', 'employed', 'unemployed'],
    icon: <ResourcesIcon />,
  },
  directives: {
    color: red[500],
    filters: null,
    icon: <DirectivesIcon />,
  },
}

export default config
