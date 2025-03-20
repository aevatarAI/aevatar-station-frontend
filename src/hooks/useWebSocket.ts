import { useEffect, useState } from 'react'
import { WEBSOCKET_URL } from "@/constants";

export const useWebSocket = () => {
    const socket = new WebSocket(WEBSOCKET_URL);
    const [connected, setConnected] = useState(false);

    useEffect(() => {
        if (connected) return;

        const handleOpen = () => {
            console.log('open connection')
            setConnected(true)
        }
        const handleClose = () => {
            console.log('close connection')
            setConnected(false)
        }
        const handleMessage = (event: any) => {
            console.log(event)
        }
        const handleError = (error: any) => {
            console.log(error)
        }


        socket.addEventListener('open', handleOpen);
        socket.addEventListener('close', handleClose);
        socket.addEventListener('message', handleMessage);
        socket.addEventListener('error', handleError);

        // return () => {
        //     socket.removeEventListener('open', handleOpen);
        //     socket.removeEventListener('close', handleClose);
        //     socket.removeEventListener('message', handleMessage);
        //     socket.removeEventListener('error', handleError);
        //     socket.close();
        // }
    }, [])

    return { socket, connected };
}