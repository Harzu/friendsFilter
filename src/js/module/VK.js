import _config from './config'

export default class VKApi {
  constructor () {
    this.VK = VK
    this.VK.init({apiId: _config.appId}, '5.72')
    this.auth()
  }

  auth () {
    this.VK.Auth
      .login(response => {
        if (!response.session) {
          throw new Error('Не удалось авторизоваться')
        }

        console.log('всё ок!', response.session)
      }, 8)
  }

  getFriends (method, params) {
    return new Promise((resolve, reject) => {
      this.VK.api(method, params, res => {
        if (res.error) {
          reject(new Error(res.error.error_msg))
        }

        resolve(res)
      })
    })
  }
}
