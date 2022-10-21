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
  let response = {};
  try {
    const resp = await fetch(imageApi(page));
    const data = await resp.json();
    response.data = data;
  } catch (error) {
    response.errors = error;
  }
  return response;
}

function* fetchImages(action) {
  const { data, errors } = yield call(fetchImg, action.payload);
  console.log(data, errors);
  try {
    if (data) {
      yield put(recieveImagesFulfilled(data));
    } else {
      throw new Error("No data found !");
    }
  } catch (error) {
    yield put(recieveImagesRejected(errors));
    console.log(error);
  }
}

function* fetchImagesSaga() {
  yield takeEvery(recieveImagesPending, fetchImages);
}

export default fetchImagesSaga;
