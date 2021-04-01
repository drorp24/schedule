import platforms from './platforms'

const airplaneSvg = `
  <svg
    class="MuiSvgIcon-root"
    focusable = "false"
    viewBox = "0 0 24 24" >
      <path d="M22 16v-2l-8.5-5V3.5c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5V9L2 14v2l8.5-2.5V19L8 20.5V22l4-1 4 1v-1.5L13.5 19v-5.5L22 16z"></path>
  </svg>`

const giftSvg = `
  <svg
    class="MuiSvgIcon-root"
    viewBox="0 0 24 24">
      <path d="M20 6h-2.18c.11-.31.18-.65.18-1 0-1.66-1.34-3-3-3-1.05 0-1.96.54-2.5 1.35l-.5.67-.5-.68C10.96 2.54 10.05 2 9 2 7.34 2 6 3.34 6 5c0 .35.07.69.18 1H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-5-2c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zM9 4c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm11 15H4v-2h16v2zm0-5H4V8h5.08L7 10.83 8.62 12 12 7.4l3.38 4.6L17 10.83 14.92 8H20v6z"></path>
  </svg>`

const timeSvg = `
  <svg
    class="MuiSvgIcon-root"
    viewBox="0 0 24 24">
      <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z"></path>
      <path d="M12.5 7H11v6l5.25 3.15.75-1.23-4.5-2.67z"></path>
  </svg>
`

const styles = {
  item:
    'display: flex; justify-content: space-evenly; align-items: center; width: 100%;',
  centered: 'display: flex; justify-content: center; align-items: center;',
  iconContainer: 'display: flex',
}
const itemTemplate = (
  { start_date, platform_id, drone_formation, drone_package_config_id },
  element,
  data,
  granular
) => {
  const { backgroundColor: bg, borderColor: bc } = platforms[platform_id]

  if (!granular && start_date)
    return `
    <div style="${
      styles.item
    } background-color: ${bg}; border-color: ${bc}; padding: 5px;">
      <div style="font-size: 0.65rem;">${start_date?.slice(-8)}</div>
    </div>
  `

  return `
    <div style="${
      styles.item
    } background-color: ${bg}; border-color: ${bc}; padding: 5px;">
      <span style="${styles.centered}">
        <span style="${styles.iconContainer}">${timeSvg}</span>
        <span>${start_date && start_date.slice(-8)}</span>
      </span>
      <span style="${styles.centered}">
        <span style="${styles.iconContainer}">${airplaneSvg}</span>
        <span>${drone_formation}</span>
      </span>
      <span style="${styles.centered}">
        <span style="${styles.iconContainer}">${giftSvg}</span>
        <span>${drone_package_config_id}</span>
      </span>
    </div>`
}

export default itemTemplate
