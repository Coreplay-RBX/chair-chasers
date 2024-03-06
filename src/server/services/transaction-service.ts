import { Service, type OnInit } from "@flamework/core";
import { Players, MarketplaceService as Market } from "@rbxts/services";
// import Object from "@rbxts/object-utils";

import DevProduct from "shared/structs/dev-products";

import type { DataService } from "./data-service";
import type { ServerSettingsService } from "./server-settings-service";
import type { GameService } from "./game-service";


@Service()
export class TransactionService implements OnInit {
  private readonly rewardHandlers: Record<number, (player: Player, productName: string) => void> = {
    [DevProduct.GetBackIn]: player => {
      const conn = this._game.roundEnded.Connect(() => {
        if (this._game.playersInGame.includes(player)) return;

        conn.Disconnect();
        this._game.teleportPlayerToMap(player);
        this._game.addPlayer(player);
      });
    },
    [DevProduct.Notes1]: (player, productName) => this.addNotes(player, productName),
    [DevProduct.Notes2]: (player, productName) => this.addNotes(player, productName),
    [DevProduct.Notes3]: (player, productName) => this.addNotes(player, productName),
    [DevProduct.Notes4]: (player, productName) => this.addNotes(player, productName),
    [DevProduct.Notes5]: (player, productName) => this.addNotes(player, productName),
    [DevProduct.Notes6]: (player, productName) => this.addNotes(player, productName),
    [DevProduct.Notes7]: (player, productName) => this.addNotes(player, productName)
  }

  public constructor(
    private readonly data: DataService,
    private readonly serverSettings: ServerSettingsService,
    private readonly _game: GameService,
    // private readonly purchaseAnalytics: PurchaseAnalyticsService
  ) {}

  public onInit(): void {
    Market.ProcessReceipt = ({ PlayerId, ProductId, PurchaseId }) => {
      const productKey = `${PlayerId}_${PurchaseId}`;
      const purchaseHistory = this.data.get<string[]>(Players.GetPlayerByUserId(PlayerId)!, "purchaseHistory");
      const alreadyPurchased = purchaseHistory.includes(productKey);
      if (alreadyPurchased)
        return Enum.ProductPurchaseDecision.PurchaseGranted;

      const player = Players.GetPlayerByUserId(PlayerId);
      let purchaseRecorded: Maybe<boolean> = !player ? undefined : true;
      let success = true;
      try {
        const grantReward = this.rewardHandlers[ProductId];
        if (player) {
          // const isDevProduct = Object.values(DevProduct).includes(ProductId);
          // const productType = isDevProduct ? ProductType.DevProduct : ProductType.Gamepass;
          // this.purchaseAnalytics.trackPurchase(player, ProductId, productType);
          if (grantReward)
            grantReward(player, DevProduct[ProductId]);
        }
      } catch (e) {
        success = false;
        purchaseRecorded = undefined;
        warn(`Failed to process purchase for product ${ProductId}: ${e}`);
      }

      return (!success || purchaseRecorded === undefined) ? Enum.ProductPurchaseDecision.NotProcessedYet : Enum.ProductPurchaseDecision.PurchaseGranted;
    }
  }

  private addNotes(player: Player, productName: string): void {
    this.data.increment(player, "notes", this.serverSettings.getNoteAmount(productName));
  }
}