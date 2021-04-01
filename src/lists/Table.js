/** @jsxImportSource @emotion/react */
import { memo, useState, useRef, useEffect } from 'react'
import { useSelector } from 'react-redux'

import get from 'lodash.get'
import { FixedSizeList as List } from 'react-window'
import AutoSizer from 'react-virtualized-auto-sizer'

import { useDirection, useLocale, useMode } from '../utility/appUtilities'
import useTranslation from '../i18n/useTranslation'
import usePixels from '../utility/usePixels'
import noScrollbar from '../styling/noScrollbar'

import useTheme from '../styling/useTheme'
import Tooltip from '@material-ui/core/Tooltip'
import Zoom from '@material-ui/core/Zoom'
import Info from '@material-ui/icons/InfoOutlined'
import IconButton from '@material-ui/core/IconButton'
import Progress from '../layout/Progress'
import FilterIcon from '@material-ui/icons/FilterListOutlined'

const map = ({ entity, properties }) =>
  properties.map(({ name, rowStyle, icon }) => ({
    name,
    value: get(entity, name),
    rowStyle,
    icon,
  }))

const styles = {
  root: {
    height: '100%',
    fontSize: '0.85rem',
  },
  autoSizer: {
    width: '100%',
  },
  header: {
    fontWeight: '700',
    padding: '0 12px',
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
  filterLine: {
    position: 'absolute',
    top: '-1.5rem',
    width: '100%',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontSize: '0.75rem',
    textTransform: 'uppercase',
  },
}

// ! Table is a generic implementation of react-window that accepts any entity type
//   provided that entity type passes the following props:
//
// - its own implementation of 'selectEntities' redux selector
//   which exposes an { isLoading, ids, selectedId },
// - its own implementation of 'selectEntityById' redux selector,
// - properties - an array of { name, rowStyle, headStyle, icon } (last 3 optional)
//   where name is a path in the entity object, as deep as needed (can include array positions too),
// - filter - an object whose key is the entity's id value (value doesn't matter)
//   It is assumed that every entity has one,
// - TooltipDetails - a react component that accepts 'entity' as prop
//   and renders the specific content to be displayed by the tooltip that shows upon hovering Info.
// - conf - a configuration object with properties specific to that entity, such as styling.
//
const Table = ({
  selectEntities,
  selectEntityById,
  properties,
  filter,
  TooltipDetails,
  conf,
}) => {
  let { isLoading, ids, selectedId } = useSelector(selectEntities)

  const [filterResults, setFilterResults] = useState(true)
  const filterToggle = () => setFilterResults(value => !value)
  if (filterResults && filter) {
    ids = ids.filter(id => filter[id])
  }

  const itemCount = ids.length
  const itemSize = usePixels(3)
  const direction = useDirection()
  const outerRef = useRef()
  const t = useTranslation()
  const theme = useTheme()

  useEffect(() => {
    const scrollTo = entityId => {
      if (!outerRef || !outerRef.current) return

      const index = ids.findIndex(id => id === entityId)
      const top = index * itemSize
      outerRef.current.scrollTo({ top, behavior: 'smooth' })
    }
    if (selectedId) scrollTo(selectedId)
  }, [ids, itemSize, selectedId])

  if (isLoading) return <Progress />

  return (
    <div css={styles.root}>
      <AutoSizer style={styles.autoSizer}>
        {({ height, width }) => {
          height -= itemSize
          return (
            <>
              <div css={styles.filterLine}>
                <IconButton
                  css={styles.filterIcon}
                  style={{
                    color:
                      filterResults && filter
                        ? conf.color
                        : theme.palette.menu.inactive,
                  }}
                  onClick={filterToggle}
                >
                  <FilterIcon />
                </IconButton>
                <div style={{ color: conf.color }}>
                  {filterResults && filter ? t('fulfilled') : ''}
                </div>
              </div>
              <Header
                properties={properties}
                style={{ ...styles.row, ...styles.header, height: itemSize }}
              />
              <List
                overscanCount="20"
                outerRef={outerRef}
                css={noScrollbar}
                itemData={ids}
                {...{ height, width, itemCount, itemSize, direction }}
              >
                {Row({
                  selectedId,
                  selectEntityById,
                  properties,
                  TooltipDetails,
                })}
              </List>
            </>
          )
        }}
      </AutoSizer>
    </div>
  )
}

const Row = ({ selectedId, selectEntityById, properties, TooltipDetails }) =>
  memo(({ index, style, data }) => {
    const entity = useSelector(selectEntityById(data[index]))
    const { id } = entity
    const fields = map({ entity, properties })

    const { light } = useMode()
    const { placement } = useLocale()

    const bg =
      index % 2 ? styles.odd : light ? styles.lightEven : styles.darkEven
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
        {fields.map(({ value, icon, rowStyle }) => (
          <Cell {...{ value, icon, cellStyle: rowStyle }} />
        ))}

        <Tooltip
          // open={id === 'del-79'}
          title={<TooltipDetails {...{ entity }} />}
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

const Header = ({ properties, style }) => {
  const t = useTranslation()
  const line = { lineHeight: `${style.height}px` }

  return (
    <div style={{ ...style, ...line }}>
      {properties.map(({ name, headStyle }) => (
        <Cell value={t(name)} cellStyle={headStyle} />
      ))}
      <Cell value={t('info')} />
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
