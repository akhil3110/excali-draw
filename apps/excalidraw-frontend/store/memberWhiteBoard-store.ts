import { create } from "zustand";

interface memberWhiteboardStore {
  memberWhiteboards: any[];
  setMemberWhiteboards: (MemberWhiteboards: any[]) => void;
}

const useMemberWhiteBoardStore = create<memberWhiteboardStore>((set) => ({
  memberWhiteboards: [],
  setMemberWhiteboards: (memberWhiteboards) => set({ memberWhiteboards }),
}));

export default useMemberWhiteBoardStore;