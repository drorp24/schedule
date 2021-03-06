/** @jsxImportSource @emotion/react */
import { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { toggleDrawer, toggleLocale, toggleMode } from '../redux/app'
// import { logout } from '../redux/users'
import { deselect as deselectRequests, resetCriteria } from '../redux/requests'
import { deselect as deselectDepots } from '../redux/depots'
import { deselect as deselectZones } from '../redux/zones'
import { updateSelection as updateDeliveriesSelection } from '../redux/deliveries'
import { useLocale } from '../utility/appUtilities'

import {
  Switch,
  Route,
  Link,
  useRouteMatch,
  useLocation,
} from 'react-router-dom'

// import Folder from '@material-ui/icons/FolderOpenOutlined'
import ScheduleIcon from '@material-ui/icons/Schedule'
// import RoutesIcon from '@material-ui/icons/AltRouteOutlined'
import SwitchRightOutlinedIcon from '@material-ui/icons/SwitchRightOutlined'
import DarkModeOutlinedIcon from '@material-ui/icons/DarkModeOutlined'
import LightModeOutlinedIcon from '@material-ui/icons/LightModeOutlined'
// import DashboardOutlinedIcon from '@material-ui/icons/DashboardOutlined'
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft'
// import Logout from '@material-ui/icons/PowerSettingsNewOutlined'
import Button from '@material-ui/core/Button'
import Logo from '../assets/Rafael-2.svg'

import useTranslation from '../i18n/useTranslation'

import Page from '../layout/Page'
// import File from './File'
import Schedule from './Schedule'
// import Dashboard from './Dashboard'
// import Routes from './Routes'

const Home = () => {
  const { url } = useRouteMatch()
  const { pathname } = useLocation()
  const dispatch = useDispatch()
  const open = useSelector(store => store.app.drawerOpen)
  const { direction, placement } = useLocale()
  const mode = useSelector(store => store.app.mode)
  const [dir, setDir] = useState(direction)
  const rtl = dir === 'rtl'
  const ltr = dir === 'ltr'
  const t = useTranslation()

  const drawerWidth = {}
  const routeWidth = {}
  drawerWidth.open = '12%'
  routeWidth.open = '88%'
  const menuItem = {
    padding: 1,
    icon: 1.5,
    active: mode === 'light' ? 'rgba(0, 0, 0, 0.8)' : '#e0e0e0',
    inactive: '#757575',
  }
  drawerWidth.close = `calc(2*${menuItem.padding}rem + ${menuItem.icon}rem)`
  routeWidth.close = `calc(100vw - (2*${menuItem.padding}rem + ${menuItem.icon}rem))`

  const greyShade = '600'

  const styles = {
    root: theme => ({
      display: 'flex',
      background: theme.palette.background.default,
    }),
    drawer: {
      width: open ? drawerWidth.open : drawerWidth.close,
      transition: 'width 0.5s',
      backgroundColor: 'rgba(0, 0, 0, 0.05)',
      overflow: 'hidden',
      whiteSpace: 'nowrap',
    },
    link: {
      textDecoration: 'none',
    },
    chevronItem: theme => ({
      display: 'flex',
      justifyContent: open ? 'flex-end' : 'center',
      borderRadius: '0',
      padding: '0',
      marginLeft: rtl ? 'inherit' : open ? '0' : '-0.5rem',
      marginRight: ltr ? 'inherit' : open ? '0' : '-0.5rem',
      '& svg': {
        fontSize: '2rem !important',
        transform: `rotate(${(open && ltr) || (!open && rtl) ? 0 : 180}deg)`,
        transition: 'transform 0.5s',
        color: theme.palette.grey[greyShade],
      },
      '&:hover': {
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
        color: 'white',
        '& svg': {
          color: 'white',
        },
      },
    }),
    iconWrapper: theme => ({
      display: 'flex',
      padding: `${menuItem.padding}rem`,
      '& svg': {
        fontSize: `${menuItem.icon}rem`,
      },
      '& svg[data-testid="SwitchRightOutlinedIcon"]': {
        transform: `rotate(${dir === 'rtl' ? 180 : 0}deg)`,
        transition: 'transform 0.5s',
      },
    }),
    drawerItem: theme => ({
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'flex-start',
      borderRadius: '0',
      padding: '0',
      color: theme.palette.grey[greyShade],
      '&:hover': {
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
        color: 'white !important',
        '& svg': {
          color: 'white',
        },
      },
    }),
    title: {
      margin: '0 2px',
      fontSize: direction === 'rtl' ? '1.2rem' : 'inherit',
    },
    route: {
      width: open ? routeWidth.open : routeWidth.close,
      transition: 'width 1s',
      zIndex: '0',
      '& > div': {
        height: '100%',
      },
    },
    logo: {
      position: 'absolute',
      [placement]: '0',
      height: '8vh',
      '& img': {
        height: '100%',
        width: 'auto',
      },
    },
  }

  const routes = [
    // {
    //   path: 'file',
    //   component: <File />,
    //   icon: <Folder />,
    //   title: t('file'),
    //   color: pathname === '/home/file' ? menuItem.active : menuItem.inactive,
    // },
    {
      path: 'schedule',
      component: <Schedule />,
      icon: <ScheduleIcon />,
      title: t('schedule'),
      color:
        pathname === '/home/schedule' ? menuItem.active : menuItem.inactive,
    },
    // {
    //   path: 'routes',
    //   component: <Routes />,
    //   icon: <RoutesIcon />,
    //   title: t('routes'),
    //   color: pathname === '/home/routes' ? menuItem.active : menuItem.inactive,
    // },
    // {
    //   path: 'dashboard',
    //   component: <Dashboard />,
    //   icon: <DashboardOutlinedIcon />,
    //   title: t('dashboard'),
    //   color:
    //     pathname === '/home/dashboard' ? menuItem.active : menuItem.inactive,
    // },
  ]
  const toggles = [
    {
      key: 'lang',
      icon: <SwitchRightOutlinedIcon />,
      onClick: () => {
        setDir(dir => (dir === 'ltr' ? 'rtl' : 'ltr'))

        setTimeout(() => {
          dispatch(toggleLocale())
          dispatch(resetCriteria())
          dispatch(deselectRequests())
          dispatch(deselectDepots())
          dispatch(deselectZones())
          dispatch(updateDeliveriesSelection({ selection: [] }))
        }, 500)
      },
      title: t('lang'),
    },
    {
      key: 'mode',
      icon:
        mode === 'light' ? <DarkModeOutlinedIcon /> : <LightModeOutlinedIcon />,
      onClick: () => dispatch(toggleMode()),
      title: t('mode'),
    },
    // {
    //   key: 'logout',
    //   icon: <Logout />,
    //   onClick: () => dispatch(logout()),
    //   title: t('logout'),
    // },
  ]

  return (
    <Page css={styles.root}>
      <div css={styles.drawer}>
        <nav>
          <Button
            fullWidth
            css={styles.chevronItem}
            onClick={() => dispatch(toggleDrawer())}
          >
            <div css={styles.iconWrapper}>
              <ChevronLeftIcon />
            </div>
          </Button>
          {routes.map(({ path, title, icon, color }) => (
            <Link to={`${url}/${path}`} css={styles.link} key={path}>
              <Button fullWidth css={styles.drawerItem} title={title}>
                <div css={styles.iconWrapper} style={{ color }}>
                  {icon}
                </div>
                <div css={styles.title} /* style={{ color }} */>{title}</div>
              </Button>
            </Link>
          ))}
          {toggles.map(({ key, title, icon, onClick }) => (
            <Button
              fullWidth
              css={styles.drawerItem}
              {...{ key, onClick, title }}
            >
              <div css={styles.iconWrapper}>{icon}</div>
              <div css={styles.title}>{title}</div>
            </Button>
          ))}
        </nav>
      </div>
      <div css={styles.route}>
        <Switch>
          {routes.map(({ path, component }) => (
            <Route path={`${url}/${path}`} key={path}>
              {component}
            </Route>
          ))}
        </Switch>
      </div>
      <div css={styles.logo}>
        <img src={Logo} alt="logo" />
      </div>
    </Page>
  )
}

export default Home
