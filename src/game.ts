// NOTE: remember to add &ENABLE_WEB3 to the url when running locally
import * as EthereumController from "@decentraland/EthereumController"
import * as crypto from "@dcl/crypto-scene-utils"
import { Door } from "./door"
import { Sound } from "./sound"
import * as ui from "@dcl/ui-scene-utils"

// Config
let userAddress: string
const contractAddress = "0x6b47e7066c7db71aa04a1d5872496fe05c4c331f" // Contract for RTFKT x Atari wearables collection

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
      hoverText: "Enter Club",
      showFeedback: true,
    }
  )
)

let noSign = new ui.CenterImage("images/no-sign.png", 1, true, 0, 20, 128, 128, {
  sourceHeight: 512,
  sourceWidth: 512,
  sourceLeft: 0,
  sourceTop: 0,
})

// On load
executeTask(async () => {
  try {
    userAddress = await EthereumController.getUserAccount()
    log("User Address: ", userAddress)
  } catch (error) {
    log(error.toString())
  }
})

// Check player's wallet to see if they're holding any tokens relating to that contract address
async function checkTokens() {
  let balance = await crypto.currency.balance(contractAddress, userAddress)
  log("BALANCE: ", balance)

  if (Number(balance) > 0) {
    door.playDoorOpen()
    openDoorSound.getComponent(AudioSource).playOnce()
    jazzSound.getComponent(AudioSource).volume = 1.0
  } else {
    noSign.show(1)
    accessDeniedSound.getComponent(AudioSource).playOnce()
    jazzMuffledSound.getComponent(AudioSource).volume = 1.0
  }
}



