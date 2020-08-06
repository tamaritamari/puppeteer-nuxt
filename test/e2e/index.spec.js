describe('Index page', () => {
  let page

  beforeAll(async () => {
    jest.setTimeout(50000)
    // eslint-disable-next-line no-undef
    page = await browser.newPage()
    await page.goto('http://127.0.0.1:3000')
  })

  afterAll(async () => {
    await page.close()
  })

  it('Display catch copy ', async () => {
    const text = await page.evaluate(() => document.body.textContent)

    await expect(text).toContain('トップページです')
  })
})
