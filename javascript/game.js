let player = {
  res: res,
  tasks: tasks,
  researches: researches,
};

// ----------------------------------------------------------------
// function definitions

function updatePerSecond() {
  let prev = getPrev()
  task_list.update()
  research_list.update()
  calcDelta(prev)
  displayResource()
}

setInterval(updatePerSecond, 1000)


load()