import { getUserData, UserData } from '@decentraland/Identity'

// get player data
export let userData: UserData

export async function setUserData() {
  const data = await getUserData()
  log(data.displayName)
  userData = data
}

// external servers being used by the project - Please change these to your own if working on something else!
export const fireBaseServer =
  'https://us-central1-dcl-guestbook0.cloudfunctions.net/app/'

// get latest scoreboard data from server
export async function getGuestBook() {
  try {
    const url = fireBaseServer + 'get-signatures'
    const response = await fetch(url)
    const json = await response.json()
    log(json)
    return json
  } catch (e) {
    log('error fetching scores from server ', e)
  }
}

// change data in scoreboard
export async function signGuestBook() {
  if (!userData) {
    await setUserData()
  }
  try {
    const url = fireBaseServer + 'add-signature'
    const body = JSON.stringify({
      id: (await userData).userId,
      name: (await userData).displayName
    })
    log(body)
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: body
    })
    return response.json()
  } catch (e) {
    log('error posting to server ', e)
  }
}
