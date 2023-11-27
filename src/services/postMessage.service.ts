import type { PostMessageBody } from '@/types/services.type'

export default async function postMessage(message: PostMessageBody) {
  try {
    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL
    const authToken = import.meta.env.VITE_AUTHORIZATION_TOKEN

    await fetch(apiBaseUrl, {
      method: 'POST',
      headers: {
        Authorization: authToken,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(message)
    })
  } catch (error) {
    console.error(error)
    return
  }
}
