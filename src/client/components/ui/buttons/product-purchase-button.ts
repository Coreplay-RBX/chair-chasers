import type { OnStart } from "@flamework/core";
import { Component, BaseComponent } from "@flamework/components";
import { MarketplaceService as Market } from "@rbxts/services";

import { Player, PlayerGui } from "shared/utilities/client";
import { Janitor } from "@rbxts/janitor";

interface Attributes {
  ProductID: number;
}

@Component({
  tag: "ProductPurchaseButton",
  ancestorWhitelist: [ PlayerGui ]
})
export class ProductPurchaseButton extends BaseComponent<Attributes, PlayerGui["Menu"]["NoteShop"]["Main"]["ImageButton"]> implements OnStart {
  private readonly janitor = new Janitor;

  public onStart(): void {
    const productInfo = Market.GetProductInfo(this.attributes.ProductID, Enum.InfoType.Product);
    this.janitor.Add(this.instance.MouseButton1Click.Connect(() => Market.PromptProductPurchase(Player, this.attributes.ProductID)));
    this.instance.Price.Text = `R$${productInfo.PriceInRobux}`;
    this.instance.Icon.Image = `rbxasasetid://${productInfo.IconImageAssetId}`;
  }
}