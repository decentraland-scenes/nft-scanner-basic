// NOTE: remember to add &ENABLE_WEB3 to the url when running locally
import * as EthereumController from "@decentraland/EthereumController"
import * as crypto from "@dcl/crypto-scene-utils"
import { Door } from "./door"

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
      hoverText: "Open Door",
      showFeedback: true,
    }
  )
)
// Config
let userAddress: string
const contractAddress = "0x6b47e7066c7db71aa04a1d5872496fe05c4c331f" // Contract for RTFKT x Atari wearables collection

// On load
executeTask(async () => {
  try {
    userAddress = await EthereumController.getUserAccount()
    log("User Address: ", userAddress)
  } catch (error) {
    log(error.toString())
  }
})

async function checkTokens() {
  let balance = await crypto.currency.balance(contractAddress, userAddress)
  log("BALANCE: ", balance)

  Number(balance) > 0 ? door.playDoorOpen() : log("Refuse Player Entry")
}
