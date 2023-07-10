class Research {
  /**
   *
   * @param id {number}
   * @param name {string}
   * @param type {Resource}
   * @param affect {number}
   * @param time {number}
   * @param cost {Resource}
   * @param amount {number}
   * @param des {string}
   * @param itl {string}
   * @param condition {function}
   */
  constructor(id, name, type, affect, time, des, condition,
              cost = null, amount = 0, itl = '',) {
    this.id = id
    this.name = name
    this.type = type
    this.affect = affect
    this.time = time
    this.cost = cost
    this.amount = amount
    this.description = des
    this.itl = itl
    this.condition = condition
    this.unlocked = false
    this.displayed = false
    this.started = false
    this.progress = 0

    this.type.register_research(this)

    this._div()
    this._des_div()
  }

  _div() {
    let id = this.id
    let div = document.createElement('div')
    div.classList.add('w-full', 'lg:w-1/4')
    div.id = allReplace('search_id', 'id', id)

    let btn = document.createElement('button')
    btn.innerText = this.name
    btn.type = 'button'
    btn.classList.add('w-full', 'r-button')
    btn.onclik = true_func
    btn.id = 'search_btn_' + id
    div.appendChild(btn)

    if (!this.unlocked) {
      div.classList.add('display-none')
    }

    this.div = div
    return div
  }

  _des_div() {
    let div = document.createElement('div')
    div.classList.add("des")
    div.id = "search_des_ID".replace('ID', String(this.id))

    let des = document.createElement('p')
    des.innerText = this.description
    des.classList.add("description")
    div.appendChild(des)

    let affect = document.createElement('div')
    affect.classList.add('flex-between', 'produce')

    let type_name = document.createElement('p')
    type_name.innerText = this.type.name
    affect.appendChild(type_name)

    let type_value = document.createElement('p')
    type_value.innerText = '+P%'.replace('P', String(this.amount))
    affect.appendChild(type_value)
    div.appendChild(affect)


    if (this.cost != null) {
      let cost = document.createElement('div')
      cost.classList.add('flex-around', 'cost')

      let c_name = document.createElement('p')
      c_name.innerText = this.cost.name
      cost.appendChild(c_name)

      let c_value = document.createElement('p')
      c_value.innerText = str(this.amount)
      cost.appendChild(c_value)
      div.appendChild(cost)
    }
    if (this.itl !== '') {
      let itl = document.createElement('p')
      itl.classList.add("des-itl")
      itl.innerText = this.itl
      div.appendChild(itl)
    }
    this.des_div = div
    return div
  }

  set_ee_listener() {
    let id = this.id
    let btn = getResearchBtn(id)
    let des_div = this.des_div

    btn.addEventListener('mouseenter',
      function (event) {
        btn.setAttribute('aria-describedby', 'search_des_' + id)
        insertDesDiv(des_div)
        des_div.style.position = "absolute"
        getDesDivTransform(btn, des_div)

        des_div.style.visibility = "visible"
      },
      true)
  }

  set_el_listener() {
    let id = this.id
    let btn = getResearchBtn(id)
    /**
     * @param {number} id
     * @param {MouseEvent} event MouseEnter
     */
    btn.addEventListener('mouseleave',
      function () {
        document.getElementById(btn.getAttribute('aria-describedby')).remove()
        btn.removeAttribute('aria-describedby')
      }
    )
  }

  /**
   *
   * @return {boolean} 能否开始
   */
  able_start () {
    if (!this.unlocked) {return false}
    if (this.cost == null) {return true}
    return this.cost.amount >= this.amount
  }

  update() {
    if (!this.unlocked) {
      // 检查条件是否满足
      this.unlocked = this.condition() // 设置条件,寄
      if (this.unlocked) {
        this.div.classList.remove('display-none')
      }
      return // 下次循环接着检查
    }

    if (!this.started) {
      return
    }
    this.progress += 1
  }


}

function getResearchBtn(id) {
  return document.getElementById("search_btn" + id)
}
function displayResearch() {
  for (let i = 0; i < player.researches.length; i++) {
    let research = player.researches[i]
    if (!research.displayed) {
      let researches = document.getElementById('research')
      researches.appendChild(research.div)
      research.displayed = true
    }
    if (!research.able_start()) {
      getResearchBtn(research.id).classList.add('btn-disabled')
    }
  }
}
function update_research() {
  for (let i = 0; i < player.researches.length; i++) {
    player.researches[i].update()
  }
}

const researches = [
  new Research(1, 'Lab module', resources.energy, 5, 5, '114514', true_func, null, 0,
    'So you shall fix this module as the first step to live.')
]