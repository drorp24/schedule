/** @jsxImportSource @emotion/react */
import * as L from 'leaflet'
import './map.css'

import shadow from '../assets/marker-shadow.png'
import gold from './markers/gold.svg'
import blue from './markers/blue.svg'
import deepskyblue from './markers/deepskyblue.svg'
import lightgreen from './markers/lightgreen.svg'
import orange from './markers/orange.svg'
import mediumpurple from './markers/mediumpurple.svg'
import red from './markers/red.svg'
import teal from './markers/teal.svg'
import defaultIcon from './markers/default.png'
import depot from './markers/depot.svg'

const icons = {
  red,
  blue,
  orange,
  mediumpurple,
  deepskyblue,
  teal,
  lightgreen,
  gold,
}

export const dropIcon = ({ entities, color }) => {
  let iconUrl, shadowUrl, iconSize, shadowSize, className
  if (entities === 'depots') {
    iconUrl = depot
    shadowUrl = null
    iconSize = [30, 45]
    shadowSize = null
    className = 'depotIcon'
  } else {
    iconUrl = color && icons[color] ? icons[color] : defaultIcon
    shadowUrl = shadow
    iconSize = [20, 25]
    shadowSize = [20, 20]
  }
  return new L.Icon({
    iconUrl,
    shadowUrl,
    iconSize,
    shadowSize,
    className,
  })
}

export const tileProviders = [
  {
    name: 'stadiaDark',
    bestFor: 'dark',
    args: {
      url: 'https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png',
      attribution:
        '© <a href="https://stadiamaps.com/">Stadia Maps</a>, © <a href="https://openmaptiles.org/">OpenMapTiles</a> © <a href="http://openstreetmap.org">OpenStreetMap</a> contributors',
    },
  },
  {
    name: 'esriWorldStreetMap',
    args: {
      url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}',
      attribution:
        'Tiles &copy; Esri &mdash; Source: Esri, DeLorme, NAVTEQ, USGS, Intermap, iPC, NRCAN, Esri Japan, METI, Esri China (Hong Kong), Esri (Thailand), TomTom, 2012',
    },
  },
  {
    name: 'esriWorldImagery',
    args: {
      url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
      attribution:
        'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',
    },
  },
  {
    name: 'cartoDbVoyager',
    args: {
      url: 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
    },
  },
  {
    name: 'osm',
    args: {
      url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    },
  },
  // {
  //   name: 'openTopoMap',
  //   args: {
  //     url: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
  //     attribution:
  //       'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)',
  //   },
  // },
  {
    bestFor: 'light',
    name: 'osmBright',
    args: {
      url: 'https://tiles.stadiamaps.com/tiles/osm_bright/{z}/{x}/{y}{r}.png',
      attribution:
        '&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors',
    },
  },
  // {
  //   name: 'cyclOsm',
  //   args: {
  //     url: 'https://{s}.tile-cyclosm.openstreetmap.fr/cyclosm/{z}/{x}/{y}.png',
  //     attribution:
  //       '<a href="https://github.com/cyclosm/cyclosm-cartocss-style/releases" title="CyclOSM - Open Bicycle render">CyclOSM</a> | Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  //   },
  // },
  // {
  //   name: 'jawgStreets',
  //   args: {
  //     url: 'https://{s}.tile.jawg.io/jawg-streets/{z}/{x}/{y}{r}.png',
  //     attribution:
  //       '<a href="http://jawg.io" title="Tiles Courtesy of Jawg Maps" target="_blank">&copy; <b>Jawg</b>Maps</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  //   },
  // },
]

export const locations = {
  home: [32.1249061, 34.8286079],
  away: [31.4388035, 34.3936352],
}

export const flyToOptions = {
  maxZoom: 16,
  duration: 1,
}
