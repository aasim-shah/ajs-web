import { createSlice, PayloadAction } from '@reduxjs/toolkit';
interface TokenState {
  accessToken: string;
  refreshToken: string;
}
const initialState: TokenState = {
  accessToken: typeof window !== 'undefined' ? localStorage.getItem('accessToken') || '' : '',
  refreshToken: typeof window !== 'undefined' ? localStorage.getItem('refreshToken') || '' : '',
};
const tokenSlice = createSlice({
  name: 'tokens',
  initialState,
  reducers: {
    setAccessToken: (state, action: PayloadAction<string>) => {
      state.accessToken = action.payload;
      localStorage.setItem('accessToken', action.payload);
    },
    clearTokens: (state) => {
      state.accessToken = '';
      state.refreshToken = '';
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('accessToken');
    },
    setRefreshToken: (state, action: PayloadAction<string>) => {
      state.refreshToken = action.payload;
      localStorage.setItem('refreshToken', action.payload);
    },
   
  },
});
export const {
  setAccessToken,
  setRefreshToken,
  clearTokens
} = tokenSlice.actions;
export default tokenSlice.reducer;