/** @jsxImportSource @emotion/react */
import { useEffect } from 'react'
import { useLocalDateTime } from '../utility/appUtilities'

import StartIcon from '@material-ui/icons/Timer'
import EndIcon from '@material-ui/icons/TimerOff'
import PlatformIcon from '@material-ui/icons/FlightTakeoffOutlined'
import PackageIcon from '@material-ui/icons/GroupWorkOutlined'
import FormationIcon from '@material-ui/icons/Inventory2Outlined'
import RecIcon from '@material-ui/icons/SettingsSuggestOutlined'
import Divider from '@material-ui/core/Divider'

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
  divider: {
    paddingRight: '0.5rem',
    '& hr': {
      color: 'white',
      borderBottomColor: 'rgba(256, 256, 256, 0.4)',
      borderWidth: '1px',
    },
  },
}

// ! hover vs. select
// vis-timeline elements are rendered by vis-timeline, outside of React domain.
// In order to be able to detect which rec is it that is being hovered or selected,
// the elements carry info on the DOM iteself, using old-fashioned html5 data fields
// rather than holding it as component state.
//
// But the hover handling is different than the one for select:
// While select event dispatches a redux event that Map Features reacts to and renders accordingly,
// as is customary in React, hover event dispatches nothing; instead, it sets RecDetails' state directly.
// This is to save redux i/o while hovering.
//
// The two events are also different in how they are triggered:
// While 'select' is using vis-timeline's native select event, 'hover' does it here with explicit id and good old event listener.
// The reason is that this enables RecDetails to be populated the React way, plus use hooks like useLocalDateTime.
// Otherwise it would have to be populated in a vis-timeline event in a jQuery-like fashion,
// with explicit element references, and no hooks to help.
//
// The reason RecDetails is rendered at Schedule and not in Gantt is that it won't otherwise show on the map.
export const useRecDetails = ({ setHovered, noneHovered }) => {
  useEffect(() => {
    const recDetails = document.getElementById('recDetails')

    document
      .querySelector('#gantt')
      .addEventListener('mouseover', function (e) {
        if (e.target.hasAttribute('data-id')) {
          recDetails.style.visibility = 'visible'
          setHovered(e.target.dataset)
        }
      })

    document.querySelector('#gantt').addEventListener('mouseout', function (e) {
      if (!e.target.hasAttribute('data-id')) {
        recDetails.style.visibility = 'hidden'
        setHovered(noneHovered)
      }
    })
  }, [noneHovered, setHovered])
}

const RecDetails = ({
  id,
  start,
  end,
  platform_id,
  drone_package_config_id,
  drone_formation,
  classname,
}) => (
  <div css={styles.root} id="recDetails" className={classname}>
    <div>
      <RecIcon />
    </div>
    <div>{id}</div>

    <div></div>
    <div css={styles.divider}>
      <Divider />
    </div>

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
