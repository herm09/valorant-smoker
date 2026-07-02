"use client";

import Link from "next/link";
import { signOut } from "next-auth/react";

type Props = { userEmail: string | null };

export default function AuthNav({ userEmail }: Props) {
    if (userEmail) {
        return (
            <div className="flex items-center gap-4">
                <Link
                    href="/profile"
                    className="hidden text-xs text-gray-500 transition-colors hover:text-white sm:inline light:text-gray-400 light:hover:text-gray-900"
                >
                    {userEmail}
                </Link>
                <button
                    type="button"
                    onClick={() => signOut({ callbackUrl: "/" })}
                    className="rounded-lg border border-gray-600 px-3 py-1 text-xs font-medium text-gray-300 transition-colors hover:border-gray-400 hover:text-white light:border-gray-300 light:text-gray-600 light:hover:border-gray-400 light:hover:text-gray-900"
                >
                    Sign out
                </button>
            </div>
        );
    }

    return (
        <div className="flex items-center gap-3">
            <Link
                href="/login"
                className="rounded-lg border border-gray-600 px-3 py-1 text-xs font-medium text-gray-300 transition-colors hover:border-gray-400 hover:text-white light:border-gray-300 light:text-gray-600 light:hover:border-gray-400 light:hover:text-gray-900"
            >
                Sign in
            </Link>
            <Link
                href="/register"
                className="rounded-lg bg-cyan-600 px-3 py-1 text-xs font-medium text-white transition-colors hover:bg-cyan-500"
            >
                Register
            </Link>
        </div>
    );
}
