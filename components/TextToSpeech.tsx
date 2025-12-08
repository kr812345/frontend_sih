"use client";

import { useState, useEffect } from "react";
import { Volume2, Square } from "lucide-react";

export const TextToSpeech = () => {
    const [isSpeaking, setIsSpeaking] = useState(false);

    useEffect(() => {
        // Cleanup on unmount
        return () => {
            if (typeof window !== "undefined") {
                window.speechSynthesis.cancel();
            }
        };
    }, []);

    const handleToggle = () => {
        if (typeof window === "undefined") return;

        if (isSpeaking) {
            window.speechSynthesis.cancel();
            setIsSpeaking(false);
        } else {
            const msg = new SpeechSynthesisUtterance(document.body.innerText);
            msg.lang = "en-US";
            msg.rate = 3;

            // Handle end of speech
            msg.onend = () => setIsSpeaking(false);

            window.speechSynthesis.speak(msg);
            setIsSpeaking(true);
        }
    };

    return (
        <div
            onClick={handleToggle}
            style={{
                position: "fixed",
                bottom: "20px",
                right: "20px",
                zIndex: 9999,
                background: "#000",
                color: "#fff",
                padding: "10px 20px",
                borderRadius: "50px",
                cursor: "pointer",
                fontFamily: "sans-serif",
                boxShadow: "0 4px 6px rgba(0,0,0,0.3)",
            }}
        >
            {isSpeaking ? <Square size={20} fill="white" /> : <Volume2 size={24} />}
        </div>
    );
};
