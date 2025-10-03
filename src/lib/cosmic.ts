import { createBucketClient } from '@cosmicjs/sdk'


export const cosmic = createBucketClient({
    bucketSlug: import.meta.env.VITE_COSMIC_BUCKET_SLUG as string,
    readKey: import.meta.env.VITE_COSMIC_READ_KEY as string,
    writeKey: import.meta.env.COSMIC_WRITE_KEY as string,
})

// Helper function for error handling -> ejemplo de Cosmic
export function hasStatus(error: unknown): error is { status: number } {
    return typeof error === 'object' && error !== null && 'status' in error;
}

// Helper para comentarios
export async function getComments(): Promise<Comment[]> {
    try {
        const { objects } = await cosmic.objects
            .find({
                type: 'comments'
            })
            .props('id,title,metadata,created_at')
            .sort('-created_at')

        return objects as Comment[]
    } catch (error) {
        return []
    }
}

export async function createComment(
    name: string,
    email: string,
    comment: string
): Promise<void> {
    try {
        await cosmic.objects.insertOne({
            type: 'comments',
            title: name,
            metadata: {
                email,
                comment
            }
        })
    } catch (error) {
        throw new Error('Falló la creación')
    }
}