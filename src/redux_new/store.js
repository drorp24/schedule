import { configureStore } from '@reduxjs/toolkit'

import app from './app'
import users from './users'
import runs from './runs'
import requests from './requests'
import depots from './depots'
import zones from './zones'
import workplan from './workplan'

const store = configureStore({
  reducer: {
    app,
    users,
    runs,
    requests,
    depots,
    zones,
    workplan,
  },
})

export default store
