// This is going to be the Jazz Club example
// NOTE: remember to add &ENABLE_WEB3 to the url when running locally
import * as EthereumController from "@decentraland/EthereumController"
import * as crypto from "@dcl/crypto-scene-utils"

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

export async function checkTokens() {
  let balance = await crypto.currency.balance(contractAddress, userAddress)
  log("BALANCE: ", balance)

  Number(balance) > 0? log("Let Player In") : log("Refuse Player Entry")
}

// Button
const box = new Entity()
box.addComponent(new BoxShape())
box.addComponent(new Transform({ position: new Vector3(8, 1, 8) }))
box.addComponent(
  new OnPointerDown(
    () => {
      checkTokens()
    },
    {
      showFeedback: true,
      hoverText: "Check Tokens",
    }
  )
)

engine.addEntity(box)
