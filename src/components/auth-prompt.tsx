import Link from "next/link";

type Props = { message: string };

export default function AuthPrompt({ message }: Props) {
    return (
        <div className="flex flex-col gap-3 rounded-xl border border-gray-700 bg-gray-900/60 p-4 light:border-gray-200 light:bg-gray-50">
            <div className="flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 text-gray-500 light:text-gray-400">
                    <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
                <p className="text-sm font-semibold text-white light:text-gray-900">{message}</p>
            </div>
            <p className="text-xs text-gray-500 light:text-gray-500">
                Create an account or sign in to save and share your work.
            </p>
            <div className="flex gap-2">
                <Link
                    href="/login"
                    className="flex-1 rounded-lg border border-gray-600 px-3 py-2 text-center text-xs font-semibold text-gray-300 transition-colors hover:border-gray-400 hover:text-white light:border-gray-300 light:text-gray-700 light:hover:border-gray-400 light:hover:text-gray-900"
                >
                    Sign in
                </Link>
                <Link
                    href="/register"
                    className="flex-1 rounded-lg bg-cyan-600 px-3 py-2 text-center text-xs font-semibold text-white transition-colors hover:bg-cyan-500"
                >
                    Create account
                </Link>
            </div>
        </div>
    );
}
