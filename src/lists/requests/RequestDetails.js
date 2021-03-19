/** @jsxImportSource @emotion/react */
import { useSelector, useDispatch } from 'react-redux'
import { select } from '../../redux/requests'

import useTheme from '../../styling/useTheme'
import { useDirection, useMode, useLocalDate } from '../../utility/appUtilities'

import { ThemeProvider, makeStyles } from '@material-ui/core/styles'
import Chip from '@material-ui/core/Chip'
import Card from '@material-ui/core/Card'
import CardHeader from '@material-ui/core/CardHeader'
import CardContent from '@material-ui/core/CardContent'
import CardActions from '@material-ui/core/CardActions'
import IconButton from '@material-ui/core/IconButton'
import Divider from '@material-ui/core/Divider'
import Avatar from '@material-ui/core/Avatar'
// import RequestsIcon from '@material-ui/icons/ListAltOutlined'
import PinDropOutlinedIcon from '@material-ui/icons/PinDropOutlined'

const RequestDetails = ({
  entity: {
    id,
    supplier_category,
    update_time,
    start_time,
    end_time,
    score,
    location,
    options,
  },
}) => {
  const direction = useDirection()
  const { mode, otherMode } = useMode()
  const theme = useTheme({ mode: otherMode, direction })
  const dispatch = useDispatch(0)

  const handleDelete = () => {}

  const color = 'orange'
  // const icon = <RequestsIcon />

  const useStyles = makeStyles(theme => ({
    icon: {
      color: 'rgba(0, 0, 0, 0.4)',
    },
    label: {
      color: 'rgba(0, 0, 0, 0.6)',
    },
    deleteIcon: {
      color: 'rgba(0, 0, 0, 0.4)',
    },
    title: {
      color: `${color} !important`,
      fontWeight: '500',
      textTransform: 'uppercase',
      fontStretch: 'extra-expanded',
    },
    content: {
      display: 'flex',
      flexDirection: 'column-reverse',
    },
    subheader: {
      color: '#bdbdbd',
      fontSize: '0.85rem',
    },
  }))

  const classes = useStyles()

  const styles = {
    root: {
      backgroundColor: 'transparent !important',
      minWidth: '15rem',
    },
    entityType: {
      backgroundColor: `${color} !important`,
    },
    avatar: {
      backgroundColor: `${color} !important`,
      color: '#fff',
      fontWeight: '300',
    },
    details: {
      fontWeight: '100',
      fontSize: '0.8rem',
      textAlign: 'center',
    },
    divider: {
      backgroundColor: `${color} !important`,
      '&::before': {
        borderColor: 'pink',
      },
    },
    subTypes: {
      padding: '1rem',
      '& > div': {
        margin: '0 0.5rem',
      },
    },
    explainer: {
      height: '8rem',
      backgroundColor: 'rgba(256, 256, 256, 0.1)',
      marginTop: '1rem',
    },
    modeColor: {
      color: '#bdbdbd',
    },
    dividerSplitLine: {
      color: '#bdbdbd',
      '&::before, &::after': {
        borderColor: '#bdbdbd !important',
      },
    },
  }

  const markSelected = id => () => {
    dispatch(select(id))
  }

  const { title, content, subheader } = classes

  return (
    <ThemeProvider theme={theme}>
      <Card elevation={0} css={styles.root}>
        <CardHeader
          avatar={<Avatar css={styles.avatar}>{score}</Avatar>}
          title={id}
          subheader={useLocalDate(update_time)}
          classes={{ title, content, subheader }}
        />
        <Divider css={styles.divider} />
        <div css={styles.subTypes}>
          {options &&
            options.map(
              option =>
                option && (
                  <Chip
                    size="small"
                    label={option.id}
                    css={styles.entityType}
                    onDelete={handleDelete}
                    key={option.id}
                    classes={{
                      icon: classes.icon,
                      label: classes.label,
                      deleteIcon: classes.deleteIcon,
                    }}
                  />
                )
            )}
        </div>
        <CardContent>
          <Divider css={{ ...styles.modeColor, ...styles.dividerSplitLine }}>
            Deliver to
          </Divider>
          <div css={styles.explainer}></div>
        </CardContent>
        <CardActions disableSpacing>
          <IconButton onClick={markSelected(id)}>
            <PinDropOutlinedIcon css={styles.modeColor} />
          </IconButton>
          {/* <IconButton onClick={markSelected(id)} css={styles.modeColor}>
            <RoomIcon />
          </IconButton>
          <IconButton css={styles.modeColor}>
            <TableIcon />
          </IconButton> */}
        </CardActions>
      </Card>
    </ThemeProvider>
  )
}

export default RequestDetails