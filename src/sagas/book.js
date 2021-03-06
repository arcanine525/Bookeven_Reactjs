import {
    call,
    fork,
    put,
    take,
    takeLatest,
    select,
    takeEvery,
    delay
} from 'redux-saga/effects';
import { hideLoading, showLoading } from '../actions/ui';
import { push } from 'connected-react-router';
import imgurService from '../utils/imgurService';
import * as config from '../const/config'
import _get from 'lodash/get';
import * as types from '../const/actionType'
import {
    filterBooksSuccess, filterBooksFailed,
    fetchListFieldsbookSuccess, fetchListFieldsbookFailed,
    getDetailBookSuccess, getDetailBookFailed,
    updateListBookSuccess, updateListBookFailed,
    getListCommentsSuccess, getListCommentsFailed,
    addCommentSuccess, addCommentFailed,
    getBooksByBFIDSuccess, getBooksByBFIDFailed,
    getListBestSellerSuccess, getListBestSellerFailed,
    getListBestSalesSuccess, getListBestSalesFailed,
    getListBestRateSuccess, getListBestRateFailed,
    getListBestNewestSuccess, getListBestNewestFailed,
    updateCommentSuccess, updateCommentFailed,
    deleteCommentSuccess, deleteCommentFailed,
    getListBestRate as getListBestRate2, 
    uploadImageFailed, uploadImageSuccess,
    addNewBookSuccess, addNewBookFailed,
    addNewBook as onAddNewBook,
    getDetailBook as onGetDetailBook,
    getListRate as onGetListRate,
    getListComments as onGetListComments ,
    getListRateSuccess, getListRateFailed,
    rateBookSuccess, rateBookFailed,
    fourBestDiscountSuccess, fourBestDiscountFailed,
    fourNewestFailed, fourNewestSuccess,
    foutBestSellerFailed, foutBestSellerSuccess
} from '../actions/book'
import {
    getListFieldsbook, updateListBooks, getListComments, addComment, addRate,
    getListBestSeller, getBooksByBFID, getListNewest, getListBestRate, getListBestSales, getDetailBook,
    updateComment, deleteComment, filterBook, uploadImage, addNewBook, getListRate
} from '../apis/book'

import { STATUS_CODE } from '../const/config'
import { MSG_ERROR_OCCUR } from '../const/message'

function* watchGetListByBFIdTypeAction({ payload }) {
    try {
        yield put(showLoading())
        const res = yield call(getBooksByBFID, payload.data)
        const { status, data } = res
        const bookfield = yield select(state => state.books.fieldsBook)
        const name = bookfield.filter(item => item.id === payload.data.bookField_id)[0].name
        if (status === STATUS_CODE.SUCCESS) {
            const body = {
                ...data,
                bookfield: name,
                page: payload.data.page,
                amount: payload.data.amount
            }
            yield put(getBooksByBFIDSuccess(body))
            yield put(getListBestRate2({ bookField_id: payload.data.bookField_id }))
        } else {
            yield put(getBooksByBFIDFailed(data.message))
        }
    } catch (error) {
        var message = _get(error, 'response.data.message', {})
        if (typeof message === 'object')
            message = MSG_ERROR_OCCUR
        yield put(getBooksByBFIDFailed(message));
    } finally {
        yield delay(500)
        yield put(hideLoading())
    }
}

function* watchGetListRateAction({ payload }) {
    try {
        yield put(showLoading())
        const res = yield call(getListRate, payload.data)
        const { status, data } = res
        if (status === STATUS_CODE.SUCCESS) {
            yield put(getListRateSuccess(data))
        } else {
            yield put(getListRateFailed(data.message))
        }
    } catch (error) {
        var message = _get(error, 'response.data.message', {});
        if (typeof message === 'object')
            message = MSG_ERROR_OCCUR
        yield put(getListRateFailed(message));
    } finally {
        yield put(hideLoading())
    }
}

function* watchRateBookAction({ payload }) {
    try {
        yield put(showLoading())
        const res = yield call(addRate, payload.data)
        const { status, data } = res
        if (status === STATUS_CODE.CREATED) {
            yield put(onGetDetailBook({
                id: payload.data.book_id
            }))
            yield put(onGetListRate({
                book_id: payload.data.book_id
            }))
            yield put(rateBookSuccess(data))
        } else {
            yield put(rateBookFailed(data.message))
        }
    } catch (error) {
        var message = _get(error, 'response.data.message', {});
        if (typeof message === 'object')
            message = MSG_ERROR_OCCUR
        yield put(rateBookFailed(message));
    } finally {
        yield put(hideLoading())
    }
}

