import type { Data } from '../types/types'
import eventBus from './eventBus'

export class DataFetcher {
  private apiUrl: string

  constructor(apiUrl: string) {
    this.apiUrl = apiUrl
  }

  // Fetch data function
  async fetchData(): Promise<Data[] | null> {
    try {
      const response = await fetch(this.apiUrl)
      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`)
      }
      const data: Data[] = await response.json()
      return data
    } catch (error) {
      console.error('Fetch error:', error)
      return null
    }
  }

  async updateData(inputValue: number) {
    try {
      const data = {
        id: 0,
        time: '00:00',
        data: inputValue,
      }

      const response = await fetch(this.apiUrl, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (response.ok) {
        const result = await response.json()
        console.log('Data saved:', result)
        eventBus.emit('data-updated')
      } else {
        console.error('Failed to save data')
        alert('Failed to save data')
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Error occurred while saving data')
    }
  }
}
