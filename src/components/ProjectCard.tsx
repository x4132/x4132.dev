interface ProjectCardProps {
    title: string;
    code: string;
    status: "COMPLETE" | "ACTIVE" | "PLANNING" | "IN DEVELOPMENT" | "TERMINATED";
    description: string;
}

export default function ProjectCard({ title, code, status, description }: ProjectCardProps) {
    const statusColor = {
        COMPLETE: "text-primary",
        ACTIVE: "text-secondary",
        PLANNING: "text-foreground",
        "IN DEVELOPMENT": "text-secondary",
        TERMINATED: "text-muted",
    }[status];

    return (
        <div className="linebox flex flex-col">
            <div className="flex justify-between items-center mb-2">
                <h3 className="text-xl">{title}</h3>
                <span className="text-sm text-foreground/70">{code}</span>
            </div>
            <div className="mb-2">
                <span className={`text-sm ${statusColor}`}>STATUS: {status}</span>
            </div>
            <p className="text-foreground/80">{description}</p>
        </div>
    );
}

