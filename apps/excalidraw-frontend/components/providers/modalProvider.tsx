"use client";

import { useEffect, useState } from "react";
import LogoutModal from "../modals/LogoutModal";

const ModalProider = () => {

    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(false)
    },[])

    
    return (
        <>
            <LogoutModal />
        </>
    )
}

export default ModalProider