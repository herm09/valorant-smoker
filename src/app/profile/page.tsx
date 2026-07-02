import { redirect } from "next/navigation";
import Link from "next/link";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../lib/auth";
import { prisma } from "../../lib/db";
import { updateUsername, updateEmail, updatePassword } from "../../lib/actions/profile";

const SUCCESS_MESSAGES: Record<string, string> = {
    username: "Username updated!",
    email:    "Email updated! Sign in again with your new address.",
    password: "Password updated!",
};

const ERROR_MESSAGES: Record<string, string> = {
    invalid_username:  "Username must be 3–20 characters, letters, numbers and _ only.",
    username_taken:    "This username is already taken.",
    invalid_email:     "Please enter a valid email address.",
    email_taken:       "This email is already used by another account.",
    wrong_password:    "Current password is incorrect.",
    passwords_mismatch:"New password and confirmation do not match.",
    password_too_short:"New password must be at least 8 characters.",
};

export default async function ProfilePage({
    searchParams,
}: {
    searchParams: Promise<Record<string, string>>;
}) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) redirect("/login");

    const user = await prisma.user.findUnique({
        where:  { id: session.user.id },
        select: { email: true, username: true },
    });
    if (!user) redirect("/login");

    const params  = await searchParams;
    const updated = params.updated ?? null;
    const error   = params.error   ?? null;

    const inputClass =
        "w-full rounded-lg border border-gray-700 bg-gray-800 px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 light:border-gray-300 light:bg-white light:text-gray-900 light:placeholder-gray-400";
    const labelClass = "mb-1.5 block text-xs font-semibold uppercase tracking-widest text-gray-500 light:text-gray-400";
    const cardClass  = "rounded-xl border border-gray-800 bg-gray-900/60 p-6 light:border-gray-200 light:bg-white";
    const btnClass   = "mt-4 w-full rounded-lg bg-cyan-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-cyan-500";

    return (
        <main className="min-h-screen p-8">
            <Link
                href="/"
                className="mb-6 inline-flex items-center gap-1 text-xs text-gray-500 transition-colors hover:text-gray-300 light:hover:text-gray-700"
            >
                ← Back
            </Link>

            <h1 className="mb-6 text-3xl font-bold text-white light:text-gray-900">My Profile</h1>

            {/* Feedback banner */}
            {updated && SUCCESS_MESSAGES[updated] && (
                <div className="mb-6 rounded-lg bg-green-900/40 border border-green-700 px-4 py-3 text-sm text-green-300 light:bg-green-50 light:border-green-300 light:text-green-700">
                    {SUCCESS_MESSAGES[updated]}
                </div>
            )}
            {error && ERROR_MESSAGES[error] && (
                <div className="mb-6 rounded-lg bg-red-900/40 border border-red-700 px-4 py-3 text-sm text-red-300 light:bg-red-50 light:border-red-300 light:text-red-700">
                    {ERROR_MESSAGES[error]}
                </div>
            )}

            <div className="flex max-w-lg flex-col gap-6">

                {/* Username */}
                <div className={cardClass}>
                    <h2 className="mb-4 text-sm font-semibold text-white light:text-gray-900">Username</h2>
                    <form action={updateUsername}>
                        <label className={labelClass} htmlFor="username">Pseudo</label>
                        <input
                            id="username"
                            name="username"
                            type="text"
                            defaultValue={user.username ?? ""}
                            placeholder="e.g. Player_42"
                            autoComplete="username"
                            className={inputClass}
                        />
                        <p className="mt-1.5 text-xs text-gray-600 light:text-gray-400">
                            3–20 characters · letters, numbers and _ only
                        </p>
                        <button type="submit" className={btnClass}>Save username</button>
                    </form>
                </div>

                {/* Email */}
                <div className={cardClass}>
                    <h2 className="mb-4 text-sm font-semibold text-white light:text-gray-900">Email</h2>
                    <form action={updateEmail}>
                        <label className={labelClass} htmlFor="email">Email address</label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            defaultValue={user.email}
                            autoComplete="email"
                            className={inputClass}
                        />
                        <button type="submit" className={btnClass}>Save email</button>
                    </form>
                </div>

                {/* Password */}
                <div className={cardClass}>
                    <h2 className="mb-4 text-sm font-semibold text-white light:text-gray-900">Password</h2>
                    <form action={updatePassword} className="flex flex-col gap-3">
                        <div>
                            <label className={labelClass} htmlFor="currentPassword">Current password</label>
                            <input
                                id="currentPassword"
                                name="currentPassword"
                                type="password"
                                autoComplete="current-password"
                                className={inputClass}
                            />
                        </div>
                        <div>
                            <label className={labelClass} htmlFor="newPassword">New password</label>
                            <input
                                id="newPassword"
                                name="newPassword"
                                type="password"
                                autoComplete="new-password"
                                className={inputClass}
                            />
                        </div>
                        <div>
                            <label className={labelClass} htmlFor="confirmPassword">Confirm new password</label>
                            <input
                                id="confirmPassword"
                                name="confirmPassword"
                                type="password"
                                autoComplete="new-password"
                                className={inputClass}
                            />
                        </div>
                        <button type="submit" className={btnClass}>Change password</button>
                    </form>
                </div>

            </div>
        </main>
    );
}
