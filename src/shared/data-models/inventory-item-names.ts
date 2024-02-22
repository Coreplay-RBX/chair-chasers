export type ChairSkinName = ExtractKeys<ReplicatedFirst["Assets"]["Models"]["Chairs"], Model & { Seat: Seat }>;
export type PetName = ExtractKeys<ReplicatedFirst["Assets"]["Models"]["Pets"], Model>;
export type WeaponName = ExtractKeys<ReplicatedFirst["Assets"]["Models"]["Weapons"], Model>;