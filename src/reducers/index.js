import { combineReducers } from "redux";
import marketplace from "./marketplace";
import assets from "./assets";

const reducer = combineReducers({
  marketplace,
  assets
});

export default reducer;
