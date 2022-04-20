// NOTE: remember to add &ENABLE_WEB3 to the url when running locally
import * as EthereumController from "@decentraland/EthereumController"
import * as crypto from "@dcl/crypto-scene-utils"
import { Door } from "./door"
import { Sound } from "./sound"
import * as ui from "@dcl/ui-scene-utils"
import * as Players from "@decentraland/Players"
import { getUserData, UserData } from '@decentraland/Identity'
import { signGuestBook, getGuestBook, updateSignatureTime, getGuest } from './serverHandler'

// Config
let userAddress: string

export const fireBaseServer =
  'https://us-central1-dcl-guestbook0.cloudfunctions.net/app/'


// Example token from the contract: https://opensea.io/assets/0x6b47e7066c7db71aa04a1d5872496fe05c4c331f/2
// Contract address on Etherscan: https://etherscan.io/address/0x6b47e7066c7db71aa04a1d5872496fe05c4c331f
//const contractAddress = "0x5CC5B05a8A13E3fBDB0BB9FcCd98D38e50F90c38" // SANDBOX LAND
//const contractAddress = "0x4da3978b45A3A7d931c93F543D2492bD1ba675BF" // SAMSUNG 837X - 8 
const contractAddress = "0x3845badAde8e6dFF049820680d1F14bD3903a5d0" // SAND 

// Sounds
const openDoorSound = new Sound(new AudioClip("sounds/openDoor.mp3"), false)
const accessDeniedSound = new Sound(new AudioClip("sounds/accessDenied.mp3"), false)

// Music
const jazzMuffledSound = new Sound(new AudioClip("sounds/jazzMuffled.mp3"), true, true)
const jazzSound = new Sound(new AudioClip("sounds/jazz.mp3"), true, true)
jazzSound.getComponent(AudioSource).volume = 0.0

// Base
const base = new Entity()
base.addComponent(new GLTFShape("models/baseDarkWithCollider.glb"))
engine.addEntity(base)

// Facade
const facade = new Entity()
facade.addComponent(new GLTFShape("models/facade.glb"))
facade.addComponent(new Transform({ position: new Vector3(8, 0.05, 10) }))
facade.getComponent(Transform).rotate(Vector3.Up(), 180)
engine.addEntity(facade)



// Door
const door = new Door(new GLTFShape("models/door.glb"))
door.setParent(facade)
door.addComponent(
  new OnPointerDown(
    () => {
      
      checkTokens()
    },
    {
      button: ActionButton.PRIMARY,
      hoverText: "Enter club",
      showFeedback: true,
    }
  )
)

// On load
executeTask(async () => {
  try {
    userAddress = await EthereumController.getUserAccount()
    // get user id
    //signGuestBook()

    log("User Address: ", userAddress)
  } catch (error) {
    log("PUPUPU")
  }
})

// UI
let noSign = new ui.CenterImage("images/no-sign.png", 1, true, 0, 20, 128, 128, {
  sourceHeight: 512,
  sourceWidth: 512,
  sourceLeft: 0,
  sourceTop: 0,
})



// Check player's wallet to see if they're holding any tokens relating to that contract address
async function checkTokens() {
  
  let balance = await crypto.currency.balance(contractAddress, userAddress)
  log("BALANCE: ", balance)

  if (Number(balance) > 0) {
    door.playDoorOpen()
    openDoorSound.getComponent(AudioSource).playOnce()
    jazzSound.getComponent(AudioSource).volume = 1.0
    updateSignatureTime() // deneme
  } else {
    noSign.show(1)
    accessDeniedSound.getComponent(AudioSource).playOnce()
    jazzMuffledSound.getComponent(AudioSource).volume = 1.0
  }
}



