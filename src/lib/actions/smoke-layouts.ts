"use server";

import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth";
import { prisma } from "../db";
import type { StoredSmoke } from "../../types/valorant";

export async function saveSmokeLayout(data: {
    name: string;
    mapId: string;
    smokes: StoredSmoke[];
    isPublic: boolean;
}): Promise<void> {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) throw new Error("Not authenticated");

    await prisma.smokeLayout.create({
        data: {
            name:     data.name,
            mapId:    data.mapId,
            isPublic: data.isPublic,
            smokes:   JSON.parse(JSON.stringify(data.smokes)),
            userId:   session.user.id,
        },
    });

    revalidatePath(`/maps/${data.mapId}`);
    revalidatePath("/community");
    revalidatePath("/smoke-layouts");
}

export async function deleteSmokeLayout(formData: FormData): Promise<void> {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) throw new Error("Not authenticated");

    const id = formData.get("id");
    if (typeof id !== "string" || !id) throw new Error("Missing layout id");

    const layout = await prisma.smokeLayout.findUnique({ where: { id } });
    if (!layout || layout.userId !== session.user.id) {
        throw new Error("Layout not found or access denied");
    }

    await prisma.smokeLayout.delete({ where: { id } });
    revalidatePath("/community");
    revalidatePath("/smoke-layouts");
    revalidatePath(`/maps/${layout.mapId}`);
}

export async function togglePublic(formData: FormData): Promise<void> {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) throw new Error("Not authenticated");

    const id = formData.get("id");
    if (typeof id !== "string" || !id) throw new Error("Missing layout id");

    const layout = await prisma.smokeLayout.findUnique({ where: { id } });
    if (!layout || layout.userId !== session.user.id) {
        throw new Error("Layout not found or access denied");
    }

    await prisma.smokeLayout.update({
        where: { id },
        data:  { isPublic: !layout.isPublic },
    });

    revalidatePath("/community");
    revalidatePath("/smoke-layouts");
    revalidatePath(`/layouts/${id}`);
}
