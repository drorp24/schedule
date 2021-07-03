/** @jsxImportSource @emotion/react */
import { useState, memo, useMemo } from 'react'
import { useSelector } from 'react-redux'
import { useMode } from '../utility/appUtilities'

import Select from '../lists/Select'
import Requests from '../lists/Requests'
import Depots from '../lists/Depots'
import Zones from '../lists/Zones'
import Map from '../map/Map'
import Gantt from '../gantt/Gantt'
import RecDetails, { useRecDetails } from '../gantt/RecDetails'

import noScrollBar from '../styling/noScrollbar'
import Paper from '@material-ui/core/Paper'
import blueGrey from '@material-ui/core/colors/blueGrey'
import grey from '@material-ui/core/colors/grey'

const Schedule = () => {
  const [list, setList] = useState(null)
  const { light } = useMode()
  const noListSelected = list === null

  const mode = useSelector(store => store.app.mode)

  const rowHeights = headerHeight => {
    let r = []
    const remainderHeight = 100 - headerHeight
    if (noListSelected) {
      const remainderHeightThird = remainderHeight / 3
      r = [
        headerHeight,
        remainderHeightThird,
        remainderHeightThird,
        remainderHeightThird,
      ]
    } else {
      r = [
        headerHeight,
        +(list === 'requests') * remainderHeight,
        +(list === 'depots') * remainderHeight,
        +(list === 'zones') * remainderHeight,
      ]
    }

    return r.join('% ') + '%'
  }

  const styles = {
    root: theme => ({
      display: 'grid',
      gridTemplateColumns: '30% 70%',
      // backgroundColor: theme.palette.background.backdrop,
    }),
    lists: {
      display: 'grid',
      gridTemplateRows: rowHeights(7),
      // padding: '0 0.5rem',
      zIndex: 401,
    },
    run: {
      overflow: 'hidden',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      borderRadius: '3px',
    },
    requests: theme => ({
      padding: noListSelected || list === 'requests' ? '1rem' : '0 1rem',
      borderTop: 'none',
      backgroundColor: light ? blueGrey[50] : grey[900],
      transition: 'height 0.5s',
      overflow: 'scroll',
      ...noScrollBar,
    }),
    depots: theme => ({
      padding: noListSelected || list === 'depots' ? '1rem' : '0 1rem',
      borderTop: 'none',
      backgroundColor: light ? blueGrey[50] : grey[900],
      transition: 'height 0.5s',
      overflow: 'scroll',
      ...noScrollBar,
    }),
    zones: theme => ({
      padding: noListSelected || list === 'zones' ? '1rem' : '0 1rem',
      borderTop: 'none',
      backgroundColor: light ? blueGrey[50] : grey[900],
      transition: 'height 0.5s',
      overflow: 'scroll',
      ...noScrollBar,
    }),
    results: {
      display: 'grid',
      gridTemplateRows: '60% 40%',
      backgroundColor: 'white',
      overflow: 'hidden',
    },
    gantt: theme => ({
      paddingTop: '2rem',
      backgroundColor:
        mode === 'light' ? 'rgba(0, 0, 0, 0.05)' : 'rgba(0, 0, 0, 0.8)',
      overflow: 'scroll',
      ...noScrollBar,
      borderTop: theme.palette.border,
    }),
    map: {},
    sectionTitle: {
      color: mode === 'dark' ? '#9e9e9e' : 'inherit',
    },
    logo: {
      position: 'fixed',
    },
    recDetails: {
      position: 'absolute',
    },
  }

  const noneHovered = useMemo(
    () => ({
      start: null,
      end: null,
      platform_id: null,
      drone_package_config_id: null,
      drone_formation: null,
    }),
    []
  )
  const [hovered, setHovered] = useState(noneHovered)

  useRecDetails({ setHovered, noneHovered })

  return (
    <div css={styles.root}>
      <Paper elevation={5} css={styles.lists}>
        <div css={{ ...styles.section, ...styles.run }}>
          <Select {...{ list, setList }} />
        </div>
        <div css={styles.requests}>
          <Requests />
        </div>
        <div css={styles.depots}>
          <Depots />
        </div>
        <div css={styles.zones}>
          <Zones />
        </div>
      </Paper>
      <div css={styles.results}>
        <div css={styles.map}>
          <Map />
        </div>
        <div css={styles.gantt}>
          <Gantt />
        </div>
        <div css={styles.recDetails}>
          <RecDetails {...hovered} />
        </div>
      </div>
    </div>
  )
}

export default memo(Schedule)
