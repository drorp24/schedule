import { configureStore } from '@reduxjs/toolkit'

import app from './app'
import users from './users'
import runs from './runs'
import requests from './requests'
import resources from './resources'
import directives from './directives'
import recommendations from './recommendations'
import zones from './zones'

const store = configureStore({
  reducer: {
    app,
    users,
    runs,
    requests,
    resources,
    directives,
    recommendations,
    zones,
  },
})

export default store
