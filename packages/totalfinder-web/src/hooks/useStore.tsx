import React, { useEffect } from "react"
import { useLocalObservable } from "mobx-react"
import { action } from "mobx"
import { clearToken, setToken } from "../utils/ipc"

export interface TProfile {
  id: string
  mobile: string
}

export interface TInitialState {
  loading: boolean
  loginSuccess: boolean
  loginFormVisible: boolean
  profile?: TProfile
}

export interface MGlobalStore extends TInitialState {
  showLoading: Function
  hideLoading: Function
  login: Function
  logout: Function
  showLoginForm: Function
  hideLoginForm: Function
}

export const INITIAL_STORE: TInitialState = {
  loading: true,
  loginSuccess: false,
  loginFormVisible: false,
}

export const StoreContext = React.createContext(INITIAL_STORE as MGlobalStore)

export const useGlobalStore = (): MGlobalStore => {
  return React.useContext(StoreContext)
}

export function useGlobalProviderStore() {
  const store = useLocalObservable(() => {
    return {
      ...INITIAL_STORE,
      showLoading: action(() => {
        store.loading = true
      }),
      hideLoading: action(() => {
        store.loading = false
      }),
      login: action(async (token?: string, profile?: any) => {
        store.loginSuccess = true
        if (token) {
          await setToken(token)
        }
        if (profile) {
          store.profile = profile
        }
      }),
      logout: action(async () => {
        store.loginSuccess = false
        await clearToken()
      }),
      showLoginForm: action(async () => {
        store.loginFormVisible = true
      }),
      hideLoginForm: action(async () => {
        store.loginFormVisible = false
      }),
    }
  })

  useEffect(() => {
    /**
     *
     const unsubscribe = () => {}

     // Cleanup subscription on unmount
     return () => unsubscribe()
     */
  }, [])

  // Return the user object and auth methods
  return store
}

export function ProvideStore({ children }: { children: React.ReactNode }) {
  const globalStore = useGlobalProviderStore()
  return (
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    <StoreContext.Provider value={globalStore}>{children}</StoreContext.Provider>
  )
}
