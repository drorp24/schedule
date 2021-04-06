/** @jsxImportSource @emotion/react */
import { useEffect, memo, useMemo } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { fetchRuns, selectEntities, select } from '../../redux/runs'
import runsFields from './runsFields'

import { useLocale, localeDateTime } from '../../utility/appUtilities'

import MenuItem from '@material-ui/core/MenuItem'
import FormControl from '@material-ui/core/FormControl'
import Select from '@material-ui/core/Select'

const styles = {
  sectionTitle: {
    fontSize: '0.75rem',
  },
  select: {
    '& .MuiInputBase-input': {
      fontSize: '0.65rem',
    },
    '&:hover': {
      border: 'none',
    },
    '&.MuiInput-underline': {
      '&::before': {
        border: 'none',
      },
    },
    '&.MuiInput-underline:hover:not(.Mui-disabled):before': {
      border: 'none',
      // toolbar,
    },
  },
  menuItem: {
    fontSize: '0.75rem !important',
  },
}

const RunSelection = () => {
  // ToDo: find out why RunSelection and all 4 lists are re-rendered 8 times
  // Schedule, their common parent, is rendered but once.
  console.log('RunSelection is rendered')

  const { loaded, selectedId, sortedEntities } = useSelector(selectEntities)
  const { locale } = useLocale()
  const dispatch = useDispatch()

  const d = localeDateTime(locale)
  const selectRun = ({ target: { value } }) => {
    if (value !== selectedId) dispatch(select(value))
  }

  const runs = useMemo(
    () =>
      locale &&
      loaded &&
      sortedEntities.length &&
      sortedEntities.map(({ id, publish_time }) => ({
        id,
        date: d(publish_time),
      })),
    [d, loaded, locale, sortedEntities]
  )

  useEffect(() => {
    dispatch(fetchRuns({ runsFields }))
  }, [dispatch])

  if (!runs || !runs.length) {
    console.log('no runs, returning null')
    console.log('runs: ', runs)
    return null
  }

  return (
    <FormControl fullWidth>
      <Select value={selectedId} onChange={selectRun} css={styles.select}>
        {runs.map(({ id, date }) => (
          <MenuItem value={id} css={styles.menuItem} key={id}>
            {date}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  )
}

export default memo(RunSelection)
