import type { OnStart } from "@flamework/core";
import { Component, BaseComponent } from "@flamework/components";
import { ReplicatedFirst } from "@rbxts/services";
import { TweenInfoBuilder } from "@rbxts/builders";
import { Janitor } from "@rbxts/janitor";
import { trim } from "@rbxts/string-utils";

import { Events, Functions } from "client/network";
import { PlayerGui } from "shared/utilities/client";
import { tween } from "shared/utilities/ui";
import type { DataKey, GameDataModel } from "shared/data-models/generic";

type CodeReward = [number, DataKey];
type CodeList = Record<string, CodeReward>;

const { setData, incrementData } = Events;
const { getData } = Functions;

interface Attributes {
  StatusDebounce: boolean;
}

@Component({
  tag: "CodesPage",
  ancestorWhitelist: [ PlayerGui ]
})
export class CodesPage extends BaseComponent<Attributes, PlayerGui["Menu"]["Codes"]> implements OnStart {
  private readonly janitor = new Janitor;
  private readonly codes = <CodeList>require(ReplicatedFirst.CodeList);

  public onStart(): void {
    this.janitor.Add(this.instance.Main.Redeem.MouseButton1Click.Connect(() => {
      this.redeem();
    }));

    ReplicatedFirst.CodeList.Destroy();
  }

  private async redeem(): Promise<void> {
    const code = trim(this.instance.Main.TextBubble.Input.Text).lower();
    const reward = this.codes[code];
    if (!reward)
      return this.redeemFailed("Invalid code!");

    const redeemedCodes = <string[]>await getData("redeemedCodes");
    if (redeemedCodes.includes(code))
      return this.redeemFailed("Code has already been redeemed!");

    const [amount, key] = reward;
    this.pushStatus("Successfully redeemed code!");
    incrementData(<ExtractKeys<GameDataModel, number>>key, amount);

    redeemedCodes.push(code);
    setData("redeemedCodes", redeemedCodes);
  }

  private redeemFailed(message: string): void {
    this.pushStatus(message, true);
    const info = new TweenInfoBuilder()
      .SetTime(0.1)
      .SetReverses(true);

    tween(this.instance.Main.Redeem, info, {
      ImageColor3: Color3.fromRGB(225, 25, 25)
    });
  }

  private pushStatus(message: string, err?: boolean): void {
    if (this.attributes.StatusDebounce) return;
    this.attributes.StatusDebounce = true;

    const color = err ? Color3.fromRGB(255, 50, 50) : Color3.fromRGB(112, 219, 97);
    this.instance.Main.StatusMessage.Text = message;
    this.instance.Main.StatusMessage.TextColor3 = color;
    this.instance.Main.StatusMessage.Visible = true;
    task.delay(2.5, () => {
      this.instance.Main.StatusMessage.Visible = false;
      this.attributes.StatusDebounce = false;
    });
  }
}