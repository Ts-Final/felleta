/**
 * 必须在 const player 后调用，否则失效
 */
function load() {
  if (player === undefined) {
    throw new ReferenceError("player is not defined. 检察这鸟东西是不是还没const就调用了")
  }
  let save = JSON.parse(localStorage.getItem("felleta"))
  if (save) {
    let tasks = save.tasks
    for (let i=0; i<tasks.length; i++) {
      task_list.units[i].load(i, tasks[i][1], tasks[i][2])
    }
    let researches = save.researches
    for (let i=0; i<researches.length; i++) {
      research_list.units[i].load(researches[i][0], researches[i][1], researches[i][2])
    }
  }
  else {
    for (let i=0; i<task_list.units.length; i++) {
      let task = task_list.units[i]
      task.load(false, false)
    }
  }
  setVisibleLayout('task-list')
  gerMainContent().appendChild(wrapper)
}

function save() {
  let save = {
    tasks: task_list.save(),
    researches: research_list.save()
  }
  localStorage.setItem("felleta", JSON.stringify(save))
}

setInterval(save, 30*1000)

function hard_reset() {
  let result = confirm("Are you really want to reset your game?")
  if (!result) {return}
  localStorage.removeItem("felleta")
}