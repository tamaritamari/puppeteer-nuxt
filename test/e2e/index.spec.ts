import { toMatchImageSnapshot } from 'jest-image-snapshot'
import {launch} from 'puppeteer'

expect.extend({ toMatchImageSnapshot })

describe('Index page', () => {
  let page
  let browser

  beforeAll(async () => {
    jest.setTimeout(50000)
    browser = await launch();
    page = await browser.newPage()
    await page.goto('http://127.0.0.1:3000')
  })

  afterAll(async () => {
    await page.close()
    await browser.close();
  })

  it('Display catch copy ', async () => {
    const text = await page.evaluate(() => document.body.textContent)

    await expect(text).toContain('this is top page')

    const screenshot = await page.screenshot()
    expect(screenshot).toMatchImageSnapshot()
  })
})
