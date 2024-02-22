import type { ChairSkinName, PetName, WeaponName } from "./inventory-item-names";

export default interface EquippedItems {
  chairSkin?: ChairSkinName;
  pet?: PetName;
  weapon?: WeaponName;
}