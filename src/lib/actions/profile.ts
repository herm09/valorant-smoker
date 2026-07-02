"use server";

import { redirect } from "next/navigation";
import { getServerSession } from "next-auth/next";
import bcrypt from "bcryptjs";
import { authOptions } from "../auth";
import { prisma } from "../db";

const USERNAME_RE = /^[a-zA-Z0-9_]{3,20}$/;

async function requireUserId(): Promise<string> {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) redirect("/login");
    return session.user.id;
}

export async function updateUsername(formData: FormData): Promise<void> {
    const userId   = await requireUserId();
    const username = (formData.get("username") as string | null)?.trim() ?? "";

    if (!USERNAME_RE.test(username)) redirect("/profile?error=invalid_username");

    const taken = await prisma.user.findFirst({
        where: { username, NOT: { id: userId } },
    });
    if (taken) redirect("/profile?error=username_taken");

    await prisma.user.update({ where: { id: userId }, data: { username } });
    redirect("/profile?updated=username");
}

export async function updateEmail(formData: FormData): Promise<void> {
    const userId = await requireUserId();
    const email  = (formData.get("email") as string | null)?.trim().toLowerCase() ?? "";

    if (!email.includes("@") || email.length < 3) redirect("/profile?error=invalid_email");

    const taken = await prisma.user.findFirst({
        where: { email, NOT: { id: userId } },
    });
    if (taken) redirect("/profile?error=email_taken");

    await prisma.user.update({ where: { id: userId }, data: { email } });
    redirect("/profile?updated=email");
}

export async function updatePassword(formData: FormData): Promise<void> {
    const userId          = await requireUserId();
    const currentPassword = (formData.get("currentPassword") as string | null) ?? "";
    const newPassword     = (formData.get("newPassword")     as string | null) ?? "";
    const confirmPassword = (formData.get("confirmPassword") as string | null) ?? "";

    if (newPassword.length < 8) redirect("/profile?error=password_too_short");
    if (newPassword !== confirmPassword) redirect("/profile?error=passwords_mismatch");

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) redirect("/login");

    const valid = await bcrypt.compare(currentPassword, user.password);
    if (!valid) redirect("/profile?error=wrong_password");

    const hashed = await bcrypt.hash(newPassword, 12);
    await prisma.user.update({ where: { id: userId }, data: { password: hashed } });
    redirect("/profile?updated=password");
}
