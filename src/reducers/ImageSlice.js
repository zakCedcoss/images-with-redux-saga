import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  images: [],
  backup: [],
  page: 1,
  isLoading: false,
  isError: false,
  message: "",
};

const imageSlice = createSlice({
  name: "images",
  initialState,
  reducers: {
    prev(state) {
      if (state.page < 2) {
        state.page = 1;
        return;
      }
      state.page -= 1;
    },
    next(state) {
      if (state.page > 54) {
        state.page = 55;
        return;
      }
      state.page += 1;
    },
    setter(state, action) {
      state.images = action.payload;
    },
    recieveImagesPending(state) {
      state.isLoading = true;
      state.isError = false;
    },
    recieveImagesFulfilled(state, action) {
      state.images = action.payload.results;
      state.backup = action.payload.results;
      state.isLoading = false;
      state.isError = false;
    },
    recieveImagesRejected(state) {
      state.images = [];
      state.backup = [];
      state.isLoading = false;
      state.isError = true;
    },
  },
});

export const {
  prev,
  next,
  setter,
  recieveImagesPending,
  recieveImagesFulfilled,
  recieveImagesRejected,
} = imageSlice.actions;
export default imageSlice.reducer;
