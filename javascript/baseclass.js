const wrapper = document.createElement('div',)
wrapper.classList.add("wrapper")

class GameUnit {
  /**
   *
   * @param type {string}
   * @param id {number}
   * @param name {string}
   * @param des {string}
   * @param itl {string}
   * @param res_related {Array[Resource, number]}
   * @param condition {() => boolean}
   */
  constructor(type, id, name, des, itl = "", condition = true_func, ...res_related) {
    this.type = type
    this.id = id
    this.name = name
    this.des = des
    this.itl = itl
    this.produce = []
    this.cost = []
    this.condition = condition
    this.unlocked = false
    this.displayed = false
    for (let i = 0; i < res_related.length; i++) {
      let v = res_related[i]
      if (v[1] > 0) {
        this.produce.push(v)
      }
      if (v[1] < 0) {
        this.cost.push(v)
      }
    }
    this.init_html_elements()
    this.set_el_listener()
    this.set_ee_listener()
  }

  get can_produce() {
    if (!this.unlocked) {return false}
    let can_produce = true
    this.cost.forEach(x => {
      can_produce = (x[0].amount >= abs(x[1]) && can_produce)
    })
    return can_produce
  }

  static insertDesDiv(des_div) {
    let body = document.getElementById('root').parentNode
    body.appendChild(des_div)
  }

  /* 曾经用来div的
  init_div() {
    let div = document.createElement('div')
    div.innerHTML = `
      <button type="button" class="unit-btn-disabled unit-r-btn grey-bgi w-full mx-10 py-10" id="[type]_btn_[id]">[name]</button>
      `
      .replaceAll('[type]', this.type)
      .replaceAll('[id]', str(this.id))
      .replaceAll('[name]', this.name)
    div.classList.add("w-full", "lg:w-1/4", "display-none")
    this.div = div
    return div
  }

  init_des_div() {
    let des_div = document.createElement('div')
    des_div.innerHTML = `
    <p>[des]</p>
    [p/c]
    <p class="unit-itl">[itl]</p>
    `.replace('[des]', this.des).replace('[itl]', this.itl).replace('[p/c]', this.get_res_related_html)
    des_div.classList.add('unit-des-div')
    des_div.id = this.type + "_des_" + this.id

    this.popout_div = des_div
    return des_div
  }
  get get_res_related_html() {
    let p_divs = this.get_p_html()
    let c_divs = this.get_c_html()
    let p_div = ""
    let c_div = ""

    for (let i = 0; i < p_divs.length; i++) {
      p_div += p_divs[i]
    }
    for (let i = 0; i < c_divs.length; i++) {
      c_div += c_divs[i]
    }
    return p_div + c_div
  }

  get_p_html() {
    let divs = []
    for (let i = 0; i < this.produce.length; i++) {
      let arr = this.produce[i]
      let div = `<div class="produce flex-around w-75%"><p>Produce</p><p>+Amount/s</p></div>`.replace('Produce', arr[0].name).replace('Amount', arr[1])
      divs.push(div)
    }
    return divs
  }

  get_c_html() {
    let divs = []
    for (let i = 0; i < this.cost.length; i++) {
      let arr = this.cost[i]
      let div = `<div class="cost flex-around w-75%"><p>Cost</p><p>-Amount/s</p></div>`.replace('Cost', arr[0].name).replace('Amount', arr[1])
      divs.push(div)
    }
    return divs
  }
  */

  set_ee_listener() {
    let id = this.id
    let btn = this.btn
    let des_div = this.popout_div
    let type = this.type

    btn.addEventListener('mouseenter',
      function (event) {
        btn.setAttribute('aria-describedby', type + '_des_' + id)
        GameUnit.insertDesDiv(des_div)
        des_div.style.position = "absolute"
        getDesDivTransform(btn, des_div)

        des_div.style.visibility = "visible"
      })
  }

