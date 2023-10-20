import { configureStore, combineReducers } from '@reduxjs/toolkit';

import {
    persistStore,
    persistReducer,
    FLUSH,
    REHYDRATE,
    PAUSE,
    PERSIST,
    PURGE,
    REGISTER
} from 'redux-persist';

import storage from 'redux-persist/lib/storage';

import userReducer from '../features/auth/userSlice';
import countCallReducer from '../features/call/countCallSlice';
import itemCallReducer from '../features/call/itemCallSlice';
import itemChatReducer from '../features/chat/itemChatSlice';


const rootReducer = combineReducers({
    user: userReducer,
    countCall: countCallReducer,
    itemCall: itemCallReducer,
    itemChat: itemChatReducer,
})

const persistConfig = {
    key: 'root',
    storage,
}

const persistedReducer = persistReducer(persistConfig, rootReducer)

const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoreActions: [
                    FLUSH,
                    REHYDRATE,
                    PAUSE,
                    PERSIST,
                    PURGE,
                    REGISTER,
                ]
            },
        }),
})

export const persistor = persistStore(store);
export default store;