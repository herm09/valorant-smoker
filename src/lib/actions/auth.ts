"use server";

import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { prisma } from "../db";

export async function registerAction(formData: FormData): Promise<{ error: string } | never> {
    const email = (formData.get("email") as string | null)?.trim().toLowerCase() ?? "";
    const password = (formData.get("password") as string | null) ?? "";

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return { error: "Invalid email address" };
    }
    if (password.length < 8) {
        return { error: "Password must be at least 8 characters" };
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
        return { error: "This email is already in use" };
    }

    try {
        const hashed = await bcrypt.hash(password, 12);
        await prisma.user.create({ data: { email, password: hashed } });
    } catch (err) {
        console.error("[registerAction]", err);
        return { error: "An unexpected error occurred. Please try again." };
    }

    redirect("/login?registered=1");
}
