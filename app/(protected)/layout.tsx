"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

const decodeJWT = (token: string) => {
    try {
        return JSON.parse(atob(token.split(".")[1]));
    } catch {
        return null;
    }
};

export default function ProtectedLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem("token");

        // ❌ belum login → lempar ke login
        if (!token) {
            router.push("/login");
            return;
        }

        const decoded = decodeJWT(token);

        if (!decoded) {
            localStorage.removeItem("token");
            router.push("/login");
        }
    }, []);

    return <>{children}</>;
}