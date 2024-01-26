import { Controller } from "@flamework/core";

@Controller()
export class ViewportCameraController {
  public createGeneric(fov = 65): Camera {
    const camera = new Instance("Camera");
    camera.CFrame = new CFrame(-3.185, 0.336, -2.104).mul(CFrame.fromOrientation(math.rad(-7.151), math.rad(-122.693), math.rad(0)));
    camera.Focus = new CFrame;
    camera.FieldOfView = fov;
    return camera;
  }
}