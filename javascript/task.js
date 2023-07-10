class Task {
  /**
   *
   * @param {number} id 这个task的id
   * @param {string} name 这个Task的名字
   * @param {number} amount 这个task每秒的产量
   * @param {boolean} unlocked 这个task初始是否解锁
   * @param {string} description 这个task的描述
   * @param {Resource} produce 这个task产出的物资类型
   * @param {Resource} cost 这个task消耗的类型（null=没有
   * @param {number} cost_amount 这个task消耗的数量（0=没有
   * @param {function} condition 解锁这个task的条件（func
   * @param {string} itl
   */
  constructor(id, name, amount, description, unlocked, produce,
              cost = null, cost_amount = 0, condition = function () {
      return true
    }, itl = '') {
    this.name = name
    this.amount = amount
    this.description = description
    this.unlocked = unlocked
    this.produce = produce
    this.cost = cost
    this.cost_amount = cost_amount
    this.condition = condition
    this.displayed = false
    this.activated = false
    this.itl = itl
    this.id = id

    this._div()
    this._des_div()

  }

  /**
   * 每秒的自动update,产出或者检查是否满足解锁条件
   */
  update() {
    if (!this.unlocked) {
      // 检查条件是否满足
      this.unlocked = this.condition() // 设置条件,寄
      if (this.unlocked) {
        this.div.classList.remove('display-none')
      }
      return // 下次循环接着检查
    }

    if (!this.activated) {
      return
    } //没激活,你想干嘛
    if (this.cost != null) { //如果有cost
      if (this.cost_amount > this.cost.amount) {
        return
      } //钱不够return
      this.cost.amount -= this.cost_amount //钱够了先扣
    }
    this.produce.amount += this.amount //产出
  }

  _div() {
    let id = this.id
    let div = document.createElement('div')
    div.classList.add('task-disabled', 'task', 'w-full', 'lg:w-1/3')
    div.id = allReplace("task_id", "id", id)

    let task_btn = document.createElement('button')
    task_btn.type = "button"
    task_btn.id = allReplace("task_btn_id", "id", id)
    task_btn.onclick = function () {
      setTaskOn(id)
    }
    task_btn.classList.add("task-btn", 'w-full', 'task', 'r-button', 'btn-disabled')
    task_btn.innerText = this.name
    div.appendChild(task_btn)

    if (this.activated) {
      task_btn.classList.add('task')
      div.classList.add('task')
    }
    if (!this.unlocked) {
      div.classList.add('display-none')
    }
    this.div = div
    return div
  }

  _des_div() {
    let div = document.createElement('div')
    div.classList.add("des")
    div.id = "task_des_ID".replace('ID', String(this.id))

    let des = document.createElement('p')
    des.innerText = this.description
    des.classList.add("description")
    div.appendChild(des)

    let produce = document.createElement('div')
    produce.classList.add('flex-between', 'produce')

    let p_name = document.createElement('p')
    p_name.innerText = this.produce.name
    produce.appendChild(p_name)

    let p_value = document.createElement('p')
    p_value.innerText = '+P/s'.replace('P', String(this.amount))
    produce.appendChild(p_value)
    div.appendChild(produce)


    if (this.cost != null) {
      let cost = document.createElement('div')
      cost.classList.add('flex-around', 'cost')

      let c_name = document.createElement('p')
      c_name.innerText = this.produce.name
      cost.appendChild(c_name)

      let c_value = document.createElement('p')
      c_value.innerText = '-P/s'.replace('P', String(this.amount))
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

  get_div() {
    return document.getElementById("task_" + this.id)
  }

  get_des_div() {
    return document.getElementById("task_des_" + this.id)
  }

  set_ee_listener() {
    let id = this.id
    let btn = get_task_btn(id)
    let des_div = this.des_div

    btn.addEventListener('mouseenter',
      function (event) {
        btn.setAttribute('aria-describedby', 'task_des_' + id)
        insertDesDiv(des_div)
        des_div.style.position = "absolute"
        getDesDivTransform(btn, des_div)

        // des_div.style.left = (event.pageX).toString()
        // des_div.style.top = (event.pageY +10).toString()

        des_div.style.visibility = "visible"
      },
      true)
  }

  set_el_listener() {
    let id = this.id
    let btn = get_task_btn(id)
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

}


/**
 *
 * @param id {number}
 * @return {HTMLElement} div
 */

function get_task_div(id) {
  return document.getElementById("task_" + id)
}

function get_task_btn(id) {
  return document.getElementById("task_btn_" + id)
}

/**
 *
 * @param id
 * @return {HTMLElement} div
 */
function get_task_des_div(id) {
  return document.getElementById("task_des_" + id)
}

function setTaskOn(id) {
  let task = player.tasks[id - 1]
  if (task.unlocked) {
    task.activated = true
  }
  let div = document.getElementById("task_" + id)
  div.classList.remove('task-disabled')
  let btn = document.getElementById("task_btn_" + id)
  btn.classList.remove( 'btn-disabled')
  btn.onclick = function () {
    setTaskOff(id)
  }
}

/**
 *
 * @param {number} id
 */
function setTaskOff(id) {
  let task = player.tasks[id - 1]
  if (task.unlocked) {
    task.activated = false
  }
  let div = get_task_div(id)
  div.classList.add('task-disabled')
  let btn = document.getElementById("task_btn_" + id)
  btn.classList.add('tx-disabled', 'btn-disabled')
  btn.onclick = function () {
    setTaskOn(id)
  }
}

function update_tasks() {
  for (let i = 0; i < player.tasks.length; i++) {
    player.tasks[i].update()
  }
}

function putTaskDesDiv(id) {
  let task = player.tasks[id - 1]
  getBody().appendChild(task.des_div)
  return task.des_div
}

function displayTask() {
  for (let i = 0; i < player.tasks.length; i++) {
    let task = player.tasks[i]
    if (!task.displayed) {
      let task_list = document.getElementById('tasklist')
      task_list.appendChild(task.div)
      task.displayed = true
    }
  }
}

function insertDesDiv(des_div) {
  let body = document.getElementById('root').parentNode
  body.appendChild(des_div)
}

const tasks = [
  new Task(1, 'Solar power', 10, 'Get energy from the Sun',
    true, resources.energy, null, 0,
    true_func,
    `As we all know, solar power is a kind of green energy. That's important for developing in a green way.
      So anyway, doesn't Fn have any more special ideas instead of this?`),
  new Task(2, 'Air Filter', 1, 'As the wind blows, take a part of it.',
    false, resources.air, null, 0,
    function () {
      return player.resources.energy.amount >= 50
    },
    `Just an air cleaner indeed. So why does this machine has these usages? Maybe no reasons, that's for "Design" anyway.`
  ),
  new Task(3, 'Digger', 2, 'Dig-dug-dug, ____ the ground is dug.', false,
    resources.soil, resources.energy, 2, function () {
      return player.resources.air.amount >= 5
    },
    `How does this work? Anyway.`)

];
