import { OnInit, Service } from "@flamework/core";
import { DataStoreService } from "@rbxts/services"
import DataStore2 from "@rbxts/datastore2";

import type { OnPlayerJoin } from "server/hooks";
import { Events, Functions } from "server/network";

import { type DataKey, type DataValue, DataKeys } from "shared/data-models/generic";
import type EquippedItems from "shared/data-models/equipped-items";
import type Inventory from "shared/data-models/inventory";
import type EarningsHistory from "shared/data-models/earnings-history";
import Log from "shared/logger";

const { initializeData, setData, incrementData, dataUpdate } = Events;
const { getData } = Functions;

// if you ever wanna wipe all data, just change the keyID
// you can also use it to separate test databases and production databases
const DATA_SCOPE = "PROD";

@Service()
export class DataService implements OnInit, OnPlayerJoin {
	private readonly trackingDataStore = DataStoreService.GetOrderedDataStore("Tracking", DATA_SCOPE);

	public onInit(): void {
		DataStore2.Combine("DATA", ...DataKeys);
		initializeData.connect((player) => this.setup(player));
		setData.connect((player, key, value) => this.set(player, key, value));
		incrementData.connect((player, key, amount) => this.increment(player, key, amount))
		getData.setCallback((player, key) => this.get(player, key));
	}

	public onPlayerJoin(player: Player): void {
		// this.trackingDataStore.SetAsync(tostring(player.UserId), 0);
	}

	public getStoredUserIDs(amount: number): number[] {
		const keyPages = this.trackingDataStore.GetSortedAsync(false, amount);
		const keys: string[] = [];
		while (true) {
			for (const key of keyPages.GetCurrentPage().map(page => page.key))
				keys.push(key);

			if (keyPages.IsFinished) break;
			keyPages.AdvanceToNextPageAsync();
		}
		return keys.map(k => tonumber(k)!);
	}

	public increment(player: Player, key: DataKey, amount = 1): void {
		const value = this.get<number>(player, key);
		this.set(player, key, value + amount);
	}

	public get<T extends DataValue = DataValue>(player: Player, key: DataKey): T {
		return this.getStore<T>(player, key).Get()!;
	}

	public set<T extends DataValue = DataValue>(player: Player, key: DataKey, value: T): void {
		this.getStore<T>(player, key).Set(value);
	}

	private setup(player: Player): void {
    this.initialize(player, "notes", 0);
		this.initialize(player, "wins", 0);
		this.initialize(player, "redeemedCodes", []);
		this.initialize<EarningsHistory[]>(player, "earningsHistory", []);
		this.initialize<Inventory>(player, "inventory", {
			chairSkins: []
		});
		this.initialize<EquippedItems>(player, "equippedItems", {
			chairSkin: undefined
		});

		Log.info("Initialized data");
	}

	private initialize<T extends DataValue = DataValue>(
		player: Player,
		key: DataKey,
		defaultValue: T
	): void {

		const store = this.getStore(player, key);
		const value = store.Get(defaultValue);
		this.sendToClient(player, key, value);
		store.OnUpdate((value) => this.sendToClient(player, key, value));
	}

	private sendToClient<T extends DataValue = DataValue>(
		player: Player,
		key: DataKey,
		value: T
	): void {

		dataUpdate(player, key, value);
	}

	private getStore<T extends DataValue = DataValue>(player: Player, key: DataKey): DataStore2<T> {
		return DataStore2<T>(`${DATA_SCOPE}_${key}`, player);
	}
}