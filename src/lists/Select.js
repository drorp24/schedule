/** @jsxImportSource @emotion/react */
import { memo } from 'react'
import RunSelection from './runs/RunSelection'

import ToggleButtonGroup from '@material-ui/core/ToggleButtonGroup'
import ToggleButton from '@material-ui/core/ToggleButton'

import RequestsIcon from '@material-ui/icons/ListAltOutlined'
import ResourcesIcon from '@material-ui/icons/ArtTrackOutlined'
import DirectivesIcon from '@material-ui/icons/LandscapeOutlined'

const styles = {
  sectionTitle: {
    fontSize: '0.75rem',
  },
  header: {
    width: '100%',
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
  buttonGroup: {
    height: '4vh',
  },
  requestsIcon: {
    fontSize: '1.2rem !important',
  },
  resourcesIcon: {
    fontSize: '1.7rem !important',
  },
}

const ListSelection = memo(({ list, setList }) => {
  const handleListSelection = (event, newList) => {
    setList(newList)
  }

  return (
    <div css={styles.listSelection}>
      <ToggleButtonGroup
        exclusive
        value={list}
        onChange={handleListSelection}
        size="small"
        css={styles.buttonGroup}
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
  )
})

const Select = ({ list, setList }) => (
  <div css={styles.header}>
    <RunSelection />
    <ListSelection {...{ list, setList }} />
  </div>
)

export default memo(Select)
