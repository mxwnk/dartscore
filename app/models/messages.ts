export type Message = {
  type: string;
};

export type GameUpdate = Message & {
  type: "GameUpdate";
  gameId: string;
  version: number;
};
