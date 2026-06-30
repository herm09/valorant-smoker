export default async function MapPage({
    params,
    }: {
    params: Promise<{ id: string }>;
    }) {
    const { id } = await params;

    return (
        <div className="p-8">
        <h1>{id}</h1>
        </div>
    );
}