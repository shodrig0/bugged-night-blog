interface ErrorMessageProps {
    message: string;
}

export default function ErrorMessage({ message }: ErrorMessageProps) {
    return (
        <div className="flex items-center justify-center min-h-[400px]">
            <div className="card bg-red-900/20 border-red-800 max-w-md">
                <div className="flex items-center space-x-3">
                    <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div>
                        <h3 className="text-lg font-semibold text-red-500">Error</h3>
                        <p className="text-gray-300">{message}</p>
                    </div>
                </div>
            </div>
        </div>
    )
}