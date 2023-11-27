export default async function getAllMessages() {
  try {
    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL
    const authToken = import.meta.env.VITE_AUTHORIZATION_TOKEN

    const response = await fetch(apiBaseUrl, {
      headers: {
        Authorization: authToken,
        'Content-Type': 'application/json'
      }
    })

    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error)
    return
  }
}
