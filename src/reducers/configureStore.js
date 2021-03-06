import { createStore } from 'redux';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import reducers from './rootReducer';

const persistConfig = {
	key: 'root',
	storage: storage,
};

const persistedReducer = persistReducer(persistConfig, reducers);

export default function configure() {
	let store = createStore(persistedReducer);
	let persistor = persistStore(store);
	return { store, persistor };
}
