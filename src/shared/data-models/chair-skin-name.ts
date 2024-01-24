type ChairSkinName = ExtractKeys<ReplicatedFirst["Assets"]["Models"]["Chairs"], Model & { Seat: Seat }>;

export default ChairSkinName;