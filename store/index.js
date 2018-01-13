import * as consts from "../constants"

// Polyfill for `window.fetch()`
require("whatwg-fetch")

const remote = "http://localhost:8000"

export const state = () => ({
  sidebar: false,
  authUser: {
    // On first load, token state will be checked
    jwtTokenState: consts.JWT_TOKEN_VALIDATING,
    jwtToken: window.localStorage.getItem(consts.LOCAL_STORAGE_JWT_TOKEN),
    userId: window.localStorage.getItem(consts.LOCAL_STORAGE_USER_ID),
    userName: window.localStorage.getItem(consts.LOCAL_STORAGE_USER_NAME)
  }
})

export const mutations = {
  toggleSidebar(state) {
    state.sidebar = !state.sidebar
  },
  SET_USER(state, { jwtTokenState, jwtToken, userId, userName }) {
    state.authUser = {
      jwtTokenState,
      jwtToken,
      userId,
      userName
    }
  }
}

export const getters = {
  getUserLoginState: state => state.authUser.jwtTokenState,
  getUserName: state => state.authUser.userName
}

const setUserLocalStorage = userData => {
  window.localStorage.setItem(consts.LOCAL_STORAGE_JWT_TOKEN, userData.jwtToken)
  window.localStorage.setItem(consts.LOCAL_STORAGE_USER_ID, userData.userId)
  window.localStorage.setItem(consts.LOCAL_STORAGE_USER_NAME, userData.userName)
}

export const actions = {
  login({ commit }, { username, password }) {
    let f = fetch(`${remote}/api-token-auth/`, {
      credentials: "same-origin",
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        username,
        password
      })
    })

    let json = f.then(res => {
      return res.json()
    })
    return Promise.all([f, json])
      .then(([resFetch, resJSON]) => {
        if (resFetch.status === 400) {
          return {
            error: true,
            data: resJSON
          }
        } else {
          const dat = {
            jwtTokenState: consts.JWT_TOKEN_VALID,
            jwtToken: resJSON.token,
            userId: resJSON.user.id,
            userName: resJSON.user.username
          }
          commit("SET_USER", dat)
          setUserLocalStorage(dat)

          return {
            error: false,
            data: resJSON
          }
        }
      })
      .catch(err => {
        console.log(err)
      })
  },
  checkToken({ commit }) {
    const token = window.localStorage.getItem(consts.LOCAL_STORAGE_JWT_TOKEN)

    if (token === null) return

    return fetch(`${remote}/api-token-verify/`, {
      credentials: "same-origin",
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        token
      })
    })
      .then(res => {
        if (res.status === 400) {
          // User must login again - token check failed.
          const dat = {
            jwtTokenState: consts.JWT_TOKEN_INVALID,
            jwtToken: "",
            userId: -1,
            userName: ""
          }
          commit("SET_USER", dat)
          setUserLocalStorage(dat)
          throw new Error("Bad credentials")
        } else {
          return res.json()
        }
      })
      .then(authUser => {
        const dat = {
          jwtTokenState: consts.JWT_TOKEN_VALID,
          jwtToken: token,
          userId: authUser.user.id,
          userName: authUser.user.username
        }
        commit("SET_USER", dat)
        setUserLocalStorage(dat)
      })
      .catch(err => {
        console.log(err)
      })
  },
  logout({ commit }) {
    // Basically we only reset the database.
    // JWT tokens will automatically invalidated
    // by the server after a certain time they are not used
    return new Promise((resolve, reject) => {
      try {
        const dat = {
          jwtTokenState: consts.JWT_TOKEN_INVALID,
          jwtToken: "",
          userId: -1,
          userName: ""
        }
        commit("SET_USER", dat)
        setUserLocalStorage(dat)
        resolve({ status: "OK" })
      } catch (err) {
        reject(Error(err))
      }
    })
  }
}
