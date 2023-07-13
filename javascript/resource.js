class Resource {

  constructor(name, amount, maximum, delta) {
    this.name = name
    this.maximum = maximum
    this.delta = delta
    this.related_research = []
    this._amount = amount
  }

  get amount() {
    return this._amount;
  }

  /**
   *
   * @param value {number}
   */
  produce(value) {
    let v = value
    for (let i=0; i<this.related_research.length; i++) {
      if (this.related_research[i][0].finished) {
        v *= this.related_research[i][1]
      }
    }
    this._amount += v
  }

  /**
   *
   * @param value {number}
   */
  cost(value) {
    let v = abs(value)
    this._amount -= v
  }


  /**
   *
   * @param research {Research}
   * @param percent {number}
   */
  register_research(research, percent) {
    this.related_research.push([research, percent])
  }


}


function getPrev() {
  return {
    energy: res.energy.amount,
    air: res.air.amount,
    iron: res.iron.amount,
    copper: res.copper.amount,
    soil: res.soil.amount,
    water: res.water.amount,
  }
}

function calcDelta(prev) {
  player.res.energy.delta = player.res.energy.amount - prev.energy
  player.res.air.delta = player.res.air.amount - prev.air
  player.res.iron.delta = player.res.iron.amount - prev.iron
  player.res.copper.delta = player.res.copper.amount - prev.copper
  player.res.soil.delta = player.res.soil.amount - prev.soil
  player.res.water.delta = player.res.water.amount - prev.water
}

function formatDelta(key, element) {
  if (player.res[key].delta > 0) {
    element.innerHTML = allReplace("+{v}/s", "{v}", formatValue(player.res[key].delta))
  }
  if (player.res[key].delta === 0) {
    element.innerHTML = "-/s"

  }
  if (player.res[key].delta < 0) {
    element.innerHTML = allReplace("{v}/s", "{v}", formatValue(player.res[key].delta))

  }
}

function formatAmount(key, element) {
  let context = String("{amount}/{max}");
  context = allReplace(context, "{amount}", formatValue(player.res[key].amount))
  context = allReplace(context, "{max}", formatValue(player.res[key].maximum))
  element.innerHTML = context
}

function displayResource() {
  const keys = Object.keys(player.res);
  for (let i = 0; i < keys.length; i++) {
    let key = keys[i];
    let amount = document.getElementById(allReplace("{id}_amount", '{id}', key))
    let delta = document.getElementById(allReplace("{id}_delta", '{id}', key))
    formatAmount(key, amount)
    formatDelta(key, delta)

  }
}

const res = {
  energy: new Resource('Energy', 0, 1e4, 0),
  iron: new Resource('Iron', 0, 3e2, 0),
  copper: new Resource('Copper', 0, 3e2, 0),
  soil: new Resource('Soil', 0, 3e2, 0),
  water: new Resource('Water', 0, 3e2, 0),
  air: new Resource('Air', 0, 3e2, 0),
}