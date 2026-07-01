"use server";

import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth";
import { prisma } from "../db";

export async function saveComposition(data: {
    name: string;
    mapId: string;
    agentIds: string[];
}): Promise<void> {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) throw new Error("Not authenticated");

    await prisma.composition.create({
        data: { ...data, userId: session.user.id },
    });
    revalidatePath(`/maps/${data.mapId}`);
    revalidatePath("/compositions");
}

export async function deleteComposition(formData: FormData): Promise<void> {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) throw new Error("Not authenticated");

    const id = formData.get("id");
    if (typeof id !== "string" || !id) throw new Error("Missing composition id");

    const composition = await prisma.composition.findUnique({ where: { id } });
    if (!composition || composition.userId !== session.user.id) {
        throw new Error("Composition not found or access denied");
    }

    await prisma.composition.delete({ where: { id } });
    revalidatePath("/compositions");
}
