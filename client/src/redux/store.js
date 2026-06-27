import { configureStore } from '@reduxjs/toolkit'
import userSlice from './userSlice.js'
import websiteSlice from './websiteSlice'

export const store =  configureStore({
  reducer: {
    user:userSlice,
    websites:websiteSlice
  },
})