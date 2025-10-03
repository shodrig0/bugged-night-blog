import { createBucketClient } from '@cosmicjs/sdk'

export const cosmic = createBucketClient({
    bucketSlug: import.meta.env.VITE_COSMIC_BUCKET_SLUG as string,
    readKey: import.meta.env.VITE_COSMIC_READ_KEY as string,
})

// Helper function for error handling
export function hasStatus(error: unknown): error is { status: number } {
    return typeof error === 'object' && error !== null && 'status' in error;
}