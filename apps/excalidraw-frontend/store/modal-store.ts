import {create} from "zustand"

export type ModalType = "logout-modal" | "create-room-modal" | "delte-canvas-modal" | "join-canvas-modal" | "addMember-canvas-modal"

interface ModalData {
    userId?: string
    canvasId?: number
}

interface ModalStore {
    type: string | null,
    isOpen: boolean,
    data: ModalData | null,
    onOpen: (type: ModalType, data?: ModalData) => void,
    onClose: () => void
}

const useModalStore  = create<ModalStore>((set) => ({
    type: null,
    isOpen: false,
    data: null,
    onOpen: (type,data) => set({type,isOpen:true,data}),
    onClose: () => set({type:null, isOpen:false, data: null})
}))

export default useModalStore;