/**
 * Sound is a separated from the coin entity so that you can
 * still hear it even when the coin is removed from the engine.
 */
// const coinPickupSound = new Entity()
// coinPickupSound.addComponent(new Transform())
// coinPickupSound.addComponent(
//   new AudioSource(new AudioClip('sounds/coinPickup.mp3'))
// )
// engine.addEntity(coinPickupSound)
// coinPickupSound.setParent(Attachable.AVATAR)

export class Door extends Entity {
  constructor(model: GLTFShape) {
    super()
    engine.addEntity(this)
    this.addComponent(model)
    this.addComponent(new Transform())

    this.addComponent(new Animator())
    this.getComponent(Animator).addClip(new AnimationState("Blank", { looping: false }))
    this.getComponent(Animator).addClip(new AnimationState("OpenDoor", { looping: false }))
    this.getComponent(Animator).getClip("Blank").play()
  }

  playDoorOpen() {
    this.getComponent(Animator).getClip("Blank").stop()
    this.getComponent(Animator).getClip("OpenDoor").stop()
    this.getComponent(Animator).getClip("OpenDoor").play()
    this.removeComponent(OnPointerDown)
  }
}
