"use client";

import {
  createContext,
  type Dispatch,
  type SetStateAction,
} from "react";



export type AppContextType =  {
  userInfo: string;
  setUserInfo: Dispatch<SetStateAction<string>>;
  projectDetails?: { 
    description?: string | null;
    schedule_time: string;
    phone_number: string;
    message: string;
    created_at?: string;
    sent_at?: string | null;}

};

export const appContext = createContext<AppContextType | undefined>(
  undefined
);