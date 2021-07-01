/** @jsxImportSource @emotion/react */
import { memo, useState, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'

import get from 'lodash.get'
import { FixedSizeList as List } from 'react-window'
import AutoSizer from 'react-virtualized-auto-sizer'

import { useLocale, useMode } from '../utility/appUtilities'
import useTranslation from '../i18n/useTranslation'
import usePixels from '../utility/usePixels'
import TooltipContent from './TooltipContent'
import noScrollbar from '../styling/noScrollbar'

import Tooltip from '@material-ui/core/Tooltip'
import Zoom from '@material-ui/core/Zoom'
import Info from '@material-ui/icons/InfoOutlined'
import IconButton from '@material-ui/core/IconButton'
import Progress from '../layout/Progress'
import { Toolbar } from './Toolbar'

const getFields = ({ entity, properties }) =>
  properties.map(({ name, fn, rowStyle, icon }) => ({
    name,
    value: fn ? fn(get(entity, name)) : get(entity, name),
    rowStyle,
    icon,
  }))

export const styles = {
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
    borderBottom: 'none',
  },
  row: {
    display: 'flex',
    justifyContent: 'space-between',
    boxSizing: 'border-box',
    cursor: 'pointer',
    borderBottom: '1px solid',
    padding: '0 0.5rem',
    borderColor: 'white',
    even: {
      light: {
        borderColor: 'rgba(0, 0, 0, 0.1)',
      },
      dark: {
        borderColor: 'rgba(256, 256, 256, 0.1)',
      },
    },
    odd: {
      light: {
        borderColor: 'white',
      },
      dark: {
        borderColor: 'rgba(0, 0, 0, 0.25)',
      },
    },
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
    backgroundColor: 'rgba(0, 0, 0, 0.2) !important',
    color: '#fff !important',
    borderRadius: '4px',
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
  formControl: {
    '& div': {
      padding: 0,
      letterSpacing: 'initial',
    },
  },
  select: {
    textTransform: 'capitalize',
    '& .MuiInputBase-input': {
      fontSize: '0.75rem',
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
  name: {
    fontSize: '0.65rem',
  },
  menuItem: {
    fontSize: '0.75rem !important',
    textTransform: 'capitalize',
  },
  tooltip: {
    padding: '0.5rem',
  },
}

// # Table
// ? Dynamic implementation of react-window that will render any entity regardless of properties
// ? as long as it gets the following props:
//
// ~ selectOne
//   dispatched when a row is selected
// ~ selectMulti
//   dispatched when a row is selected if toolbar so indicates
// ~ selectEntities
//   entity's own selectEntities selector that exposes { isLoading, ids, selectedIds }
// ~ selectCriteria, selectCriteriaEntities,setCriteria, toggleFilter, toggleShowOnMap
//   entity's own selectors and setters for the criteria controls activated from the toolbar.
//   selectCriteriaEntities fetches the rows that match any of the selected criteria (there can be multiple)
//   thus enables to indicate such rows on the table.
//   In addition to the (currently 3) criteria, the set includes 'filter' and a 'show on map' controls,
//   which determine
//   -  whether to filter rows to include only those that match any of the criteria, and
//   -  whether to show the locations of the large-volume criteria rows (currently: matched & unmatched) on the map.
//      Manually selected rows of deliveries, requests and depots are always shown on the map.
//      System default for large-volume criteria is to not show their locations on the map,
//      however if user changes that default, his choice is remembered (stored in redux).
//      Redux - persist could then remember that choice onwards.
//   The setter and selectors take care of setting the defaults and remembering user's choice.
// ~ selectEntityById
//   entity's own selectEntityById selector
// ~ properties
//   an array with the properties to be displayed. Each property is an object with:
//      ~ name (mandatory)
//        a path in the entity object, as deep as needed. It can include array positions.
//      ~ fn
//        an optional function to be run on the value
//      ~ rowStyle, headStyle, icon
//        (all optional) how to style that field in the row and in the header
// ~ conf
//   a configuration object with any property that is specific for the given entity.
const Table = ({
  selectOne,
  selectMulti,
  selectEntities,
  selectCriteria,
  selectCriteriaEntities,
  setCriteria,
  toggleFilter,
  toggleShowOnMap,
  selectEntityById,
  properties,
  conf,
}) => {
  let { isLoading, ids, selectedIds } = useSelector(selectEntities)

  const [multi, setMulti] = useState(false)

  const itemCount = ids.length
  const itemSize = usePixels(3)
  const { direction } = useLocale()
  const outerRef = useRef()

  if (isLoading) return <Progress />

  return (
    <div css={styles.root}>
      <AutoSizer style={styles.autoSizer}>
        {({ height, width }) => {
          height -= itemSize
          return (
            <>
              <Toolbar
                {...{
                  conf,
                  selectCriteria,
                  selectCriteriaEntities,
                  setCriteria,
                  toggleFilter,
                  toggleShowOnMap,
                  multi,
                  setMulti,
                  toggleFilter,
                }}
              />
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
                  selectOne,
                  selectMulti,
                  selectedIds,
                  selectEntityById,
                  properties,
                  conf,
                  multi,
                })}
              </List>
            </>
          )
        }}
      </AutoSizer>
    </div>
  )
}

const Row = ({
  selectOne,
  selectMulti,
  selectedIds,
  selectedDeliveriesByPlanId,
  selectEntityById,
  properties,
  conf,
  multi,
}) =>
  memo(({ index, style, data }) => {
    const entity = useSelector(selectEntityById(data[index]))
    const { id, package_delivery_plan_ids } = entity
    const fields = getFields({ entity, properties })
    const dispatch = useDispatch()

    const select = multi ? selectMulti : selectOne
    const addSelection = id => () => dispatch(select(id))

    const { mode } = useMode()
    const { placement } = useLocale()

    const line = { lineHeight: `${style.height}px` }

    const selectedRow = selectedIds.includes(id) ? styles.selected : {}
    const selectedInfo = selectedIds.includes(id) ? styles.selectedInfo : {}

    return (
      <div
        css={{
          ...style,
          ...styles.row,
          ...(index % 2 ? styles.row.odd[mode] : styles.row.even[mode]),
          ...line,
          ...selectedRow,
        }}
        style={style}
        onClick={addSelection(id)}
      >
        {fields.map(({ name, value, icon, rowStyle }) => (
          <Cell {...{ value, icon, cellStyle: rowStyle, key: name }} />
        ))}

        <Tooltip
          // open={id === 'b39e0de1-41ab-4e1f-9e2a-c82aecfa511b'}
          title={<TooltipContent {...{ entity, conf }} />}
          arrow
          TransitionComponent={Zoom}
          disableFocusListener={true}
          placement={placement}
          PopperProps={{ css: styles.tooltip }}
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
        <Cell value={t(name)} cellStyle={headStyle} key={name} />
      ))}
      <Cell value={t('info')} />
    </div>
  )
}

const Cell = ({ value, icon, cellStyle, color }) => {
  const alignment = typeof value === 'number' ? { textAlign: 'right' } : {}
  return (
    <div
      style={{
        ...styles.cell,
        ...cellStyle,
        ...alignment,
        color: icon ? color : 'inherit',
      }}
      title={value}
    >
      {icon || value}
    </div>
  )
}

export default memo(Table)
