// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import puppeteer from 'puppeteer-core'

type Json = {
  message: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Json | Buffer>
) {
  const { searchParams } = new URL(
    req.url as string,
    `http://${req.headers.host}`
  )
  const url = searchParams.get('url')

  if (!url) {
    return res
      .status(400)
      .json({ message: `A ?url query-parameter is required` })
  }

  const browser = await puppeteer.connect({
    browserWSEndpoint: `wss://chrome.browserless.io?token=c2b0eb6c-1996-4d2d-9d4a-96a8210760a9`,
  })

  const page = await browser.newPage()
  await page.setViewport({ width: 1920, height: 1080 })
  await page.goto('https://mehrdad2003.github.io/testy/1.html')

  return res.status(200).send(await page.pdf())
}
