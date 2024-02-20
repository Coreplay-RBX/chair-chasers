import { Controller, type OnInit, type OnTick } from "@flamework/core";
import { Workspace as World } from "@rbxts/services";
import Signal from "@rbxts/signal";

const CAMERA_HEIGHT = 8;
const CAMERA_DIST = 5;
const CAMERA_ANGLE = 40;

const { rad } = math;

@Controller()
export class SpectationController implements OnInit, OnTick {
  public readonly started = new Signal;
  public readonly stopped = new Signal;

  private readonly camera = new Instance("Camera");
  private readonly defaultCamera = World.CurrentCamera!;
  private isSpectating = false;

  public onInit(): void {
    this.camera.CameraType = Enum.CameraType.Scriptable;
    this.camera.Parent = World;
  }

  public onTick(): void {
    if (!this.camera.CameraSubject) return;

    const subject = <BasePart>this.camera.CameraSubject;
    this.camera.Focus = subject.CFrame;
    this.camera.CFrame = subject.CFrame
      .add(new Vector3(0, CAMERA_HEIGHT, 0))
      .sub(subject.CFrame.LookVector.mul(CAMERA_DIST))
      .mul(CFrame.Angles(-rad(CAMERA_ANGLE), 0, 0));
  }

  public spectate(player: Player): void {
    if (this.isSpectating) return;

    World.CurrentCamera = this.camera;
    this.camera.CameraSubject = player.Character!.PrimaryPart!;
    this.isSpectating = true;
    this.started.Fire();
  }

  public swap(player: Player): void {
    if (!this.isSpectating) return;
    this.camera.CameraSubject = player.Character!.PrimaryPart!;
  }

  public stop(): void {
    if (!this.isSpectating) return;

    World.CurrentCamera = this.defaultCamera;
    this.camera.CameraSubject = undefined;
    this.isSpectating = false;
    this.stopped.Fire();
  }
}