"use client";

import { useEffect, useState } from "react";
import LogoutModal from "../modals/LogoutModal";
import CreateRoomModal from "../modals/CreateRoomModal";
import DeleteCanvasModal from "../modals/DeleteCanvsModal";


const ModalProider = () => {

    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(false)
    },[])

    
    return (
        <>
            <LogoutModal />
            <CreateRoomModal />
            <DeleteCanvasModal />
        </>
    )
}

export default ModalProider