export function generateValidTimes(): string[] {
  const times: string[] = []
  for (let hour = 0; hour < 24; hour++) {
    for (let minute = 0; minute < 60; minute += 15) {
      const time = `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`
      times.push(time)
    }
  }
  return times
}

export const validTimes = generateValidTimes()

export function isValidTime(time: string): boolean {
  return validTimes.includes(time)
}

export async function initializeData(kv: KVNamespace): Promise<void> {
  const data: { id: number; time: string; data: number }[] = []
  let id = 0
  for (const time of validTimes) {
    const [hour] = time.split(':').map(Number)

    let value = 0
    if (hour >= 0 && hour < 16) {
      value = Math.floor(Math.random() * 1200)
    } else if (hour >= 20 && hour < 24) {
      value = Math.floor(Math.random() * 1200)
    } else {
      value = -Math.floor(Math.random() * 1065)
    }

    data.push({
      id: id++,
      time,
      data: value,
    })
  }
  await kv.put('data', JSON.stringify(data))
}
