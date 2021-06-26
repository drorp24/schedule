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
import FilterIcon from '@material-ui/icons/FilterListRounded'
import MenuItem from '@material-ui/core/MenuItem'
import FormControl from '@material-ui/core/FormControl'
import Select from '@material-ui/core/Select'
import TableRowsIcon from '@material-ui/icons/TableRows'
import CriteriaIcon from '@material-ui/icons/ManageSearchRounded'
import Filter1Icon from '@material-ui/icons/FilterAltOutlined'
import MapCriteriaIcon from '@material-ui/icons/ShareLocationOutlined'

const getFields = ({ entity, properties }) =>
  properties.map(({ name, fn, rowStyle, icon }) => ({
    name,
    value: fn ? fn(get(entity, name)) : get(entity, name),
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
  toolbar: theme => ({
    position: 'absolute',
    top: '-1rem',
    borderTopLeftRadius: '4px',
    borderTopRightRadius: '4px',
    margin: '0 -1rem',
    width: 'calc(100% + 2rem)',
    height: '2rem',
    backgroundColor: theme.palette.background.prominent,
    color: '#fff',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontSize: '0.75rem',
    textTransform: 'uppercase',
    '& .MuiIconButton-root': {
      color: 'inherit',
    },
    '& .MuiInputBase-root': {
      color: 'inherit',
    },
    '& .MuiSelect-icon': {
      color: 'inherit',
    },
  }),
  entity: {
    margin: '0 12px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    lineHeight: '1.5rem',
    '& svg': {
      margin: '0 0.5rem',
    },
  },
  filter: {
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
    width: '100%',
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
  filterIcon: {
    paddingTop: '0 !important',
    '& svg': {
      fontSize: '1.2rem',
    },
  },
  tooltip: {
    padding: '0.5rem',
  },
}

const Toolbar = ({
  conf,
  filterResults,
  setFilterResults,
  filter,
  multi,
  setMulti,
  restrict,
  setRestrict,
}) => {
  const t = useTranslation()
  const { name, icon, filters, color } = conf

  const filterToggle = () => setFilterResults(value => !value)
  const toggleMulti = () => setMulti(value => !value)

  const colors = {
    active: color,
    inactive: '#bdbdbd',
  }

  const toolbarStyles = {
    multi: {
      marginRight: 'auto',
      padding: '1rem',
      '& svg': {
        fontSize: '1rem',
        color: multi ? colors.active : colors.inactive,
      },
    },
    filters: {
      flex: 1,
      display: 'flex',
      justifyContent: 'flex-end',
      '& button': {
        width: '2rem',
      },
    },
    mapCriteriaIcon: {
      fontSize: '1.2rem',
    },
    filterIcon: {
      fontSize: '1.2rem',
    },
    criteriaIcon: {
      fontSize: '1.5rem',
    },
    on: {
      color: colors.active,
    },
    off: {
      color: colors.inactive,
    },
  }

  const toggleRestrict = () => setRestrict(value => !value)

  return (
    <div css={styles.toolbar}>
      <div css={styles.entity} style={{ color }}>
        {icon}
        {t(name)}
      </div>
      <div css={toolbarStyles.filters}>
        <IconButton>
          <MapCriteriaIcon css={toolbarStyles.mapCriteriaIcon} />
        </IconButton>
        <IconButton onClick={toggleRestrict}>
          <Filter1Icon
            css={{
              ...toolbarStyles.filterIcon,
              ...(restrict ? toolbarStyles.on : toolbarStyles.off),
            }}
          />
        </IconButton>
        <IconButton>
          <CriteriaIcon css={toolbarStyles.criteriaIcon} />
        </IconButton>
      </div>
      <IconButton css={toolbarStyles.multi} onClick={toggleMulti}>
        <TableRowsIcon />
      </IconButton>
      {filters && filterResults && filter ? <Filter {...{ filters }} /> : ''}
      <IconButton
        css={styles.filterIcon}
        style={{
          color: filterResults && filter ? color : '#bdbdbd',
        }}
        onClick={filterToggle}
      >
        <FilterIcon />
      </IconButton>
    </div>
  )
}

const Filter = ({ filters }) => {
  const t = useTranslation()
  if (filters)
    return (
      <FormControl fullWidth css={styles.formControl}>
        <Select value={t(filters[0])} onChange={() => {}} css={styles.select}>
          {filters.map(filter => (
            <MenuItem value={t(filter)} css={styles.menuItem} key={filter}>
              {t(filter)}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    )
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
// ~ selectSelectedEntities
//   a separate entity's selected entities which refer to some of this entity's rows and needs to be shown;
//   currently it's 'deliveries' and the rows are requests satisfied / depots used by selected deliveries
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
// ~ filter
//  an optional object whose key is an entity's id value and value doesn't matter.
//  (It is assumed that every entity instance has its own unique id value).
// ~ conf
//   a configuration object with any property that is specific for the given entity.
//   Currently the properties are relvant for the toolbar, and include
//   name, color and icon, with an optional 'filters' prop that has a list of filter names.
//
const Table = ({
  selectOne,
  selectMulti,
  selectEntities,
  selectSelectedEntities,
  selectEntityById,
  properties,
  filter = null,
  conf,
}) => {
  let { isLoading, ids, selectedIds } = useSelector(selectEntities)
  const { selectedDeliveriesByPlanId, selectedDeliveriesByDepotId } =
    useSelector(selectSelectedEntities) || {}
  console.log('selectedDeliveriesByPlanId: ', selectedDeliveriesByPlanId)
  console.log('selectedDeliveriesByDepotId: ', selectedDeliveriesByDepotId)

  const [filterResults, setFilterResults] = useState(true)
  if (filterResults && filter) {
    ids = ids.filter(id => filter[id])
  }

  const [multi, setMulti] = useState(false)
  const [restrict, setRestrict] = useState(false)

  const itemCount = ids.length
  const itemSize = usePixels(3)
  const { direction } = useLocale()
  const outerRef = useRef()

  // useEffect(() => {
  //   const scrollTo = entityId => {
  //     if (!outerRef || !outerRef.current) return

  //     const index = ids.findIndex(id => id === entityId)
  //     const top = index * itemSize
  //     outerRef.current.scrollTo({ top, behavior: 'smooth' })
  //   }
  //   if (selectedId) scrollTo(selectedId)
  // }, [ids, itemSize, selectedId])

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
                  filterResults,
                  setFilterResults,
                  filter,
                  multi,
                  setMulti,
                  restrict,
                  setRestrict,
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
                  selectedDeliveriesByPlanId,
                  selectEntityById,
                  properties,
                  filter,
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
  filter,
  conf,
  multi,
}) =>
  memo(({ index, style, data }) => {
    const entity = useSelector(selectEntityById(data[index]))
    const { id, package_delivery_plan_ids } = entity
    const color = (filter && filter[id]) || 'inherit'
    const fields = getFields({ entity, properties })
    const dispatch = useDispatch()

    const select = multi ? selectMulti : selectOne
    const addSelection = id => () => dispatch(select(id))

    const { mode } = useMode()
    const { placement } = useLocale()

    // const bg =
    //   index % 2 ? styles.odd : light ? styles.lightEven : styles.darkEven
    const line = { lineHeight: `${style.height}px` }

    const selectedRow = selectedIds.includes(id) ? styles.selected : {}
    const selectedInfo = selectedIds.includes(id) ? styles.selectedInfo : {}
    const selectedDelivery =
      selectedDeliveriesByPlanId?.length &&
      selectedDeliveriesByPlanId[package_delivery_plan_ids[0]]

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
          <Cell {...{ value, icon, cellStyle: rowStyle, key: name, color }} />
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
