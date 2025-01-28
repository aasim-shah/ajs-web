// import { createAction, createSlice, PayloadAction } from '@reduxjs/toolkit';

// export const setAccessToken = createAction<string | null>('tokens/setAccessToken');
// export const getAccessToken = createAction('tokens/getAccessToken');

// export const tokensSlice = createSlice({
//   name: 'tokens',
//   initialState: {
//     accessToken: null as string | null,
//   },
//   reducers: {
//     setAccessToken: (state, action: PayloadAction<string | null>) => {
//       state.accessToken = action.payload;
//     },
//   },
//   extraReducers: (builder) => {
//     builder.addCase(getAccessToken, (state) => {
//       const accessToken = localStorage.getItem('accessToken');
//       state.accessToken = accessToken ? accessToken : null;
//     });
//   },
// });

// export const { setAccessToken: setAccessTokenToStore } = tokensSlice.actions;
// export const { getAccessToken: getAccessTokenFromStore } = tokensSlice.actions;
// export const selectAccessToken = (state: { tokens: { accessToken: string | null } }) => state.tokens.accessToken;

