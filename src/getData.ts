import { IEvent } from './reducer'

const getData = (id: string) =>
  fetch(`https://danbock.net/uschess-proxy?${id}`)
    .then((r) => r.text())
    .then((t) => {
      const parser = new DOMParser()
      const doc = parser.parseFromString(t, 'text/html')
      const tables = doc.getElementsByTagName('table')
      const idAndName = tables[3].getElementsByTagName('b')[0].innerText
      const name = toUpperCamelCase(idAndName.split(':')[1].trim())
      const rows = Array.from(tables[6].getElementsByTagName('tr'))
      const headerRow = rows.findIndex((r) => r.innerHTML.includes('Event ID'))

      const events: IEvent[] = rows.slice(headerRow + 1).map((tr) => {
        const [dateAndId, eventAndSection, reg, quick, blitz] = Array.from(
          tr.getElementsByTagName('td'),
        )

        return {
          info: {
            date: getUpperRow(dateAndId.innerHTML),
            id: getSmallText(dateAndId.innerHTML),
            name: eventAndSection.innerHTML.substring(
              eventAndSection.innerHTML.indexOf('>') + 1,
              eventAndSection.innerHTML.indexOf('<', 1),
            ),
          },
          performances: [
            {
              id,
              name,
              section: getSmallText(eventAndSection.innerHTML),
              reg: reg.innerText.trim(),
              quick: quick.innerText.trim(),
              blitz: blitz.innerText.trim(),
            },
          ],
        }
      })

      return { name, events }
    })

const getUpperRow = (html: string) => html.substring(0, html.indexOf('<br>'))
const getSmallText = (html: string) =>
  html.substring(html.indexOf('<small>') + 7, html.indexOf('</small>')).trim()

const toUpperCamelCase = (s: string) =>
  s
    .split(' ')
    .map((w) => w[0].toUpperCase() + w.slice(1).toLowerCase())
    .join(' ')

export default getData
