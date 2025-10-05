export function TargetIcon({ className }: { className?: string }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" className={className}>
            <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="6" fill="none" />
            <circle cx="50" cy="50" r="25" stroke="currentColor" strokeWidth="6" fill="none" />
            <circle cx="50" cy="50" r="10" fill="currentColor" />
        </svg>
    )
}