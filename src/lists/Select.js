/** @jsxImportSource @emotion/react */
import { memo } from 'react'
import RunSelection from './runs/RunSelection'

import ToggleButtonGroup from '@material-ui/core/ToggleButtonGroup'
import ToggleButton from '@material-ui/core/ToggleButton'

import RequestsIcon from '@material-ui/icons/ContentPasteOutlined'
import DepotsIcon from '@material-ui/icons/FlightTakeoffOutlined'
import ZonesIcon from '@material-ui/icons/TravelExploreOutlined'

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
  depotsIcon: {
    fontSize: '1.2rem !important',
  },
  zonesIcon: {
    fontSize: '1.2rem !important',
  },
}

const ListSelection = memo(({ list, setList }) => {
  console.log('ListSelection is rendered')
  const handleListSelection = (event, newList) => {
    console.log('List Selection, setting newList: ', newList)
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
        <ToggleButton value="depots" css={styles.button}>
          <DepotsIcon css={styles.depotsIcon} />
        </ToggleButton>
        <ToggleButton value="zones" css={styles.button}>
          <ZonesIcon css={styles.zonesIcon} />
        </ToggleButton>
      </ToggleButtonGroup>
    </div>
  )
})

const Select = ({ list, setList }) => {
  console.log(
    'Select is rendered, that includes RunSelection and ListSelection'
  )
  return (
    <div css={styles.header}>
      <RunSelection />
      <ListSelection {...{ list, setList }} />
    </div>
  )
}

export default memo(Select)
