class GameUnit {
  /**
   *
   * @param type {string}
   * @param id {number}
   * @param name {string}
   * @param des {string}
   * @param itl {string}
   * @param res_related {Array<Resource, number>}
   */
  constructor(type, id, name, des, itl = "", ...res_related) {
    this.type = type
    this.id = id
    this.name = name
    this.des = des
    this.itl = itl
    this.produce = []
    this.cost = []
    for (let i = 0; i < res_related.length; i++) {
      let v = res_related[i]
      if (v[1] > 0) {this.produce.push(v)}
      if (v[1] <0 ) {this.cost.push(v)}
    }
  }

  init_div() {
    let div = document.createElement('div')
    div.innerHTML = `
      <button type="button" class="btn-disabled unit-r-btn" id="[type]_btn_[id]">[name]</button>
      `
      .replaceAll('[type]', this.type)
      .replaceAll('[id]', str(this.id))
      .replaceAll('[name]', this.name)
    div.classList.add("w-full", "lg:w-1/4")
    this.div = div
    return div
  }

  init_des_div() {
    let des_div = document.createElement('div')
    des_div.innerHTML = `
    <p>[des]</p>
    <p class="unit-itl">[itl]</p>
    `.replaceAll('[des]', this.des).replaceAll('[itl]', this.itl)
    des_div.classList.add('unit-des-div')
    des_div.id = ''

    this.des_div = des_div
    return des_div
  }

  get_res_related_html () {

  }
}