import type { ChairSkinName, PetName, WeaponName } from "./inventory-item-names";

export default interface Inventory {
  readonly chairSkins: ChairSkinName[];
  readonly pets: PetName[];
  readonly weapons: WeaponName[];
}