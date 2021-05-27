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
