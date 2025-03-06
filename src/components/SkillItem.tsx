export function SkillItem({ label, value }: { label: string; value: string; }) {
    return (
        <div className="flex flex-col">
            <span className="">{label}</span>
            <div className="flex justify-between items-center">
                <div className="w-full h-2 border mr-2">
                    <div className="bg-foreground h-full" style={{ width: value }}></div>
                </div>
                <span className="whitespace-nowrap">{value}</span>
            </div>
        </div>
    );
}

