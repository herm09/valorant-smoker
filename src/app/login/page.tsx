"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
    const searchParams = useSearchParams();
    const registered = searchParams.get("registered") === "1";

    const [error, setError]            = useState<string | null>(null);
    const [isPending, startTransition] = useTransition();
    const router = useRouter();

    function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const email    = formData.get("email") as string;
        const password = formData.get("password") as string;

        startTransition(async () => {
            const result = await signIn("credentials", { email, password, redirect: false });
            if (result?.error) {
                setError("Invalid email or password");
            } else {
                router.push("/");
                router.refresh();
            }
        });
    }

    return (
        <main className="flex min-h-screen items-center justify-center p-8">
            <div className="w-full max-w-sm">
                <h1 className="mb-6 text-2xl font-bold text-white light:text-gray-900">Sign in</h1>

                {registered && (
                    <p className="mb-4 rounded-lg bg-green-900/40 px-4 py-2 text-sm text-green-400 light:bg-green-50 light:text-green-700">
                        Account created — you can now sign in.
                    </p>
                )}

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <div className="flex flex-col gap-1">
                        <label htmlFor="email" className="text-sm font-medium text-gray-300 light:text-gray-700">Email</label>
                        <input
                            id="email" name="email" type="email" required autoComplete="email"
                            className="rounded-lg border border-gray-600 bg-gray-900 px-3 py-2 text-sm text-white placeholder-gray-500 focus:border-cyan-400 focus:outline-none light:border-gray-300 light:bg-white light:text-gray-900 light:placeholder-gray-400"
                        />
                    </div>

                    <div className="flex flex-col gap-1">
                        <label htmlFor="password" className="text-sm font-medium text-gray-300 light:text-gray-700">Password</label>
                        <input
                            id="password" name="password" type="password" required autoComplete="current-password"
                            className="rounded-lg border border-gray-600 bg-gray-900 px-3 py-2 text-sm text-white placeholder-gray-500 focus:border-cyan-400 focus:outline-none light:border-gray-300 light:bg-white light:text-gray-900 light:placeholder-gray-400"
                        />
                    </div>

                    {error && <p className="text-sm text-red-400">{error}</p>}

                    <button
                        type="submit" disabled={isPending}
                        className="rounded-lg bg-cyan-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-cyan-500 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {isPending ? "Signing in…" : "Sign in"}
                    </button>
                </form>

                <p className="mt-6 text-center text-sm text-gray-500">
                    No account?{" "}
                    <Link href="/register" className="text-cyan-400 hover:text-cyan-300">Register</Link>
                </p>
            </div>
        </main>
    );
}
