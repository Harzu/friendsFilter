import VKApi from './VK'
import Render from './render'
import _config from './config'
import './utils'

const _currentItem = {}
let _items = {
  left: [],
  right: []
}

export default class FriendsFilter {
  constructor () {
    this.vk = new VKApi()
    this.Render = new Render()
    this.storage()

    const filter = document.querySelector('.filter')
    const search = document.querySelector('.search__form')
    const close = document.querySelector('.header__close-link')
    const save = document.querySelector('.footer__save-link')

    filter.addEventListener('click', e => {
      const targ = e.target
      if (targ.nodeName === 'A' &&
            targ.parentNode.classList.contains('filter-friends__add')) {
        const id = e.target.getAttribute('data-id')
        this.refreshTable({
          id: id,
          startZone: 'left',
          finishZone: 'right'
        })
      }

      if (targ.nodeName === 'A' &&
            targ.parentNode.classList.contains('filter-friends__delete')) {
        const id = e.target.getAttribute('data-id')
        this.refreshTable({
          id: id,
          startZone: 'right',
          finishZone: 'left'
        })
      }
    })

    filter.addEventListener('dragstart', e => {
      const targ = e.target

      _currentItem['id'] = targ.getAttribute('data-id')
      _currentItem['zone'] = targ.getAttribute('data-zone')
      e.dataTransfer.effectAllowed = 'move'
    })

    filter.addEventListener('dragenter', e => {
      e.preventDefault()
    })

    filter.addEventListener('dragover', e => {
      e.preventDefault()
    })

    filter.addEventListener('drop', e => {
      e.preventDefault()
      this.drop(e.target)
    })

    search.addEventListener('input', e => {
      const targ = e.target
      if (targ.classList.contains('search__inp--left')) {
        this.filter(targ.value, 'left')
      }

      if (targ.classList.contains('search__inp--right')) {
        this.filter(targ.value, 'right')
      }
    })

    save.addEventListener('click', this.save)
    close.addEventListener('click', e => {
      e.preventDefault()
      localStorage.clear()
      window.location.reload()
    }, {once: true})
  }

  async storage () {
    const friends = localStorage.getItem('friendsList')
    console.log(this.vk.VK)
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

  drop (target) {
    if (['left', 'right'].includes(target.getAttribute('data-zone'))) {
      return this.refreshTable({
        id: _currentItem.id,
        startZone: _currentItem.zone,
        finishZone: target.getAttribute('data-zone')
      })
    }

    if (target.parentElement) {
      this.drop(target.parentElement)
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
    _items[params.startZone].forEach((item, i) => {
      if (item.user_id === Number(params.id) &&
            params.startZone !== params.finishZone) {
        _items[params.startZone].splice(i, 1)
        _items[params.finishZone].push(item)
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
