import { atom } from "recoil";

const AuctionCurrentBidAtom = atom({
  key: "auctionCurrentBidState",
  default: 0,
});

export { AuctionCurrentBidAtom };