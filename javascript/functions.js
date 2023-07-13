function true_func() {
  return true
}

/**
 * @param {string} str 你说呢
 * @param {string} target 被替换的东西
 * @param {*} replacement 要替换的东西
 */
function allReplace(str, target, replacement) {
  if (replacement instanceof Number) {
    replacement = replacement.toExponential(2)
  }
  while (str.includes(target)) {
    str = str.replace(target, replacement)
  }
  return str
}

function formatValue(value, places = 0) {
  if (value >= 1e7) {
    return value.toExponential(places).replace('+', '')
  } else {
    return value.toFixed(places)
  }
}

function getBody() {
  return document.getElementById('body')
}

function str(v) {
  return String(v)
}

function translateX(length) {
  return "translateX(" + length + ") "
}

function translateY(length) {
  return "translateY(" + length + ") "
}

function translate(lx, ly) {
  return "translate(" + lx + "px," + ly + "px)"
}
/**
 * @param btn {HTMLElement}
 * @param des_div {HTMLElement}*/
function getDesDivTransform(btn, des_div) {
  let x = btn.getBoundingClientRect().x
  let y = btn.getBoundingClientRect().y
  let w = btn.getBoundingClientRect().width
  let h = btn.getBoundingClientRect().height
  let dw = des_div.getBoundingClientRect().width
  des_div.style.transform = translate(x+0.5*w-0.5*dw, y+h+10)
}

/**
 *
 * @param id {string}
 */
function setVisibleLayout (id) {
  let tasklist = task_list.div
  let research = research_list.div
  let story = story_list.div

  tasklist.style.display = 'none'
  research.style.display = 'none'
  story.style.display = 'none'

  if (id ==='task-list')  {tasklist.style.display = ""; }
  if (id === 'research-list') {research.style.display = ""; }
  if (id === 'story-list')    {story   .style.display = ""; }
}

function createDiv() {
  return document.createElement('div')
}

function createP(text="") {
  let p = document.createElement('p')
  p.innerText = text
  return p
}

function getRoot() {
  return document.getElementById('root')
}

function gerMainContent () {
  return document.getElementById('main-content')
}

/**
 * 绝对值
 * @param num {number}
 * @return {number}
 */
function abs(num) {
  if (num < 0) {return -num}
  else {return num}
}