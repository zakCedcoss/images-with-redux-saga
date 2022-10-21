import { call, put, takeEvery } from "redux-saga/effects";
import {
  recieveImagesPending,
  recieveImagesFulfilled,
  recieveImagesRejected,
} from "../reducers/ImageSlice";

const imageApi = (page) => {
  const unsplashApi = `https://api.unsplash.com/search/photos?page=${page}&query=nature&client_id=pUMdKf_Knqnrm9YOuFpuKbiV5q6WgsAU3vbg5PEkTTA&per_page=20`;
  return unsplashApi;
};

async function fetchImg(page = 1) {
  try {
    const resp = await fetch(imageApi(page));
    const data = await resp.json();
    return { data };
  } catch (error) {
    return { error };
  }
}

function* fetchImages(action) {
  const { data } = yield call(fetchImg, action.payload);
  if (data?.errors) {
    yield put(recieveImagesRejected(data.errors));
  } else {
    yield put(recieveImagesFulfilled(data));
  }
}

function* fetchImagesSaga() {
  yield takeEvery(recieveImagesPending, fetchImages);
}

export default fetchImagesSaga;
