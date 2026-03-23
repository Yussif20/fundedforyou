import { createSlice } from "@reduxjs/toolkit"
import { RootState } from "./store"

type GmtState = {
    gmt: string
}

const initialState: GmtState = {
    gmt: (-new Date().getTimezoneOffset() / 60).toString()
}

export const gmtSlice = createSlice({
    name: 'gmt',
    initialState,
    reducers: {
        changeGmt: (state, action) => {
            const gmt = action.payload;
            state.gmt = gmt
        }
    }
})

export const { changeGmt } = gmtSlice.actions;
export default gmtSlice.reducer;
export const useCurrentGmt = (state: RootState) => state.gmt.gmt;