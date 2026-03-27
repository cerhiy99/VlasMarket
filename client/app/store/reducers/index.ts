import { combineReducers } from 'redux'
import cartReducer from './cartReducer'
import adminReducer from './adminReducer'
import userReducer from './userReducers'
import watchedReducer from './userWatched'

// Об'єднання ред'юсерів
const rootReducer = combineReducers({
  BasketAndLike: cartReducer,
  admin: adminReducer,
  user: userReducer,
  watched: watchedReducer
})

export default rootReducer
