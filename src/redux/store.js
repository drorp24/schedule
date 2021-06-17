import { configureStore } from '@reduxjs/toolkit'

import app from './app'
import users from './users'
import runs from './runs'
import requests from './requests'
import depots from './depots'
import zones from './zones'
import deliveries from './deliveries'
import deliveryPlans from './deliveryPlans'

const store = configureStore({
  reducer: {
    app,
    users,
    runs,
    requests,
    depots,
    zones,
    deliveries,
    deliveryPlans,
  },
})

export default store
