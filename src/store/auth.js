import Cookie from 'js-cookie'

export const checkAuth = async store => {
  // console.log('store/auth/check')
  let CFG = store.get().CFG

  if (Boolean(Cookie.get('token')) === false) {
    store.set({
      isAuth: false,
      user: null,
    })
    return false
  }

  let res = await fetch(`/${CFG.API_VERSION}/auth/check`, {
    method: 'GET',
    credentials: 'same-origin',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  }).then(res => res.json())

  if (res.error || Boolean(res.token) === false ) {
    store.set({
      isAuth: false,
      user: null,
    })
    return false
  }
  
  Cookie.set('token', res.token, { path: '/', expires: CFG.COOKIE_TIMEOUT })

  store.set({
    isAuth: true,
    user: res.user,
  })
  return true
}

export const periodicCheckAuth = store => {
  let CFG = store.get().CFG

  setInterval(() => {
    checkAuth(store)
  }, CFG.AUTH_CHECK)
}

export const login = async (store, credentials) => {
  let CFG = store.get().CFG

  try {
    let res = await fetch(`/${CFG.API_VERSION}/auth/login`, {
      method: 'POST',
      credentials: 'same-origin',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    }).then(res => res.json())

    if (res.error) {
      throw res.error
    }
    Cookie.set('token', res.token, { path: '/', maxAge: CFG.COOKIE_TIMEOUT })

    store.set({
      isAuth: true,
      user: res.user,
    })
    return true
  } catch (error) {
    store.set({
      isAuth: false,
      user: null,
    })
    console.error('store/auth/login error', error)
    return false
  }
}

export const logout = async store => {
  let CFG = store.get().CFG

  try {
    await fetch(`/${CFG.API_VERSION}/auth/logout`, {
      method: 'POST',
      credentials: 'same-origin',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    }).then(res => res.json())

    Cookie.remove('token', { path: '/' })

    store.set({
      isAuth: false,
      user: null,
    })
    return true
  } catch (error) {
    console.error('store/auth/logout error', error)
    return false
  }
}

export const resetpassword = async (store, email) => {
  let CFG = store.get().CFG

}

export const signup = async (store, user) => {
  let CFG = store.get().CFG

  try {
    let res = await fetch(`/${CFG.API_VERSION}/auth/signup`, {
      method: 'POST',
      credentials: 'same-origin',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(user),
    }).then(res => res.json())

    if (res.error) {
      throw res.error
    }
    Cookie.set('token', res.token, { path: '/', maxAge: CFG.COOKIE_TIMEOUT })

    store.set({
      isAuth: true,
      user: res.user,
    })
    return true
  } catch (error) {
    console.error('store/auth/signup error ', error)
    return false
  }
}
