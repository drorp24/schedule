/** @jsxImportSource @emotion/react */
import { memo, useState, useRef, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { selectEntities, selectEntityById } from '../../redux/requests'
import { selectSelectedEntity } from '../../redux/recommendations'

import { useDirection } from '../../utility/appUtilities'
import { useLocale } from '../../utility/appUtilities'

import { FixedSizeList as List } from 'react-window'
import AutoSizer from 'react-virtualized-auto-sizer'

import Tooltip from '@material-ui/core/Tooltip'
import Zoom from '@material-ui/core/Zoom'
import Info from '@material-ui/icons/InfoOutlined'
import IconButton from '@material-ui/core/IconButton'
import PinDropOutlinedIcon from '@material-ui/icons/PinDropOutlined'
import Progress from '../../layout/Progress'
import FilterIcon from '@material-ui/icons/FilterListOutlined'

import useTranslation from '../../i18n/useTranslation'

import RequestDetails from './RequestDetails'

import usePixels from '../../utility/usePixels'
import { useMode } from '../../utility/appUtilities'
import noScrollbar from '../../styling/noScrollbar'

const styles = {
  autoSizer: {
    width: '100%',
  },
  header: {
    fontWeight: '700',
    padding: '0 1rem',
    color: '#9e9e9e',
  },
  row: {
    display: 'flex',
    justifyContent: 'space-between',
    boxSizing: 'border-box',
    cursor: 'pointer',
  },
  lightEven: {
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
  },
  darkEven: {
    backgroundColor: 'rgba(256, 256, 256, 0.05)',
  },
  odd: {},
  rowHover: {
    border: '3px solid rgba(0, 0, 0, 0.2)',
  },
  cell: {
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    // border: '1px solid',
  },
  icon: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    height: '3rem',
    width: '3rem',
    alignSelf: 'center',
  },

  selectedInfo: {
    color: '#fff',
  },
  typeIcon: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-start',
    padding: '0 1rem',
  },
  tagHeader: {
    textAlign: 'center',
  },
  buttonGroup: {
    height: '2rem',
    justifySelf: 'end',
    alignSelf: 'center',
    padding: '0 1rem',
    // border: '1px solid',
  },
  selected: {
    backgroundColor: 'rgba(0, 0, 0, 0.6) !important',
    color: '#fff !important',
  },
  on: {
    backgroundColor: 'rgba(0, 0, 0, 0.6) !important',
    color: '#fff !important',
  },
  off: {
    color: 'rgba(0, 0, 0, 0.1) !important',
  },
  tagIcon: {
    fontSize: '1rem !important',
  },
  selectedTagIcon: {
    color: 'rgba(256, 256, 256, 0.2)',
  },
  selectedTagIconOn: {
    color: 'white !important',
  },
  dimText: {
    color: '#9e9e9e',
  },
  centered: {
    textAlign: 'center',
  },
  filterLine: {
    position: 'absolute',
    top: '-1.5rem',
    width: '100%',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    color: 'orange',
    fontSize: '0.75rem',
    textTransform: 'uppercase',
  },
}

const Table = () => {
  let { ids, selectedId, loading } = useSelector(selectEntities)

  const itemSize = usePixels(3)
  const direction = useDirection()
  const outerRef = useRef()
  const t = useTranslation()

  // recommendation selected event
  const selectedRecommendation = useSelector(selectSelectedEntity)

  const [filterResults, setFilterResults] = useState(true)
  const [filter, setFilter] = useState(null)

  if (filterResults && filter) {
    ids = ids.filter(id => filter[id])
  }
  const itemCount = ids.length

  const filterToggle = () => setFilterResults(value => !value)

  useEffect(() => {
    if (!selectedRecommendation || !selectedRecommendation.fulfills?.length)
      return

    const fulfilled = {}

    selectedRecommendation.fulfills.forEach(
      ({ delivery_request_id, option_id }) => {
        fulfilled[delivery_request_id] = option_id
      }
    )

    setFilter(fulfilled)
    console.log('fulfilled: ', fulfilled)
  }, [selectedRecommendation])

  // request selected event
  useEffect(() => {
    const scrollTo = entityId => {
      if (!outerRef || !outerRef.current) return

      const index = ids.findIndex(id => id === entityId)
      const top = index * itemSize
      outerRef.current.scrollTo({ top, behavior: 'smooth' })
    }
    if (selectedId) scrollTo(selectedId)
  }, [ids, itemSize, selectedId])

  if (loading === 'pending') return <Progress />

  return (
    <AutoSizer style={styles.autoSizer}>
      {({ height, width }) => {
        height -= itemSize
        return (
          <>
            <div css={styles.filterLine}>
              <IconButton
                css={styles.filterIcon}
                style={{
                  color: filterResults && filter ? 'orange' : '#bdbdbd',
                }}
                onClick={filterToggle}
              >
                <FilterIcon />
              </IconButton>
              <div>{filterResults && filter ? t('fulfilled') : ''}</div>
            </div>

            <Header
              style={{ ...styles.row, ...styles.header, height: itemSize }}
            />
            <List
              overscanCount="20"
              outerRef={outerRef}
              css={noScrollbar}
              itemData={ids}
              {...{ height, width, itemCount, itemSize, direction }}
            >
              {Row}
            </List>
          </>
        )
      }}
    </AutoSizer>
  )
}

const Row = memo(({ index, style, data }) => {
  // console.log('data: ', data)
  const { light } = useMode()
  const { placement } = useLocale()
  const { selectedId } = useSelector(selectEntities)
  const entity = useSelector(selectEntityById(data[index]))
  // const dispatch = useDispatch()

  const { id, supplier_category, score, location } = entity

  const bg = index % 2 ? styles.odd : light ? styles.lightEven : styles.darkEven
  const line = { lineHeight: `${style.height}px` }

  const selectedRow = id === selectedId ? styles.selected : {}
  const selectedInfo = id === selectedId ? styles.selectedInfo : {}

  return (
    <div
      css={{
        ...style,
        ...styles.row,
        ...bg,
        ...line,
        ...selectedRow,
      }}
      style={style}
    >
      <Cell
        value={'location'}
        icon={<PinDropOutlinedIcon />}
        cellStyle={{ ...styles.typeIcon, color: 'orange' }}
      />
      <Cell value={id} cellStyle={{ ...styles.centered }} />
      <Cell value={supplier_category} />
      <Cell value={score} cellStyle={{ ...styles.centered }} />
      <Tooltip
        // open={id === 'del-79'}
        title={<RequestDetails {...{ entity }} />}
        arrow
        TransitionComponent={Zoom}
        disableFocusListener={true}
        placement={placement}
      >
        <IconButton
          style={{ ...styles.icon, ...selectedInfo, ...styles.dimText }}
        >
          <Info />
        </IconButton>
      </Tooltip>
    </div>
  )
})

const Header = ({ style }) => {
  const t = useTranslation()
  const line = { lineHeight: `${style.height}px` }

  return (
    <div style={{ ...style, ...line }}>
      <Cell value={t('location')} />
      <Cell value={t('id')} cellStyle={{ textAlign: 'center' }} />
      <Cell value={t('supplier')} />
      <Cell value={t('score')} cellStyle={{ textAlign: 'right' }} />
      <Cell value={t('info')} cellStyle={{ textAlign: 'center' }} />
    </div>
  )
}

const Cell = ({ value, icon, cellStyle }) => {
  const alignment = typeof value === 'number' ? { textAlign: 'right' } : {}
  return (
    <div style={{ ...styles.cell, ...cellStyle, ...alignment }} title={value}>
      {icon || value}
    </div>
  )
}

export default memo(Table)
