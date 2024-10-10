import { configureStore } from "@reduxjs/toolkit";
import AuthenticationReducer from "./ReducerAPI/AuthenticationReducer";
import ConsultationReducer from "./ReducerAPI/ConsultationReducer";
import UserReducer from "./ReducerAPI/UserReducer";

export const store = configureStore({
    reducer: {
      number: (state = 1) => state,
      AuthenticationReducer,
      ConsultationReducer,
      UserReducer,
    },
  });
  