/** @jsxImportSource @emotion/react */
import { useSelector } from 'react-redux'
import useTranslation from '../i18n/useTranslation'

import Gantt from '../gantt/Gantt'

const Schedule = () => {
  const { mode } = useSelector(store => store.app)
  const styles = {
    root: theme => ({
      display: 'grid',
      gridTemplateColumns: '35fr 65fr',
      gridTemplateRows: '10fr 30fr 30fr 30fr',
      gridTemplateAreas: `
      "run gantt"
      "requests gantt"
      "resources gantt"
      "directives gantt"
    `,
      gap: '0.6rem',
      color: theme.palette.text.primary,
      backgroundColor: 'rgba(0, 0, 0, 0.05)',
    }),
    section: {
      // border: '1px solid rgba(0, 0, 0, 0.2)',
      padding: '0 1rem',
      // borderBottom: '1px solid',
      backgroundColor: mode === 'light' ? 'white' : 'rgba(256, 256, 256, 0.05)',
    },
    sectionTitle: {
      color: mode === 'dark' ? '#757575' : 'inherit',
    },
    run: {
      gridArea: 'run',
    },
    requests: {
      gridArea: 'requests',
    },
    resources: {
      gridArea: 'resources',
    },
    directives: {
      gridArea: 'directives',
    },
    gantt: {
      gridArea: 'gantt',
      backgroundColor:
        mode === 'light' ? 'rgba(0, 0, 0, 0.05)' : 'rgba(0, 0, 0, 0.05)',
    },
  }
  return (
    <div css={styles.root}>
      <div css={{ ...styles.run, ...styles.section }}>
        <div css={styles.sectionTitle}>run</div>
      </div>
      <div css={{ ...styles.requests, ...styles.section }}>
        <div css={styles.sectionTitle}>requests</div>{' '}
      </div>
      <div css={{ ...styles.resources, ...styles.section }}>
        <div css={styles.sectionTitle}>resources</div>
      </div>
      <div css={{ ...styles.directives, ...styles.section }}>
        <div css={styles.sectionTitle}>directives</div>
      </div>
      <div css={{ ...styles.gantt, ...styles.section }}>
        <Gantt />
      </div>
    </div>
  )
}

export default Schedule
