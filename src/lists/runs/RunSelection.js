/** @jsxImportSource @emotion/react */
import { useState, useEffect, memo } from 'react'
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
  console.log('RunSelection is rendered')
  const { loaded, selectedId, sortedEntities } = useSelector(selectEntities)
  const { locale } = useLocale()
  const d = localeDateTime(locale)
  const dispatch = useDispatch()

  const runs =
    locale &&
    loaded &&
    sortedEntities.length &&
    sortedEntities.map(({ id, publish_time }) => ({
      id,
      date: d(publish_time),
    }))

  const selectRun = ({ target: { value } }) => {
    if (value !== selectedId) dispatch(select(value))
  }

  useEffect(() => {
    dispatch(fetchRuns({ runsFields }))
  }, [dispatch])

  if (!runs || !runs.length) return null

  if (!selectedId) {
    const defaultRun = runs[0].id
    dispatch(select(defaultRun))
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
