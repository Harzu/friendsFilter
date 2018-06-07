import VKApi from './VK'
import Render from './render'
import _config from './config'
import './utils'

let _items = {
  left: [],
  right: []
}

export default class FriendsFilter {
  constructor () {
    this.vk = new VKApi()
    this.Render = new Render()
    this.storage()
  }

  async storage () {
    const friends = localStorage.getItem('friendsList')
    const getFriends = await this.vk.getFriends('friends.get', {
      v: _config.versionApi,
      'user_id': _config.id,
      'fields': 'photo_50'
    })

    if (getFriends.response) {
      _items.left = getFriends.response
    }

    if (typeof friends !== 'undefined' &&
        friends !== null && getFriends.response) {
      const data = JSON.parse(friends)
      const responseText = this.sort(getFriends.response)

      if (data.left.equals(responseText)) {
        _items = data
      } else {
        const findArr = this.sort([..._items.left, ..._items.right])

        for (let itemResp of responseText) {
          for (let itemFind of findArr) {
            if (typeof itemFind !== 'undefined' &&
                typeof itemResp !== 'undefined' &&
                itemFind.user_id === itemResp.user_id) {
              findArr.splice(findArr.indexOf(itemFind), 1)
            }
          }
        }

        _items.left = [...data.left, ...findArr]
        _items.right = data.right
      }
    }

    this.Render.renderLists(this.sort(_items.left), 'left')
    this.Render.renderLists(this.sort(_items.right), 'right')
  }

  sort (arr) {
    return arr.sort((a, b) => {
      if (a.first_name > b.first_name) { return 1 }

      return -1
    })
  }

  getCurrentZone (target) {
    const zone = target.getAttribute('data-zone')

    if (['left', 'right'].includes(zone)) {
      return zone
    }

    if (target.parentElement) {
      return this.getCurrentZone(target.parentElement)
    }
  }

  filter (value, zone) {
    const filterArr = []

    _items[zone].forEach(item => {
      if (item.first_name.toLowerCase().includes(value.toLowerCase()) ||
            item.last_name.toLowerCase().includes(value.toLowerCase())) {
        filterArr.push(item)
      }
    })

    this.Render.renderLists((this.sort(filterArr) || this.sort(_items[zone])), zone)
  }

  refreshTable (params) {
    const finishZone = (params.zone === 'left') ? 'right' : 'left'

    _items[params.zone].forEach((item, i) => {
      if (item.user_id === Number(params.id) &&
            params.zone !== finishZone) {
        _items[params.zone].splice(i, 1)
        _items[finishZone].push(item)
      }
    })

    this.Render.renderLists(this.sort(_items.left), 'left')
    this.Render.renderLists(this.sort(_items.right), 'right')
  }

  save () {
    (_items.left.length || _items.right.length) &&
        localStorage.setItem('friendsList', JSON.stringify(_items))
  }
}
