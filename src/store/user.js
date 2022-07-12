import {createSlice} from '@reduxjs/toolkit'

const NAME = {
    user: "user",
    token: "token",
    connected: "connected"
}

const getStorage = (name) => {
    const item = localStorage.getItem(name)
    return item ? JSON.parse(item) : null
}

const initialState = {
    user: getStorage(NAME.user),
    token: localStorage.getItem(NAME.token),
    errorLogin: false,
    connected: !!getStorage(NAME.user)
}

export const counterSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        login: (state, action) => {
            state.token = action.payload
            console.log(action.payload)
            localStorage.setItem(NAME.token, action.payload)
        },
        loginFailed: (state) => {
            state.errorLogin = true;
        },
        loadUser: (state, action) => {
            const u = {...action.payload.user, isAdmin: action.payload.roles?.includes("Admin") }
            state.user = u
            localStorage.setItem(NAME.user, JSON.stringify(u))
            state.connected = true
        },
        logout: (state) => {
            state.token = null
            state.user = null
            state.errorLogin = false
            state.connected = false
            localStorage.clear()
        }
    },
})

// Action creators are generated for each case reducer function
export const {loadUser, logout, loginFailed, login} = counterSlice.actions

export const isConnected = state => state.auth.connected
export const connectedUser = state => state.auth.user

export default counterSlice.reducer