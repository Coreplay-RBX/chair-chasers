import { OnInit, Service } from "@flamework/core";
import { DataStoreService } from "@rbxts/services"
import DataStore2 from "@rbxts/datastore2";

import { Events, Functions } from "server/network";
import type { OnPlayerJoin } from "server/hooks";

import { type DataKey, type DataValue, DataKeys } from "shared/data-models/generic";
import type EquippedItems from "shared/data-models/equipped-items";
import type Inventory from "shared/data-models/inventory";
import type EarningsHistory from "shared/data-models/earnings-history";
import Log from "shared/logger";

const { initializeData, setData, incrementData, dataUpdate } = Events;
const { getData } = Functions;

// if you ever wanna wipe all data, just change the keyID
// you can also use it to separate test databases and production databases
const DATA_SCOPE = "TEST";
const LEADERSTATS_KEYS: TrackedDataKey[] = ["notes", "wins"]; // this is in order!

@Service()
export class DataService implements OnInit, OnPlayerJoin {
	private readonly leaderstats = new Instance("IntValue");

	public onInit(): void {
		DataStore2.Combine("DATA", ...DataKeys);
		initializeData.connect((player) => this.setup(player));
		setData.connect((player, key, value) => this.set(player, key, value));
		incrementData.connect((player, key, amount) => this.increment(player, key, amount))
		getData.setCallback((player, key) => this.get(player, key));
	}

	public onPlayerJoin(player: Player): void {
		this.leaderstats.Name = "leaderstats";
		this.leaderstats.Parent = player;
	}

	public getTrackedUserIDs(): number[] {
		const keyPages = this.getEarningsHistoryStore().ListKeysAsync(undefined, 40);
		const keys: string[] = [];
		while (true) {
			for (const key of keyPages.GetCurrentPage())
				keys.push(<string>key);

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

	public addEarningsHistory(player: Player, history: EarningsHistory): void {
		const id = tostring(player.UserId);
		const store = this.getEarningsHistoryStore();
		const allHistory = store.GetAsync<EarningsHistory[]>(id)[0] ?? [];
		allHistory.push(history);
		store.SetAsync(id, allHistory);
	}

	public getEarningsHistoryStore(): DataStore {
		return DataStoreService.GetDataStore("earningsHistory", DATA_SCOPE);
	}

	private setup(player: Player): void {
    this.initialize(player, "notes", 0);
		this.initialize(player, "wins", 0);
		this.initialize(player, "redeemedCodes", []);
		this.initialize<Inventory>(player, "inventory", {
			chairSkins: [],
			pets: [],
			weapons: []
		});
		this.initialize<EquippedItems>(player, "equippedItems", {
			chairSkin: undefined,
			pet: undefined,
			weapon: undefined
		});

		for (const key of LEADERSTATS_KEYS) {
			const value = new Instance("IntValue");
			value.Name = key.sub(1, 1).upper() + key.sub(2);
			value.Value = this.get<number>(player, key);
			value.Parent = this.leaderstats;
		}
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