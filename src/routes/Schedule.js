/** @jsxImportSource @emotion/react */
import { useState, memo, useMemo } from 'react'
import { useSelector } from 'react-redux'
// import useTranslation from '../i18n/useTranslation'

import Select from '../lists/Select'
import Requests from '../lists/Requests'
import Depots from '../lists/Depots'
import Zones from '../lists/Zones'
import Map from '../map/Map'
import Gantt from '../gantt/Gantt'
import RecDetails, { useRecDetails } from '../gantt/RecDetails'

import noScrollBar from '../styling/noScrollbar'
import Paper from '@material-ui/core/Paper'

const Schedule = () => {
  const [list, setList] = useState(null)
  const noListSelected = list === null

  const mode = useSelector(store => store.app.mode)

  const heights = {
    run: 5,
  }

  heights.list = (100 - heights.run - 6) / 3

  const styles = {
    root: theme => ({
      display: 'grid',
      gridTemplateColumns: '30fr 70fr',
      backgroundColor: theme.palette.background.backdrop,
    }),
    lists: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-around',
      padding: '0 0.5rem',
      zIndex: 401,
    },
    run: {
      height: `${heights.run}%`,
      overflow: 'hidden',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      borderRadius: '3px',
    },
    requests: theme => ({
      height: noListSelected
        ? `${heights.list}%`
        : list === 'requests'
        ? '100%'
        : 0,
      padding: noListSelected || list === 'requests' ? '1rem' : '0 1rem',
      border: noListSelected || list === 'requests' ? '1px solid' : 'none',
      borderColor:
        mode === 'light' ? 'rgba(0, 0, 0, 0.2)' : 'rgba(256, 256, 256, 0.2)',
      borderRadius: '4px',
      borderTop: 'none',
      backgroundColor: theme.palette.background.backdrop,
      transition: 'height 0.5s',
      overflow: 'scroll',
      ...noScrollBar,
    }),
    depots: theme => ({
      height: noListSelected
        ? `${heights.list}%`
        : list === 'depots'
        ? '100%'
        : 0,
      padding: noListSelected || list === 'depots' ? '1rem' : '0 1rem',
      border: noListSelected || list === 'depots' ? '1px solid' : 'none',
      borderColor:
        mode === 'light' ? 'rgba(0, 0, 0, 0.2)' : 'rgba(256, 256, 256, 0.2)',
      borderRadius: '4px',
      borderTop: 'none',
      backgroundColor: theme.palette.background.backdrop,
      transition: 'height 0.5s',
      overflow: 'scroll',
      ...noScrollBar,
    }),
    zones: theme => ({
      height: noListSelected
        ? `${heights.list}%`
        : list === 'zones'
        ? '100%'
        : 0,
      padding: noListSelected || list === 'zones' ? '1rem' : '0 1rem',
      border: noListSelected || list === 'zones' ? '1px solid' : 'none',
      borderColor:
        mode === 'light' ? 'rgba(0, 0, 0, 0.2)' : 'rgba(256, 256, 256, 0.2)',
      borderRadius: '4px',
      borderTop: 'none',
      backgroundColor: theme.palette.background.backdrop,
      transition: 'height 0.5s',
      overflow: 'scroll',
      ...noScrollBar,
    }),
    results: {
      display: 'grid',
      gridTemplateRows: '60% 40%',
      gap: '0.35rem',
      backgroundColor: 'white',
      overflow: 'hidden',
    },
    gantt: theme => ({
      overflow: 'scroll',
      ...noScrollBar,
      border: '1px solid rgba(0, 0, 0, 0.5)',
      // paddingRight: '2px',
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
