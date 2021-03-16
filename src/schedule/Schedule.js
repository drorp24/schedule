/** @jsxImportSource @emotion/react */
import useTranslation from '../i18n/useTranslation'

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
    gap: '1rem',
    color: theme.palette.text.primary,
    background: theme.palette.background.default,
  }),
  section: {
    border: '1px solid rgba(0, 0, 0, 0.2)',
    padding: '1rem',
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
  },
}

const Schedule = () => (
  <div css={styles.root}>
    <div css={{ ...styles.run, ...styles.section }}>run</div>
    <div css={{ ...styles.requests, ...styles.section }}>requests </div>
    <div css={{ ...styles.resources, ...styles.section }}>resources </div>
    <div css={{ ...styles.directives, ...styles.section }}>directives</div>
    <div css={{ ...styles.gantt, ...styles.section }}>gantt</div>
  </div>
)

export default Schedule
