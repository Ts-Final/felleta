class Resource {
  constructor(name, amount, maximum, delta) {
    this.name = name
    this.maximum = maximum
    this.delta = delta
    this.related_research = []
    this._amount = amount;
  }

  get amount() {
    return this._amount;
  }

  set amount(value) {
    if (value > 0) {
      this.add(value)
    }
    if (value < 0) {
      this.amount -= value
    }
  }

  add(value) {
    let v = value
    this._amount += v
  }


  /**
   *
   * @param research {Research}
   */
  register_research (research) {
    this.related_research.push(research)
  }


}


function getPrev() {
  return {
    energy: resources.energy.amount,
    air: resources.air.amount,
    iron: resources.iron.amount,
    copper: resources.copper.amount,
    soil: resources.soil.amount,
    water: resources.water.amount,
  }
}

function calcDelta(prev) {
  player.resources.energy.delta = player.resources.energy.amount - prev.energy
  player.resources.air.delta = player.resources.air.amount - prev.air
  player.resources.iron.delta = player.resources.iron.amount - prev.iron
  player.resources.copper.delta = player.resources.copper.amount - prev.copper
  player.resources.soil.delta = player.resources.soil.amount - prev.soil
  player.resources.water.delta = player.resources.water.amount - prev.water
}

function formatDelta(key, element) {
  if (player.resources[key].delta > 0) {
    element.innerHTML = allReplace("+{v}/s", "{v}", formatValue(player.resources[key].delta))
  }
  if (player.resources[key].delta === 0) {
    element.innerHTML = "-/s"

  }
  if (player.resources[key].delta < 0) {
    element.innerHTML = allReplace("{v}/s", "{v}", formatValue(player.resources[key].delta))

  }
}

function formatAmount(key, element) {
  let context = String("{amount}/{max}");
  context = allReplace(context, "{amount}", formatValue(player.resources[key].amount))
  context = allReplace(context, "{max}", formatValue(player.resources[key].maximum))
  element.innerHTML = context
}

function displayResource() {
  const keys = Object.keys(player.resources);
  for (let i = 0; i < keys.length; i++) {
    let key = keys[i];
    let amount = document.getElementById(allReplace("{id}_amount", '{id}', key))
    let delta = document.getElementById(allReplace("{id}_delta", '{id}', key))
    formatAmount(key, amount)
    formatDelta(key, delta)

  }
}

const resources = {
  energy: new Resource('Energy', 0, 1e4, 0),
  iron: new Resource('Iron', 0, 3e2, 0),
  copper: new Resource('Copper', 0, 3e2, 0),
  soil: new Resource('Soil', 0, 3e2, 0),
  water: new Resource('Water', 0, 3e2, 0),
  air: new Resource('Air', 0, 3e2, 0),
}