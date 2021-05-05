/** @jsxImportSource @emotion/react */
import { useState, memo } from 'react'
import { useSelector } from 'react-redux'
// import useTranslation from '../i18n/useTranslation'
import { useLocale } from '../utility/appUtilities'

import Select from '../lists/Select'
import Requests from '../lists/requests/Requests'
import Resources from '../lists/resources/Resources'
import Directives from '../lists/directives/Directives'
import Map from '../map/Map'
import Gantt from '../gantt/Gantt'

import noScrollBar from '../styling/noScrollbar'
import Paper from '@material-ui/core/Paper'

const Schedule = () => {
  console.log('Schedule is rendered')
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
      gridTemplateColumns: '35fr 65fr',
      backgroundColor: theme.palette.background.backdrop,
    }),
    lists: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-around',
      padding: '0 0.5rem',
      zIndex: 401,
    },
    section: {
      padding: '1rem',
      backgroundColor: mode === 'light' ? 'white' : 'rgba(256, 256, 256, 0.05)',
      border: '1px solid',
      borderColor:
        mode === 'light' ? 'rgba(0, 0, 0, 0.2)' : 'rgba(256, 256, 256, 0.15)',
    },

    run: {
      padding: '0 1rem',
      height: `${heights.run}%`,
      overflow: 'hidden',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      borderRadius: '3px',
    },
    requests: {
      height: noListSelected
        ? `${heights.list}%`
        : list === 'requests'
        ? '100%'
        : 0,
      padding: noListSelected || list === 'requests' ? '1rem' : '0 1rem',
      border: noListSelected || list === 'requests' ? '1px solid' : 'none',
      borderColor:
        mode === 'light' ? 'rgba(0, 0, 0, 0.2)' : 'rgba(256, 256, 256, 0.15)',
      transition: 'height 0.5s',
      overflow: 'scroll',
      ...noScrollBar,
    },
    resources: {
      height: noListSelected
        ? `${heights.list}%`
        : list === 'resources'
        ? '100%'
        : 0,
      padding: noListSelected || list === 'resources' ? '1rem' : '0 1rem',
      border: noListSelected || list === 'resources' ? '1px solid' : 'none',
      borderColor:
        mode === 'light' ? 'rgba(0, 0, 0, 0.2)' : 'rgba(256, 256, 256, 0.15)',
      transition: 'height 0.5s',
      overflow: 'scroll',
      ...noScrollBar,
    },
    directives: {
      height: noListSelected
        ? `${heights.list}%`
        : list === 'directives'
        ? '100%'
        : 0,
      padding: noListSelected || list === 'directives' ? '1rem' : '0 1rem',
      border: noListSelected || list === 'directives' ? '1px solid' : 'none',
      borderColor:
        mode === 'light' ? 'rgba(0, 0, 0, 0.2)' : 'rgba(256, 256, 256, 0.15)',
      transition: 'height 0.5s',
      overflow: 'scroll',
      ...noScrollBar,
    },
    results: {
      display: 'grid',
      gridTemplateRows: '65% 35%',
      gap: '0.5rem',
      backgroundColor: 'white',
    },
    gantt: theme => ({
      overflow: 'scroll',
      ...noScrollBar,
      border: '1px solid rgba(0, 0, 0, 0.3)',
    }),
    map: {},
    sectionTitle: {
      color: mode === 'dark' ? '#9e9e9e' : 'inherit',
    },
  }
  return (
    <div css={styles.root}>
      <Paper square elevation={5} css={styles.lists}>
        <div css={{ ...styles.section, ...styles.run }}>
          <Select {...{ list, setList }} />
        </div>
        <div css={{ ...styles.section, ...styles.requests }}>
          <Requests />
        </div>
        <div css={{ ...styles.section, ...styles.resources }}>
          <Resources />
        </div>
        <div css={{ ...styles.section, ...styles.directives }}>
          <Directives />
        </div>
      </Paper>
      <div css={styles.results}>
        <div css={styles.map}>
          <Map />
        </div>
        <div css={styles.gantt}>
          <Gantt />
        </div>
      </div>
    </div>
  )
}

export default memo(Schedule)
