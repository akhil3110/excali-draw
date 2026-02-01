import { create } from "zustand";

type CanasView = "all" | "created" | "member"

interface ShowCanvasStore {
 view: CanasView;
 setView: (view: CanasView) => void;
}


export const useShowCanvasStore = create<ShowCanvasStore>((set) => ({
    view: "all",
    setView: (view) => set({ view }),
}))