/** @jsxImportSource @emotion/react */
import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { criteriaDefaults } from '../redux/config'

import useTranslation from '../i18n/useTranslation'

import SelectedDeliveriesIcon from '@material-ui/icons/PlaylistAddCheck'
import MatchedIcon from '@material-ui/icons/AssignmentTurnedInOutlined'
import UnmatchedIcon from '@material-ui/icons/AssignmentLateOutlined'
import ToggleButtonGroup from '@material-ui/core/ToggleButtonGroup'
import ToggleButton from '@material-ui/core/ToggleButton'
import IconButton from '@material-ui/core/IconButton'
import TableRowsIcon from '@material-ui/icons/TableRows'
// import Filter1Icon from '@material-ui/icons/FilterAltOutlined'
// import MapCriteriaIcon from '@material-ui/icons/PinDropOutlined'

const Criteria = ({ selectCriteria, setCriteria, on, off }) => {
  const { selectedDeliveries, matched, unmatched } = useSelector(selectCriteria)
  const dispatch = useDispatch()

  const criteriaToState = ({ selectedDeliveries, matched, unmatched }) =>
    Object.entries({ selectedDeliveries, matched, unmatched })
      .filter(([, boolean]) => boolean)
      .map(([key]) => key)

  const [criteria, updateCriteria] = useState(
    criteriaToState({ selectedDeliveries, matched, unmatched })
  )

  useEffect(() => {
    updateCriteria(criteriaToState({ selectedDeliveries, matched, unmatched }))
  }, [selectedDeliveries, matched, unmatched])

  const handleChange = (e, newCriteria) => {
    const criteria = []
    for (const criterion in criteriaDefaults) {
      criteria.push({ prop: criterion, value: newCriteria.includes(criterion) })
    }

    updateCriteria(newCriteria)
    dispatch(setCriteria(criteria))
  }
  const t = useTranslation()

  const styles = {
    buttonGroup: {
      border: '1px solid transparent',
      // borderColor: 'rgba(256, 256, 256, 0.5)',
    },
    toggleButton: {
      border: '1px solid transparent',
      borderRadius: '3px',
      '&.MuiToggleButton-root.Mui-selected': {
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
      },
      '&.MuiToggleButtonGroup-groupedHorizontal:not(:first-child):not(:last-child)':
        {
          marginRight: 0,
          border: '0px solid transparent',
          // borderRight: '1px solid rgba(256, 256, 256, 0.5)',
          // borderLeft: '1px solid rgba(256, 256, 256, 0.5)',
          // borderColor: 'rgba(256, 256, 256, 0.5)',
        },
    },
  }

  return (
    <ToggleButtonGroup
      value={criteria}
      onChange={handleChange}
      css={styles.buttonGroup}
    >
      <ToggleButton
        value="matched"
        css={styles.toggleButton}
        title={t('fulfilled')}
      >
        <MatchedIcon css={criteria.includes('matched') ? on : off} />
      </ToggleButton>
      <ToggleButton
        value="unmatched"
        css={styles.toggleButton}
        title={t('unfulfilled')}
      >
        <UnmatchedIcon css={criteria.includes('unmatched') ? on : off} />
      </ToggleButton>
      <ToggleButton
        value="selectedDeliveries"
        css={styles.toggleButton}
        title={t('fulfilledBySelected')}
      >
        <SelectedDeliveriesIcon
          css={criteria.includes('selectedDeliveries') ? on : off}
        />
      </ToggleButton>
    </ToggleButtonGroup>
  )
}

export const Toolbar = ({
  conf,
  setCriteria,
  selectCriteria,
  multi,
  setMulti,
  // toggleShowOnMap,
}) => {
  const t = useTranslation()
  // const dispatch = useDispatch()
  const { name, icon, criteriaControls, color } = conf

  const toggleMulti = () => setMulti(value => !value)

  const colors = {
    active: color,
    inactive: '#bdbdbd',
  }

  const toolbarStyles = {
    toolbar: theme => ({
      position: 'absolute',
      top: '-1rem',
      margin: '0 -1rem',
      width: 'calc(100% + 2rem)',
      minHeight: '2rem',
      backgroundColor: 'rgba(0, 0, 0, 0.6)',
      color: '#fff',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      flexWrap: 'wrap',
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
    multi: {
      '& svg': {
        fontSize: '1rem',
        color: multi ? colors.active : colors.inactive,
      },
    },
    filters: {
      flex: 1,
      display: 'flex',
      justifyContent: 'flex-end',
      alignItems: 'center',
      flexWrap: 'wrap',
      '& button': {
        width: '2rem',
      },
    },
    criteria: {
      display: 'flex',
      margin: '0 1rem',
      marginLeft: '25%',
    },
    display: {
      display: 'flex',
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

  const { on, off } = toolbarStyles

  // const { map } = useSelector(selectCriteria)

  // const modifyShowOnMap = () => dispatch(toggleShowOnMap())

  return (
    <div css={toolbarStyles.toolbar}>
      <div css={toolbarStyles.entity} style={{ color }}>
        {icon}
        {t(name)}
      </div>
      <div css={toolbarStyles.filters}>
        {criteriaControls && (
          <div css={toolbarStyles.criteria}>
            <Criteria {...{ selectCriteria, setCriteria, on, off }} />
          </div>
        )}

        <div css={toolbarStyles.display}>
          <IconButton
            css={toolbarStyles.multi}
            onClick={toggleMulti}
            title={t('multiSelect')}
          >
            <TableRowsIcon />
          </IconButton>
          {/* <IconButton title={t('showOnMap')} onClick={modifyShowOnMap}>
            <MapCriteriaIcon
              css={{
                ...toolbarStyles.mapCriteriaIcon,
                ...(map.value ? toolbarStyles.on : toolbarStyles.off),
              }}
            />
          </IconButton> */}
        </div>
      </div>
    </div>
  )
}
