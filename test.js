const Nightmare = require('nightmare')
const nightmare = Nightmare(
  { 
  show: true,
  openDevTools:{
    mode:'undocked'
  } 
}
)

nightmare
.viewport(1920, 1080)
  .goto('https://www.gregorys.gr/')
  .click('body > div.wrp > header > div.headerWrp > div.menu.test > ul > li:nth-child(2) > a.button.openModal.loginModalButton')
  .wait('#Email')
  .type('#Email', 'vlmavraganis@hotmail.com')
  .wait('#Password')
  .type('#Password', 'Vlasis.11')
  .click('#loginFormbtn')
  .wait("body > div.wrp > header > div.headerWrp > div.menu.test > ul > li:nth-child(2) > div.select.inl > div.trigger.ajax")
  .click("body > div.wrp > header > div.megaNav > div:nth-child(2) > div.navClm > nav:nth-child(3) > ul > li:nth-child(2) > a")
  .wait("body > div.wrp > div.outer > main > section > div.main > div > div:nth-child(2) > div.addTo.green > input")
  .click("body > div.wrp > div.outer > main > section > div.main > div > div:nth-child(2) > div.addTo.green > input")
  .wait("#optionsContent > div > div.options.sliding > div:nth-child(3) > div.title")
  .click("#optionsContent > div > div.options.sliding > div:nth-child(3) > div.title")
  .click("#attr_1384")
  .wait("#optionsContent > div > div.options.sliding > div:nth-child(3) > div.cnt > div > div.rangeWrp.groupSlider_out_230.thisSlider_out_1384 > div.labels > label:nth-child(2) > span")
  .click("#optionsContent > div > div.options.sliding > div:nth-child(3) > div.cnt > div > div.rangeWrp.groupSlider_out_230.thisSlider_out_1384 > div.labels > label:nth-child(2) > span")
  .click("#optionsContent > div > div.btmAct > div.right > div.addTo.addToOptions > input")
  .wait("body > div.wrp > div.outer > main > section > div.cartAutoOut > div > div.total > div.submit > input[type=button]")
  .wait("body > div.wrp > header > div.megaNav > div:nth-child(2) > div.navClm > nav:nth-child(15) > ul > li:nth-child(2) > a")
  .click("body > div.wrp > header > div.megaNav > div:nth-child(2) > div.navClm > nav:nth-child(15) > ul > li:nth-child(2) > a")
  .wait("body > div.wrp > div.outer > main > section > div.main > div > div:nth-child(2) > div.addTo.green > input")
  .click("body > div.wrp > div.outer > main > section > div.main > div > div:nth-child(2) > div.addTo.green > input")
  .wait("body > div.wrp > div.outer > main > section > div.cartAutoOut > div > div.total > div.submit > input[type=button]")
  .click("body > div.wrp > div.outer > main > section > div.cartAutoOut > div > div.total > div.submit > input[type=button]")
  .wait("body > div.wrp.fixedHeader > div.outer > form > main > section > div > div > div.checkout_container > div.right > div > div.cartAutoOut > div > input[type=submit]")
  .click("body > div.wrp.fixedHeader > div.outer > form > main > section > div > div > div.checkout_container > div.right > div > div.cartAutoOut > div > input[type=submit]")
  // .wait("#options > div.modal.product.prDetail")
  // .wait("#attr_1384")
  // .click("#attr_1384")
  // .wait("body > div.wrp.fixedHeader > div.outer > main > section > div.main > div > div:nth-child(2) > div.addTo.green > input")
  // .click("body > div.wrp.fixedHeader > div.outer > main > section > div.main > div > div:nth-child(2) > div.addTo.green > input")
  // .click("body > div.wrp > header > div.megaNav > div:nth-child(2) > div.navClm > nav:nth-child(15) > ul > li:nth-child(2) > a")

  // .click('#search_button_homepage')
  // .wait('#r1-0 a.result__a')
  // .evaluate(() => document.querySelector('#r1-0 a.result__a').href)
  // .end()
  .then(console.log)
  .catch(error => {
    console.error('Search failed:', error)
  })