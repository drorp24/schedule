/** @jsxImportSource @emotion/react */

import { useLocalDateTime } from '../utility/appUtilities'

import StartIcon from '@material-ui/icons/Timer'
import EndIcon from '@material-ui/icons/TimerOff'
import PlatformIcon from '@material-ui/icons/FlightTakeoffOutlined'
import PackageIcon from '@material-ui/icons/GroupWorkOutlined'
import FormationIcon from '@material-ui/icons/Inventory2Outlined'

const styles = {
  root: theme => ({
    visibility: 'hidden',
    direction: 'ltr',
    position: 'absolute',
    display: 'grid',
    gridTemplateColumns: '15% 85%',
    gap: '0.5rem',
    alignItems: 'center',
    zIndex: 400,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    color: 'white',
    fontWeight: 100,
    fontSize: '0.8rem',
    right: '1rem',
    top: '1rem',
    borderRadius: '5px',
    padding: '0.5rem',
    textAlign: 'left',
    width: '13rem',
  }),
  line: {
    width: '100%',
  },
}

const RecDetails = ({
  start,
  end,
  platform_id,
  drone_package_config_id,
  drone_formation,
}) => (
  <div css={styles.root} id="recDetails">
    <div>
      <StartIcon />
    </div>
    <div>{useLocalDateTime(start)}</div>

    <div>
      <EndIcon />
    </div>
    <div>{useLocalDateTime(end)}</div>

    <div>
      <PlatformIcon />
    </div>
    <div>{platform_id}</div>

    <div>
      <PackageIcon />
    </div>
    <div>{drone_package_config_id}</div>

    <div>
      <FormationIcon />
    </div>
    <div>{drone_formation}</div>
  </div>
)

export default RecDetails
