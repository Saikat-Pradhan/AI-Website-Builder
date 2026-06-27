import { createSlice } from '@reduxjs/toolkit'

export const websiteSlice = createSlice({
  name: 'websites',
  initialState: {
    websiteData:[]
  },
  reducers: {
    setWebsiteData: (state, action) => {
      state.websiteData = action.payload
    },
  },
})

export const { setWebsiteData } = websiteSlice.actions

export default websiteSlice.reducer