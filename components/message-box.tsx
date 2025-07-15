"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@radix-ui/react-label";
import { Icon } from "lucide-react";
import { getServerSession } from "next-auth";
import SpinnerOverlay from "./spinner";



export default function MessageBox() {
    const [subject, setSubject] = useState("");
    const [body, setBody] = useState("");
    const [loading, setLoading] = useState(false);

    const handleClick = async () => {
        try {
            setLoading(true);
            const responce = await fetch("/api/email/send", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    subject: subject,
                    body: body,
                }),
            });
            if (!subject || !body) {
                alert("Please fill out all fields.");
            } else if(responce.status === 401) {
                alert("Unauthorized: Please log in to send a message.");
            }
            else {
                alert("Message sent successfully!");
                setSubject("");
                setBody("");
            }
            setLoading(false);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="mt-8 m-5 card secondary">
            {loading && <SpinnerOverlay />}
            <div className="col-1 items-center gap-3 p-6">
                <Input
                    type="text"
                    placeholder="Subject"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-30/31 m-5 bg-white/30 backdrop-blur-md rounded-xl p-6"
                />
                <Textarea
                    placeholder="Message body"
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                    className="w-30/31 m-5 bg-white/30 backdrop-blur-md rounded-xl p-6"
                />
                <Button onClick={() => handleClick()}>Send to me </Button>
            </div>
        </div>

    );
}

