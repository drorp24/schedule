/** @jsxImportSource @emotion/react */
import { useState, memo } from 'react'
import { useSelector } from 'react-redux'
// import useTranslation from '../i18n/useTranslation'

import Run from '../lists/Run'
import Requests from '../lists/requests/Requests'
import Resources from '../lists/resources/Resources'
import Directives from '../lists/directives/Directives'

import noScrollBar from '../styling/noScrollbar'

import Gantt from '../gantt/Gantt'

const Schedule = () => {
  const [list, setList] = useState(null)
  const noListSelected = list === null

  const mode = useSelector(store => store.app.mode)
  // const t = useTranslation()

  const styles = {
    root: theme => ({
      display: 'grid',
      gridTemplateColumns: '35fr 65fr',
      gap: '0.7rem',
      backgroundColor: theme.palette.background.paper,
    }),
    lists: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
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
      height: '10%',
      overflow: 'hidden',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    requests: {
      height: noListSelected ? '28%' : list === 'requests' ? '100%' : 0,
      padding: noListSelected || list === 'requests' ? '1rem' : '0 1rem',
      border: noListSelected || list === 'requests' ? '1px solid' : 'none',
      borderColor:
        mode === 'light' ? 'rgba(0, 0, 0, 0.2)' : 'rgba(256, 256, 256, 0.15)',
      transition: 'height 0.5s',
      overflow: 'scroll',
      ...noScrollBar,
    },
    resources: {
      height: noListSelected ? '28%' : list === 'resources' ? '100%' : 0,
      padding: noListSelected || list === 'resources' ? '1rem' : '0 1rem',
      border: noListSelected || list === 'resources' ? '1px solid' : 'none',
      borderColor:
        mode === 'light' ? 'rgba(0, 0, 0, 0.2)' : 'rgba(256, 256, 256, 0.15)',
      transition: 'height 0.5s',
      overflow: 'scroll',
      ...noScrollBar,
    },
    directives: {
      height: noListSelected ? '28%' : list === 'directives' ? '100%' : 0,
      padding: noListSelected || list === 'directives' ? '1rem' : '0 1rem',
      border: noListSelected || list === 'directives' ? '1px solid' : 'none',
      borderColor:
        mode === 'light' ? 'rgba(0, 0, 0, 0.2)' : 'rgba(256, 256, 256, 0.15)',
      transition: 'height 0.5s',
      overflow: 'scroll',
      ...noScrollBar,
    },
    gantt: {
      overflow: /* 'scroll' */ 'hidden',
      backgroundColor:
        mode === 'light' ? 'rgba(0, 0, 0, 0.05)' : 'rgba(0, 0, 0, 0.05)',
      padding: '0',
    },
    sectionTitle: {
      color: mode === 'dark' ? '#9e9e9e' : 'inherit',
    },
  }
  return (
    <div css={styles.root}>
      <div css={styles.lists}>
        <div css={{ ...styles.section, ...styles.run }}>
          <Run {...{ list, setList }} />
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
      </div>
      <div css={{ ...styles.section, ...styles.gantt }}>
        <Gantt />
      </div>
    </div>
  )
}

export default memo(Schedule)