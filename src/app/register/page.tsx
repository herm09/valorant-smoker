"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { registerAction } from "../../lib/actions/auth";

export default function RegisterPage() {
    const [error, setError]            = useState<string | null>(null);
    const [isPending, startTransition] = useTransition();

    function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        startTransition(async () => {
            const result = await registerAction(formData);
            if (result?.error) setError(result.error);
        });
    }

    return (
        <main className="flex min-h-screen items-center justify-center p-8">
            <div className="w-full max-w-sm">
                <h1 className="mb-6 text-2xl font-bold text-white light:text-gray-900">Create an account</h1>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <div className="flex flex-col gap-1">
                        <label htmlFor="email" className="text-sm font-medium text-gray-300 light:text-gray-700">Email</label>
                        <input
                            id="email" name="email" type="email" required autoComplete="email"
                            className="rounded-lg border border-gray-600 bg-gray-900 px-3 py-2 text-sm text-white placeholder-gray-500 focus:border-cyan-400 focus:outline-none light:border-gray-300 light:bg-white light:text-gray-900 light:placeholder-gray-400"
                        />
                    </div>

                    <div className="flex flex-col gap-1">
                        <label htmlFor="password" className="text-sm font-medium text-gray-300 light:text-gray-700">
                            Password
                            <span className="ml-1 text-xs text-gray-500">(min. 8 characters)</span>
                        </label>
                        <input
                            id="password" name="password" type="password" required minLength={8} autoComplete="new-password"
                            className="rounded-lg border border-gray-600 bg-gray-900 px-3 py-2 text-sm text-white placeholder-gray-500 focus:border-cyan-400 focus:outline-none light:border-gray-300 light:bg-white light:text-gray-900 light:placeholder-gray-400"
                        />
                    </div>

                    {error && <p className="text-sm text-red-400">{error}</p>}

                    <button
                        type="submit" disabled={isPending}
                        className="rounded-lg bg-cyan-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-cyan-500 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {isPending ? "Creating account…" : "Create account"}
                    </button>
                </form>

                <p className="mt-6 text-center text-sm text-gray-500">
                    Already have an account?{" "}
                    <Link href="/login" className="text-cyan-400 hover:text-cyan-300">Sign in</Link>
                </p>
            </div>
        </main>
    );
}
