import { combineReducers } from "redux";
import reducers from "./reducers";

const rootReducer = combineReducers({
    data:reducers
})


export default rootReducer;
