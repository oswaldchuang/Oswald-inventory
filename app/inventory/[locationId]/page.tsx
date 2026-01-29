import Link from "next/link";
import { notFound } from "next/navigation";
import { INITIAL_STUDIOS } from "@/data/constants";
import { ArrowLeft } from "lucide-react";
import InventoryList from "./InventoryList";

type Params = Promise<{ locationId: string }>;

export default async function InventoryPage({ params }: { params: Params }) {
    const { locationId } = await params;
    const studio = INITIAL_STUDIOS.find((s) => s.id === locationId);

    if (!studio) {
        notFound();
    }

    return (
        <InventoryList studioId={studio.id} />
    );
}
