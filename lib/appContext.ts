"use client";

import {
  createContext,
  type Dispatch,
  type SetStateAction,
} from "react";



export type AppContextType = {
  userInfo: string;
  setUserInfo: Dispatch<SetStateAction<string>>;


};

export const appContext = createContext<AppContextType | undefined>(
  undefined
);