function* watchGetBestSellerAction({ payload }) {
    try {
        yield put(showLoading())
        const res = yield call(getListBestSeller, payload.data)
        const { status, data } = res
        if (status === STATUS_CODE.SUCCESS) {
            const body = {
                ...data,
                bookfield: 'Sách bán chạy',
                page: payload.data.page,
                amount: payload.data.amount
            }
            yield put(getListBestSellerSuccess(body))

        } else {
            yield put(getListBestSellerFailed(data.message))
        }
    } catch (error) {
        var message = _get(error, 'response.data.message', {});
        if (typeof message === 'object')
            message = MSG_ERROR_OCCUR
        yield put(getListBestSellerFailed(message));
    } finally {
        yield put(hideLoading())
    }
}

function* watchGetBestSalesAction({ payload }) {
    try {
        yield put(showLoading())
        const res = yield call(getListBestSales, payload.data)
        const { status, data } = res
        if (status === STATUS_CODE.SUCCESS) {
            const body = {
                ...data,
                bookfield: 'Sách giảm giá',
                page: payload.data.page,
                amount: payload.data.amount
            }
            yield put(getListBestSalesSuccess(body))

        } else {
            yield put(getListBestSalesFailed(data.message))
        }
    } catch (error) {
        var message = _get(error, 'response.data.message', {});
        if (typeof message === 'object')
            message = MSG_ERROR_OCCUR
        yield put(getListBestSalesFailed(message));
    } finally {
        yield put(hideLoading())
    }
}

function* watchGetListNewest({ payload }) {
    try {
        yield put(showLoading())
        const res = yield call(getListNewest, payload.data)
        const { status, data } = res
        if (status === STATUS_CODE.SUCCESS) {
            const body = {
                ...data,
                bookfield: 'Sách mới',
                page: payload.data.page,
                amount: payload.data.amount
            }
            yield put(getListBestNewestSuccess(body))

        } else {
            yield put(getListBestNewestFailed(data.message))
        }
    } catch (error) {
        var message = _get(error, 'response.data.message', {});
        if (typeof message === 'object')
            message = MSG_ERROR_OCCUR
        yield put(getListBestNewestFailed(message));
    } finally {
        yield put(hideLoading())
    }
}

function* watchGetBestRateAction({ payload }) {
    try {
        yield put(showLoading())
        const res = yield call(getListBestRate, payload.data)
        const { status, data } = res
        if (status === STATUS_CODE.SUCCESS) {
            yield put(getListBestRateSuccess(data))

        } else {
            yield put(getListBestRateFailed(data.message))
        }
    } catch (error) {
        var message = _get(error, 'response.data.message', {});
        if (typeof message === 'object')
            message = MSG_ERROR_OCCUR
        yield put(getListBestRateFailed(message));
    } finally {
        yield put(hideLoading())
    }
}

function* watchFetchFieldsbookAction() {
    while (true) {
        yield take(types.FETCH_LIST_FIELDSBOOK)
        try {
            const res = yield call(getListFieldsbook)
            const { status, data } = res
            if (status === STATUS_CODE.SUCCESS) {
                yield put(fetchListFieldsbookSuccess(data))
            } else {
                yield put(fetchListFieldsbookFailed(data.message))
            }
        } catch (error) {
            var message = _get(error, 'response.data.message', {});
            if (typeof message === 'object')
                message = MSG_ERROR_OCCUR
            yield put(fetchListFieldsbookFailed(message));
        }
    }
}

function* watchGetBookDetailAction({ payload }) {
    try {
        yield put(showLoading())
        const res = yield call(getDetailBook, payload.data)
        const { status, data } = res
        const bookfield = yield select(state => state.books.fieldsBook)
        const name = bookfield.filter(item => item.id === parseInt(data.bookfield_id))[0].name
        if (status === STATUS_CODE.SUCCESS) {
            var body = {
                ...data,
                bookfield: name
            }
            yield put(getDetailBookSuccess(body))
        }
        else
            yield put(getDetailBookFailed(data.message))
    } catch (error) {
        var message = _get(error, 'response.data.message', {});
        if (typeof message === 'object')
            message = MSG_ERROR_OCCUR
        yield put(getDetailBookFailed(message));
    } finally {
        yield delay(500)
        yield put(hideLoading())
    }
}


function* watchGetListComments({ payload }) {
    try {
        const res = yield call(getListComments, payload.data)
        const { status, data } = res
        if (status === STATUS_CODE.SUCCESS)
            yield put(getListCommentsSuccess(data))
        else yield put(getListCommentsFailed(data.message))
    } catch (error) {
        var message = _get(error, 'response.data.message', {});
        if (typeof message === 'object')
            message = MSG_ERROR_OCCUR
        yield put(getListCommentsFailed(message));
    }
}

