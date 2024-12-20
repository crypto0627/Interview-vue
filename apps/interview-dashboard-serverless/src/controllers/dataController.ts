import { validTimes, isValidTime, initializeData } from '../models/dataModel'

export async function initData(c: any): Promise<any> {
  await initializeData(c.env.DASHBOARD_KV)
  return c.json({ message: 'Data initialized successfully.' })
}

export async function getData(c: any): Promise<any> {
  const data = await c.env.DASHBOARD_KV.get('data')
  return c.json(data ? JSON.parse(data) : [])
}

export async function postData(c: any): Promise<any> {
  const body = await c.req.json()
  if (!body.time || body.data === undefined) {
    return c.json({ message: 'Invalid payload' }, 400)
  }
  if (!isValidTime(body.time)) {
    return c.json({ message: `Invalid time. Must be one of: ${validTimes.join(', ')}` }, 400)
  }

  const [hour] = body.time.split(':').map(Number)
  const isNegative = hour >= 16 && hour < 20
  if (isNegative && body.data >= 0) {
    return c.json({ message: 'Data must be negative between 16:00 and 20:00' }, 400)
  }
  if (body.data < -1064 || body.data > 1200) {
    return c.json({ message: 'Data out of range (-1064 to 1200)' }, 400)
  }

  const kv = c.env.DASHBOARD_KV
  const data = JSON.parse((await kv.get('data')) || '[]')
  const id = data.length
  const newRecord = { id, time: body.time, data: body.data }
  data.push(newRecord)
  await kv.put('data', JSON.stringify(data))
  return c.json(newRecord, 201)
}

export async function putData(c: any): Promise<any> {
  const id = parseInt(c.req.param('id'))
  const body = await c.req.json()
  const kv = c.env.DASHBOARD_KV
  const data = JSON.parse((await kv.get('data')) || '[]')
  const record = data.find((item: any) => item.id === id)

  if (!record) {
    return c.json({ message: 'Record not found' }, 404)
  }

  const newTime = body.time || record.time
  const newData = body.data !== undefined ? body.data : record.data

  if (!isValidTime(newTime)) {
    return c.json({ message: `Invalid time. Must be one of: ${validTimes.join(', ')}` }, 400)
  }

  const [hour] = newTime.split(':').map(Number)
  const isNegative = hour >= 16 && hour < 20
  if (isNegative && newData >= 0) {
    return c.json({ message: 'Data must be negative between 16:00 and 20:00' }, 400)
  }
  if (newData < -1064 || newData > 1200) {
    return c.json({ message: 'Data out of range (-1064 to 1200)' }, 400)
  }

  record.time = newTime
  record.data = newData
  await kv.put('data', JSON.stringify(data))
  return c.json(record)
}

export async function deleteData(c: any): Promise<any> {
  const id = parseInt(c.req.param('id'))
  const kv = c.env.DASHBOARD_KV
  const data = JSON.parse((await kv.get('data')) || '[]')
  const index = data.findIndex((item: any) => item.id === id)

  if (index === -1) {
    return c.json({ message: 'Record not found' }, 404)
  }
  const deleted = data.splice(index, 1)
  await kv.put('data', JSON.stringify(data))
  return c.json(deleted[0])
}