  set_el_listener() {
    let btn = this.btn
    let popout_div = this.popout_div
    /**
     * @param {number} id
     * @param {MouseEvent} event MouseEnter
     */
    btn.addEventListener('mouseleave',
      function () {
        popout_div.remove()
        btn.removeAttribute('aria-describedby')
      }
    )
  }

  set_active() {
    this.btn.classList.replace('unit-btn-disabled', 'unit-btn-active')
  }

  set_disabled() {
    this.btn.classList.replace('unit-btn-active', 'unit-btn-disabled')
  }

  remove_display_none() {
    this.div.classList.remove('display-none')
  }
  set_display_none () {
    this.div.classList.add("display-none")
  }

  set_btn_onclick(func) {
    this.btn.onclick = func
  }

  set_btn_attr(bool) {
    if (bool) {
      this.set_active()
    } else {
      this.set_disabled()
    }
  }
  check_unlocked () {
    let condition = this.condition()
    this.unlocked = condition || this.unlocked
  }

  /**
   * @abstract
   * @return {void}
   */
  update() {
  }

  /**
   * 检查能不能display出来,如果可以则移除div的display:none
   */
  check_displayed () {
    if (this.unlocked && !this.displayed) {
      this.remove_display_none()
    }
  }

  /**
   * @abstract
   */
  load () {

  }

  /**
   * @abstract
   * @return {Array<number, boolean>}
   */
  save () {

  }

  init_html_elements() {
    this.div = createDiv()
    this.div.classList.add("w-full", "lg:w-1/4", "display-none")
    this.btn = document.createElement('button')
    this.btn.type = "button"
    this.btn.classList.add("unit-btn-disabled", "unit-r-btn", "grey-bgi", "w-full", "mx-10", "py-10")
    this.btn.id = this.type + "_btn_" + this.id
    this.btn.innerText = this.name
    this.div.appendChild(this.btn)

    this.popout_div = createDiv()
    this.popout_div.id = this.type + "_des_" + this.id
    this.popout_div.classList.add("unit-popout-div")
    this.des_p = document.createElement('p')
    this.des_p.innerText = this.des
    this.popout_div.appendChild(this.des_p)
    this.get_res_html()
    this.itl_p = createP(this.itl)
    this.itl_p.classList.add("unit-itl")
    this.popout_div.appendChild(this.itl_p)

  }
  get_res_html() {
    for (let i = 0; i < this.produce.length; i++) {
      let arr = this.produce[i]
      let div = createDiv()
      div.classList.add("produce", "flex-around", "w-75%")
      div.appendChild(createP(arr[0].name))
      div.appendChild(createP("+" + arr[1] + "/s"))
      this.popout_div.appendChild(div)
    }
    for (let i = 0; i < this.cost.length; i++) {
      let arr = this.cost[i]
      let div = createDiv()
      div.classList.add("cost", "flex-around", "w-75%")
      div.appendChild(createP(arr[0].name))
      div.appendChild(createP(arr[1] + "/s"))
      this.popout_div.appendChild(div)
    }
  }

  /**
   * 扣钱
   */
  do_cost () {
    this.cost.forEach(x => {
      x[0].cost(x[1]) //消耗
    })
  }

  /**
   * 生产
   */
  do_produce () {
    this.produce.forEach(x => {
      x[0].produce(x[1]) //生产
    })
  }
}

class GameUnitContain {
  /**
   *
   * @param type {string}
   * @param units {GameUnit}
   */
  constructor(type, ...units) {
    this.div = document.createElement('div')
    this.div.classList.add('content')
    this.div.style.display = "none"
    this.div.id = type + '-list'

    this.units = units

    wrapper.appendChild(this.div)

  }

  /**
   *
   * @param unit {GameUnit}
   */
  append_unit(unit) {
    this.units.push(unit)
    this.div.appendChild(unit.div)
  }

  update() {
    for (let i = 0; i < this.units.length; i++) {
      this.units[i].update()
    }
  }

  save() {
    let l = []
    for (let i=0; i <this.units.length; i++) {
      l.push(this.units[i].save())
    }
    return l
  }
}