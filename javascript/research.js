// class Research {
//   /**
//    *
//    * @param id {number}
//    * @param name {string}
//    * @param type {Resource}
//    * @param affect {number}
//    * @param time {number}
//    * @param cost {Resource}
//    * @param amount {number}
//    * @param des {string}
//    * @param itl {string}
//    * @param condition {function}
//    */
//   constructor(id, name, type, affect, time, des, condition,
//               cost = null, amount = 0, itl = '',) {
//     this.id = id
//     this.name = name
//     this.type = type
//     this.affect = affect
//     this.time = time
//     this.cost = cost
//     this.amount = amount
//     this.des = des
//     this.itl = itl
//     this.condition = condition
//     this.unlocked = false
//     this.displayed = false
//     this.started = false
//     this.progress = 0
//
//     this.type.register_research(this)
//
//     this._div()
//     this._des_div()
//   }
//
//   _div() {
//     let id = this.id
//     let div = document.createElement('div')
//     div.classList.add('w-full', 'lg:w-1/4')
//     div.id = allReplace('search_id', 'id', id)
//
//     let btn = document.createElement('button')
//     btn.innerText = this.name
//     btn.type = 'button'
//     btn.classList.add('w-full', 'r-button')
//     btn.onclick = true_func
//     btn.id = 'search_btn_' + id
//     div.appendChild(btn)
//
//     if (!this.unlocked) {
//       div.classList.add('display-none')
//     }
//
//     this.div = div
//     return div
//   }
//
//   _des_div() {
//     let div = document.createElement('div')
//     div.classList.add("des")
//     div.id = "search_des_ID".replace('ID', String(this.id))
//
//     let des = document.createElement('p')
//     des.innerText = this.des
//     des.classList.add("description")
//     div.appendChild(des)
//
//     let affect = document.createElement('div')
//     affect.classList.add('flex-between', 'produce')
//
//     let type_name = document.createElement('p')
//     type_name.innerText = this.type.name
//     affect.appendChild(type_name)
//
//     let type_value = document.createElement('p')
//     type_value.innerText = '+P%'.replace('P', String(this.amount))
//     affect.appendChild(type_value)
//     div.appendChild(affect)
//
//
//     if (this.cost != null) {
//       let cost = document.createElement('div')
//       cost.classList.add('flex-around', 'cost')
//
//       let c_name = document.createElement('p')
//       c_name.innerText = this.cost.name
//       cost.appendChild(c_name)
//
//       let c_value = document.createElement('p')
//       c_value.innerText = str(this.amount)
//       cost.appendChild(c_value)
//       div.appendChild(cost)
//     }
//     if (this.itl !== '') {
//       let itl = document.createElement('p')
//       itl.classList.add("des-itl")
//       itl.innerText = this.itl
//       div.appendChild(itl)
//     }
//     this.des_div = div
//     return div
//   }
//
//   set_ee_listener() {
//     let id = this.id
//     let btn = getResearchBtn(id)
//     let des_div = this.des_div
//
//     btn.addEventListener('mouseenter',
//       function (event) {
//         btn.setAttribute('aria-describedby', 'search_des_' + id)
//         insertDesDiv(des_div)
//         des_div.style.position = "absolute"
//         getDesDivTransform(btn, des_div)
//
//         des_div.style.visibility = "visible"
//       },
//       true)
//   }
//
//   set_el_listener() {
//     let id = this.id
//     let btn = getResearchBtn(id)
//     /**
//      * @param {number} id
//      * @param {MouseEvent} event MouseEnter
//      */
//     btn.addEventListener('mouseleave',
//       function () {
//         document.getElementById(btn.getAttribute('aria-describedby')).remove()
//         btn.removeAttribute('aria-describedby')
//       }
//     )
//   }
const research_list = new GameUnitContain("research")

class Research extends GameUnit {
  /**
   * @constructor
   * @param id {number}
   * @param name {string}
   * @param des {string}
   * @param itl {string}
   * @param time {number}
   * @param condition {() => boolean}
   * @param res_related {Array[Resource, number]} 直接填入百分比，如5，会自动处理为5%
   * @example
   * new Research (1, 'name', 'des', 'itl', 114514, true_func(), [res.energy, 10],...)
   * 一个为energy生产提供10%加成的。
   */
  constructor(id, name, des, itl, time, condition, ...res_related) {
    super('research', id, name, des, itl, condition, ...res_related);
    this.time = time
    this.progress = 0
    for (let i = 0; i < this.produce.length; i++) {
      this.produce[i][0].register_research(this, this.produce[i][1])
    }
    this.started = false
    this.finished = false

    research_list.append_unit(this)

    let _ = this
    this.btn.onclick = function () {
      if (!_.able_start()) {return}
      _.started = true
      }
  }

  get_res_html() {
    for (let i = 0; i < this.produce.length; i++) {
      let arr = this.produce[i]
      let div = createDiv()
      div.classList.add("produce", "flex-around", "w-75%")
      div.appendChild(createP(arr[0].name))
      div.appendChild(createP("+" + arr[1] + "%"))
      this.popout_div.appendChild(div)
    }
    for (let i = 0; i < this.cost.length; i++) {
      let arr = this.cost[i]
      let div = createDiv()
      div.classList.add("cost", "flex-around", "w-75%")
      div.appendChild(createP(arr[0].name))
      div.appendChild(createP(arr[1]))
      this.popout_div.appendChild(div)
    }
  }


  /**
   *
   * @return {boolean} 能否开始
   */
  able_start() {
    if (!this.unlocked) {
      return false
    }
    if (this.started || this.finished) {
      return false
    }
    if (this.cost == null) {
      return true
    }
    return this.can_produce
  }

  update() {
    this.check_unlocked()
    this.check_displayed()
    if (this.started) {
      this.progress += 1
      if (this.progress >= this.time) {
        this.finished = true
        this.set_display_none()
        this.progress = 0
      }
    } else {
      this.set_btn_attr(this.able_start())
    }

  }


  save() {
    return [this.started, this.progress, this.finished]
  }

  load(started = false, progress = 0, finished = false) {
    this.started = started
    this.progress = progress
  }

}

const researches = [
  new Research(1, "Lab module", "The first step of researching.", "", 5,
    () => (res.air.amount >= 5), [res.energy, -10], [res.energy, 5])
]