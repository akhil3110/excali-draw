import { create } from "zustand";

interface WhiteboardStore {
  whiteboards: any[];
  setWhiteboards: (whiteboards: any[]) => void;
}

const useWhiteBoardStore = create<WhiteboardStore>((set) => ({
  whiteboards: [],
  setWhiteboards: (whiteboards) => set({ whiteboards }),
}));

export default useWhiteBoardStore;