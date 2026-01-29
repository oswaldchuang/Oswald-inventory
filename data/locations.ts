export type Location = {
    id: string;
    name: string;
    description?: string;
};

export const locations: Location[] = [
    { id: "studio-1", name: "1號棚", description: "Studio 1" },
    { id: "studio-2", name: "2號棚", description: "Studio 2" },
    { id: "studio-3", name: "3號棚", description: "Studio 3" },
    { id: "studio-4", name: "4號棚", description: "Studio 4" },
    { id: "studio-5", name: "5號棚", description: "Studio 5" },
    { id: "studio-6", name: "6號棚", description: "Studio 6" },
    { id: "public-area", name: "公共區", description: "Public Area" },
];
