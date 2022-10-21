import { configureStore } from "@reduxjs/toolkit";
import imageReducer from "../reducers/ImageSlice";
//saga
import createSagaMiddleware from "@redux-saga/core";
import fetchImagesSaga from "../saga/saga";

const productSaga = createSagaMiddleware();

const store = configureStore({
  reducer: {
    images: imageReducer,
  },
  middleware: () => [productSaga],
});

productSaga.run(fetchImagesSaga);

export default store;
