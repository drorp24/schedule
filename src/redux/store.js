import { configureStore } from '@reduxjs/toolkit'

import app from './app'
import users from './users'
import requests from './requests'
import resources from './resources'
import directives from './directives'
import recommendations from './recommendations'

const store = configureStore({
  reducer: {
    app,
    users,
    recommendations,
    requests,
    resources,
    directives,
  },
})

export default store