function* watch4NewestComments({ payload }) {
    try {
        const res = yield call(getListNewest, payload.data)
        const { status, data } = res
        if (status === STATUS_CODE.SUCCESS)
            yield put(fourNewestSuccess(data))
        else yield put(fourNewestFailed(data.message))
    } catch (error) {
        var message = _get(error, 'response.data.message', {});
        if (typeof message === 'object')
            message = MSG_ERROR_OCCUR
        yield put(fourNewestFailed(message));
    }
}

function* watch4SellerComments({ payload }) {
    try {
        const res = yield call(getListBestSeller, payload.data)
        const { status, data } = res
        if (status === STATUS_CODE.SUCCESS)
            yield put(foutBestSellerSuccess(data))
        else yield put(foutBestSellerFailed(data.message))
    } catch (error) {
        var message = _get(error, 'response.data.message', {});
        if (typeof message === 'object')
            message = MSG_ERROR_OCCUR
        yield put(foutBestSellerFailed(message));
    }
}

function* watch4DiscountComments({ payload }) {
    try {
        const res = yield call(getListBestSales, payload.data)
        const { status, data } = res
        if (status === STATUS_CODE.SUCCESS)
            yield put(fourBestDiscountSuccess(data))
        else yield put(fourBestDiscountFailed(data.message))
    } catch (error) {
        var message = _get(error, 'response.data.message', {});
        if (typeof message === 'object')
            message = MSG_ERROR_OCCUR
        yield put(fourBestDiscountFailed(message));
    }
}

function* filterBooksAction({ payload }) {
    try {
        yield put(showLoading())
        const res = yield call(filterBook, payload.data)
        const { status, data } = res
        if (status === STATUS_CODE.SUCCESS) {
            var body = {
                ...data,
                bookfield: 'Kết quả cho tìm kiếm của bạn',
                page: payload.data.page,
                amount: payload.data.amount,

            }
            yield put(filterBooksSuccess(body, payload.data))
        }
        else yield put(filterBooksFailed(data.message))
    } catch (error) {
        var message = _get(error, 'response.data.message', {});
        if (typeof message === 'object')
            message = MSG_ERROR_OCCUR
        yield put(filterBooksFailed(message))
    } finally {
        yield put(hideLoading())
    }
}

function* updateBookAction({ payload }) {
    if (payload.data.image.length > 100) {
        try {
            yield put(showLoading())
            imgurService.setHeader('Authorization', `Client-Id ${config.imgur_client_id}`)
            const res = yield call(uploadImage, payload.data)
            if (res.status === STATUS_CODE.SUCCESS) {
                yield put(uploadImageSuccess(res.data))
                try {
                    var body = {
                        ...payload.data,
                        image: res.data.data.link
                    }
                    const resp = yield call(updateListBooks, body)
                    const { status, data } = resp
                    if (status === STATUS_CODE.SUCCESS) {
                        yield put(onGetDetailBook({ id: payload.data.id}))
                        yield put(updateListBookSuccess(body))
                    }
                    else yield put(updateListBookFailed(data.message))
                } catch (errors) {
                    var message = _get(errors, 'response.data.message', {});
                    if (typeof message === 'object')
                        message = MSG_ERROR_OCCUR
                    yield put(updateListBookFailed(message))
                }
            }
            else yield put(uploadImageFailed(res.data.message))
        } catch (errorss) {
            var err = _get(errorss, 'response.data.message', {});
            if (typeof err === 'object')
                err = MSG_ERROR_OCCUR
            yield put(uploadImageFailed(err))
        } finally {
            yield put(hideLoading)
        }
    }
    else {
        try {
            yield put(showLoading())
            const res = yield call(updateListBooks, payload.data)
            const { status, data } = res
            if (status === STATUS_CODE.SUCCESS) {
                yield put(onGetDetailBook({ id: payload.data.id}))
                yield put(updateListBookSuccess(data))
            }
            else yield put(updateListBookFailed(data.message))
        } catch (error) {
            var erro = _get(error, 'response.data.message', {});
            if (typeof message === 'object')
                erro = MSG_ERROR_OCCUR
            yield put(updateListBookFailed(erro))
        } finally {
            yield put(hideLoading())
        }
    }
}

function* addCommentAction({ payload }) {
    try {
        const res = yield call(addComment, payload.data)
        const { status, data } = res
        if (status === STATUS_CODE.CREATED) {
            yield put(onGetListComments({ id: payload.data.book_id }))
            yield put(addCommentSuccess(data))
        }
        else yield put(addCommentFailed(data.message))
    } catch (error) {
        var message = _get(error, 'response.data.message', {});
        if (typeof message === 'object')
            message = MSG_ERROR_OCCUR
        yield put(addCommentFailed(message))
    }
}

