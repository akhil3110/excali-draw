"use client";

import { useEffect, useState } from "react";
import LogoutModal from "../modals/LogoutModal";
import CreateRoomModal from "../modals/CreateRoomModal";

const ModalProider = () => {

    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(false)
    },[])

    
    return (
        <>
            <LogoutModal />
            <CreateRoomModal />
        </>
    )
}

export default ModalProider