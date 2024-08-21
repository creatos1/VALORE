//manejar el estado de autenticación.
import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    user: localStorage.getItem('user') ? localStorage.getItem('user') : null,
    token: localStorage.getItem('token') ? localStorage.getItem('token') : null,
    rol: localStorage.getItem('rol') ? localStorage.getItem('rol') : null,
  };

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setCredentials: (state, action) => {
            const { user, token, rol } = action.payload
            state.user = user
            state.token = token
            state.rol = rol
            localStorage.setItem('user', user);
            localStorage.setItem('token', token);
            localStorage.setItem('rol', rol);
        },
        logOut: (state) => {
            state.user = null
            state.token = null
            state.rol = null
            localStorage.removeItem('token')
            localStorage.removeItem('user')
            localStorage.removeItem('rol')
        }
    },
})

export const { setCredentials, logOut } = authSlice.actions

export default authSlice.reducer

export const selectCurrentUser = (state) => state.auth.user
export const selectCurrentToken = (state) => state.auth.token
export const selectCurrentRol = (state) => state.auth.rol
