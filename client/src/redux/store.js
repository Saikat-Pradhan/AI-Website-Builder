import { configureStore } from '@reduxjs/toolkit'
import userSlice from './userSlice.js'
import websiteSlice from './websiteSlice.js'

export const store =  configureStore({
  reducer: {
    user:userSlice,
    websites:websiteSlice
  },
})