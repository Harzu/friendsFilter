import '../style/style.scss'
import FriendsFilter from './module/FriendsFilter'

const filter = document.querySelector('.filter')
const search = document.querySelector('.search__form')
const close = document.querySelector('.header__close-link')
const save = document.querySelector('.footer__save-link')

const Friends = new FriendsFilter()
const _currentItem = {}

filter.addEventListener('click', e => {
  const targ = e.target
  if (targ.nodeName === 'A' &&
    targ.parentNode.classList.contains('filter-friends__add')) {
    const id = e.target.getAttribute('data-id')
    Friends.refreshTable({
      id: id,
      zone: Friends.getCurrentZone(e.target)
    })
  }

  if (targ.nodeName === 'A' &&
    targ.parentNode.classList.contains('filter-friends__delete')) {
    const id = e.target.getAttribute('data-id')
    Friends.refreshTable({
      id: id,
      zone: Friends.getCurrentZone(e.target)
    })
  }
})

filter.addEventListener('dragstart', e => {
  const targ = e.target

  _currentItem['id'] = targ.getAttribute('data-id')
  _currentItem['zone'] = Friends.getCurrentZone(e.target)
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
  Friends.refreshTable({
    id: _currentItem['id'],
    zone: _currentItem['zone']
  })
})

search.addEventListener('input', e => {
  const targ = e.target
  if (targ.classList.contains('search__inp--left')) {
    Friends.filter(targ.value, 'left')
  }

  if (targ.classList.contains('search__inp--right')) {
    Friends.filter(targ.value, 'right')
  }
})

save.addEventListener('click', Friends.save)
close.addEventListener('click', e => {
  e.preventDefault()
  localStorage.clear()
  window.location.reload()
}, {once: true})

export default Friends
