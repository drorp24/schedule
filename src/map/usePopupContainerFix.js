import { useEffect } from 'react'
import useTheme from '../styling/useTheme'
import { useMode } from '../utility/appUtilities'

// * Change popup container bg color
// While mode change triggers FeatureDetails to re-render, the popup wrapper and tip aren't re-rendered.
// The code below therefore imperatively changes the bg color of the wrapper and tip whenever mode changes.
const usePopupContainerFix = () => {
  const theme = useTheme()
  const { mode } = useMode()

  return useEffect(() => {
    const popupWrappers = document.getElementsByClassName(
      'leaflet-popup-content-wrapper'
    )
    const popupTips = document.getElementsByClassName('leaflet-popup-tip')
    const popupWrapper =
      popupWrappers?.length === 1 ? popupWrappers[0] : undefined
    const popupTip = popupTips?.length === 1 ? popupTips[0] : undefined
    if (popupWrapper && popupTip) {
      popupWrapper.style.backgroundColor = theme.palette.background.paper
      popupTip.style.backgroundColor = theme.palette.background.paper
    }
  }, [mode, theme.palette.background.paper])
}

export default usePopupContainerFix
