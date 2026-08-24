// frontend-TrueStub/src/core/store/data/index.ts

import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { AuthenticationGlobalStore } from "./@types/authentication.entity";
import { useGlobalAuthenticationSlice } from "./slices/authentication.slice";

export const useGlobalAuthenticationStore = create<AuthenticationGlobalStore>()(
  devtools(useGlobalAuthenticationSlice, { name: "AuthenticationStore" })
);