function* updateCommentAction({ payload }) {
    try {
        const res = yield call(updateComment, payload.data)
        const { status, data } = res
        if (status === STATUS_CODE.SUCCESS) {
            yield put(updateCommentSuccess(payload.data))
        }
        else yield put(updateCommentFailed(data.message))
    } catch (error) {
        var message = _get(error, 'response.data.message', {});
        if (typeof message === 'object')
            message = MSG_ERROR_OCCUR
        yield put(updateCommentFailed(message))
    }
}

function* watchUploadImage({ payload }) {
    try {
        imgurService.setHeader('Authorization', `Client-Id ${config.imgur_client_id}`)
        const res = yield call(uploadImage, payload.data)
        const { status, data } = res
        if (status === STATUS_CODE.SUCCESS) {
            yield put(onAddNewBook(data.data.link))
        }
        else yield put(uploadImageFailed(data.message))
    } catch (error) {
        var message = _get(error, 'response.data.message', {});
        if (typeof message === 'object')
            message = MSG_ERROR_OCCUR
        yield put(uploadImageFailed(message))
    }
}

function* watchAddNewBook({ payload }) {
    try {
        yield put(showLoading())
        imgurService.setHeader('Authorization', `Client-Id ${config.imgur_client_id}`)
        const res = yield call(uploadImage, payload.data)
        if (res.status === STATUS_CODE.SUCCESS) {
            yield put(uploadImageSuccess( payload.data))
            try {
                var body = {
                    ...payload.data,
                    image: res.data.data.link
                }
                const resp = yield call(addNewBook, body)
                const { status, data } = resp
                if (status === STATUS_CODE.CREATED) {
                    yield put(addNewBookSuccess(body))
                    yield put(push(`/chi-tiet-sach/${data.id.id}`))
                }
                else yield put(addNewBookFailed(data.message))
            } catch (error) {
                var message = _get(error, 'response.data.message', {});
                if (typeof message === 'object')
                    message = MSG_ERROR_OCCUR
                yield put(addNewBookFailed(message))
            }
        }
        else yield put(uploadImageFailed(res.data.message))
    } catch (error) {
        var err = _get(error, 'response.data.message', {});
        if (typeof err === 'object')
            err = MSG_ERROR_OCCUR
        yield put(uploadImageFailed(err))
    } finally {
        yield put(hideLoading())
    }

}

function* deleteCommentAction({ payload }) {
    try {
        const res = yield call(deleteComment, payload.data)
        const { status, data } = res
        if (status === STATUS_CODE.SUCCESS) {
            yield put(deleteCommentSuccess(payload.data))
        }
        else yield put(deleteCommentFailed(data.message))
    } catch (error) {
        var message = _get(error, 'response.data.message', {});
        if (typeof message === 'object')
            message = MSG_ERROR_OCCUR
        yield put(deleteCommentFailed(message))
    }
}


function* bookSaga() {
    yield fork(watchFetchFieldsbookAction)
    yield takeLatest(types.GET_LIST_RATE, watchGetListRateAction)
    yield takeLatest(types.RATE_BOOK, watchRateBookAction)
    yield takeEvery(types.GET_DETAIL_BOOK, watchGetBookDetailAction)
    yield takeLatest(types.FILTER_BOOKS, filterBooksAction)
    yield takeLatest(types.GET_LIST_COMMENTS, watchGetListComments)
    yield takeLatest(types.FOUR_NEWEST, watch4NewestComments)
    yield takeLatest(types.FOUR_BEST_DISCOUNT, watch4DiscountComments)
    yield takeLatest(types.FOUR_BEST_SELLER, watch4SellerComments)
    yield takeLatest(types.GET_LIST_BY_BF_ID, watchGetListByBFIdTypeAction)
    yield takeLatest(types.GET_LIST_BEST_SELLER, watchGetBestSellerAction)
    yield takeLatest(types.GET_LIST_BEST_SALES, watchGetBestSalesAction)
    yield takeLatest(types.GET_LIST_BEST_RATE, watchGetBestRateAction)
    yield takeLatest(types.GET_LIST_NEWEST, watchGetListNewest)
    yield takeLatest(types.ADD_NEW_BOOK, watchAddNewBook)
    yield takeLatest(types.UPLOAD_IMAGE, watchUploadImage)
    yield takeEvery(types.ADD_COMMENT, addCommentAction)
    yield takeEvery(types.UPDATE_COMMENT, updateCommentAction)
    yield takeEvery(types.DELETE_COMMENT, deleteCommentAction)
    yield takeLatest(types.UPDATE_BOOK, updateBookAction)
}

export default bookSaga