export default class Render {
  constructor () {
    this.table = {
      left: document.querySelector('.filter-friends__container-left'),
      right: document.querySelector('.filter-friends__container-right')
    }
  }

  renderLists (items, zone) {
    const lists = {
      left: document.createElement('ul'),
      right: document.createElement('ul')
    }

    lists[zone].classList.add('filter-friends__list')
    const container = document.createDocumentFragment()

    items.forEach(friend => {
      const li = document.createElement('li')
      li.classList.add('filter-friends__item')
      li.setAttribute('draggable', true)
      li.setAttribute('data-id', friend.user_id)
      li.setAttribute('data-zone', zone)
      li.innerHTML = `
            <div class="filter-friends__item-container">
                <img class="filter-friends__img" src="${friend.photo_50}" alt="photo" draggable="false">
                <span class="filter-friends__name">
                    ${friend.first_name} ${friend.last_name}
                </span>
                <div class="filter-friends__${(zone === 'left') ? 'add' : 'delete'}">
                    <a data-id="${friend.user_id}" class="filter-friends__link fas fa-${(zone === 'left') ? 'plus' : 'times'}"></a>
                </div>
            </div>
            `
      container.appendChild(li)
    })

    lists[zone].appendChild(container)
    this.table[zone].innerHTML = ''
    this.table[zone].appendChild(lists[zone])
  }
}
