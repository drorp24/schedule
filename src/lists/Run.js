/** @jsxImportSource @emotion/react */
import { useLocalDate } from '../utility/appUtilities'

import ToggleButtonGroup from '@material-ui/core/ToggleButtonGroup'
import ToggleButton from '@material-ui/core/ToggleButton'

import RequestsIcon from '@material-ui/icons/ListAltOutlined'
import ResourcesIcon from '@material-ui/icons/ArtTrackOutlined'
// import DirectivesIcon from '@material-ui/icons/EditNotificationsOutlined'
import DirectivesIcon from '@material-ui/icons/LandscapeOutlined'

const styles = {
  root: theme => ({
    width: '100%',
  }),
  sectionTitle: {
    fontSize: '0.75rem',
  },
  runHeader: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  button: {
    padding: '0 !important',
    width: '2.75rem',
  },
  listSelection: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  requestsIcon: {
    fontSize: '1.2rem !important',
  },
  resourcesIcon: {
    fontSize: '1.7rem !important',
  },
}

const Run = ({ list, setList }) => {
  const lPubDate = useLocalDate('2021-03-08T11:08:01.990411')

  const handleListSelection = (event, newList) => {
    setList(newList)
  }

  return (
    <div css={styles.root}>
      <div css={styles.runHeader}>
        <div css={styles.sectionTitle}>{lPubDate}</div>
        <div css={styles.listSelection}>
          <ToggleButtonGroup
            exclusive
            value={list}
            onChange={handleListSelection}
            size="small"
          >
            <ToggleButton value="requests" css={styles.button}>
              <RequestsIcon css={styles.requestsIcon} />
            </ToggleButton>
            <ToggleButton value="resources" css={styles.button}>
              <ResourcesIcon css={styles.resourcesIcon} />
            </ToggleButton>
            <ToggleButton value="directives" css={styles.button}>
              <DirectivesIcon />
            </ToggleButton>
          </ToggleButtonGroup>
        </div>
      </div>
    </div>
  )
}

export default Run
