import { useMemo } from 'react'
import { createMuiTheme } from '@material-ui/core/styles'

const useTheme = ({ mode, direction }) =>
  useMemo(() => {
    const colors = {
      light: {
        background: 'rgba(0, 0, 0, 0.05)',
        text: 'rgba(0, 0, 0, 0.87)',
        icon: 'rgba(0, 0, 0, 0.54)',
      },
      dark: {
        background: 'rgba(0, 0, 0, 0.05)',
        text: '#9e9e9e',
        icon: '#9e9e9e',
      },
    }

    return createMuiTheme({
      direction,
      palette: {
        mode,
        background: {
          paper: colors[mode].background,
        },
        text: {
          primary: colors[mode].text,
        },
        action: {
          active: colors[mode].icon,
        },
      },
    })
  }, [mode, direction])

export default useTheme
