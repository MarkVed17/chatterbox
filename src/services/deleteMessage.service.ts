export default async function deleteMessage(messageId: number) {
  try {
    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL
    const authToken = import.meta.env.VITE_AUTHORIZATION_TOKEN

    await fetch(`${apiBaseUrl}${messageId}`, {
      method: 'DELETE',
      headers: {
        Authorization: authToken,
        'Content-Type': 'application/json'
      }
    })
  } catch (error) {
    console.error(error);
    return;
  }
}
