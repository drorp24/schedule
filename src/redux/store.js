import { configureStore } from '@reduxjs/toolkit'

// unchanged
import app from './app'
import users from './users'
import runs from './runs'

// old
import recommendations from './recommendations'

// new
import requests from '../redux_new/requests'
import depots from '../redux_new/depots'
import zones from '../redux_new/zones'
import deliveries from '../redux_new/deliveries'
import deliveryPlans from '../redux_new/deliveryPlans'

const store = configureStore({
  reducer: {
    app,
    users,
    runs,
    requests,
    depots,
    zones,
    deliveries,
    recommendations,
    deliveryPlans,
  },
})

export default store
