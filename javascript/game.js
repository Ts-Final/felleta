const player = {
  resources: resources,
  tasks: tasks,
  researches: researches,
};

// ----------------------------------------------------------------
// function definitions

function updatePerSecond() {
  let prev = getPrev()
  update_tasks()
  displayTask()
  update_research()
  displayResearch()
  calcDelta(prev)
  displayResource()
}

setInterval(updatePerSecond, 1000)

function load() {
  setVisibleLayout('tasklist')
  displayTask()
  displayResearch()
  for (let i=0; i<player.tasks.length; i++) {
    let task = player.tasks[i]
    task.set_ee_listener()
    task.set_el_listener()
  }
  for (let i=0; i<player.researches.length;i++) {
    let research = player.researches[i]
    research.set_ee_listener()
    research.set_el_listener()
  }
}

setTimeout(load, 500)