const task_list = new GameUnitContain("task")

class Task extends GameUnit {
  /**
   *
   * @param id {number}
   * @param name {string}
   * @param des {string}
   * @param itl {string}
   * @param res_related {Array[Resource, number]}
   * @param condition {function}
   */
  constructor(id, name, des, itl, condition = true_func, ...res_related) {
    super('task', id, name, des, itl, condition, ...res_related);
    this.name = name
    this.des = des
    this.activated = false
    this.itl = itl
    this.id = id

    task_list.append_unit(this)
  }

  /**
   * 每秒的自动update,产出或者检查是否满足解锁条件
   */
  update() {
    this.check_unlocked() // 检察unlocked
    this.check_displayed() // 检查能否display
    if (!this.activated) { //如果未激活
      return // 白嫖是吧
    }
    if (this.can_produce) { //如果东西够
      this.do_cost()
      this.do_produce()
    }
  }

  /**
   *
   * @param task {Task}
   */
  setOn(task) {
    if (!task.unlocked) {
      return
    }
    task.activated = true
    task.set_active()
    task.set_btn_onclick(function () {
      task.setOff(task)
    })
  }

  /**
   *
   * @param task {Task}
   */
  setOff(task) {
    if (!task.unlocked) {
      return
    }
    task.activated = false
    task.set_disabled()
    task.set_btn_onclick(function () {
      task.setOn(task)
    })
  }

  load(unlocked, activated) {
    this.unlocked = unlocked
    this.activated = activated
    this.set_btn_attr(activated)
    let task = this
    if (this.activated) {this.btn.onclick =() => {task.setOff(task)}}
    else {this.btn.onclick =() => {task.setOn(task)}}
  }
  save() {
    return [this.id,this.unlocked, this.activated]
  }

}

function update_tasks() {
  for (let i = 0; i < player.tasks.length; i++) {
    player.tasks[i].update()
  }
}


// const tasks = [
//   new Task(1, 'Solar power', 10, 'Get energy from the Sun',
//     true, resources.energy, null, 0,
//     true_func,
//     `As we all know, solar power is a kind of green energy. That's important for developing in a green way.
//       So anyway, doesn't Fn have any more special ideas instead of this?`),
//   new Task(2, 'Air Filter', 1, 'As the wind blows, take a part of it.',
//     false, resources.air, null, 0,
//     function () {
//       return player.resources.energy.amount >= 50
//     },
//     `Just an air cleaner indeed. So why does this machine has these usages? Maybe no reasons, that's for "Design" anyway.`
//   ),
//   new Task(3, 'Digger', 2, 'Dig-dug-dug, ____ the ground is dug.', false,
//     resources.soil, resources.energy, 2, function () {
//       return player.resources.air.amount >= 5
//     },
//     `How does this work? Anyway.`)
//
// ];
const tasks = [
  new Task(1, 'Solar Power', 'Generate energy from the Sun.',
    "As we all know, solar power is a kind of green energy. That's important for developing in a green way." +
    "So anyway, doesn't Fn have any more special ideas instead of this?", true_func, [res.energy, 10]),
  new Task(2, 'Air Filter', 'As the wind blows, take a part of it.',
    `Just an air cleaner indeed. So how does it work? Maybe (there's) no reason, and that's for "Design" anyway.`,
    () => (res.energy.amount >= 50), [res.air, 0.5], [res.energy, -1]),
  new Task(3, 'Digger', "Get soil in the original way: to dig by hand.",
    "Dig-dug-dug, then the ground is ___.", () => (res.air.amount >= 5),
    [res.soil, 1], [res.energy, -2])
]