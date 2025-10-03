import { useState, useEffect } from 'react'
import { cosmic, hasStatus } from '../lib/cosmic'
import { PatchNote } from '../types'
import Loading from '../components/Loading'
import ErrorMessage from '../components/ErrorMessage'
import { format } from 'date-fns'

import Comments from '@/components/Comments'

export default function PatchNotes() {
    const [patches, setPatches] = useState<PatchNote[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        fetchPatchNotes()
    }, [])

    async function fetchPatchNotes() {
        try {
            const response = await cosmic.objects
                .find({ type: 'patch-notes' })
                .props(['id', 'title', 'slug', 'metadata'])
                .depth(1)

            const sortedPatches = (response.objects as PatchNote[]).sort((a, b) => {
                const dateA = new Date(a.metadata?.release_date || '').getTime()
                const dateB = new Date(b.metadata?.release_date || '').getTime()
                return dateB - dateA
            })

            setPatches(sortedPatches)
        } catch (err) {
            if (hasStatus(err) && err.status === 404) {
                setPatches([])
            } else {
                setError('Failed to load patch notes')
            }
        } finally {
            setLoading(false)
        }
    }

    if (loading) return <Loading />
    if (error) return <ErrorMessage message={error} />

    const getPatchTypeColor = (type?: string) => {
        switch (type) {
            case 'major':
                return 'bg-accent text-white'
            case 'bugfix':
                return 'bg-yellow-500 text-dark'
            case 'balance':
                return 'bg-secondary text-white'
            case 'newcontent':
                return 'bg-primary text-white'
            default:
                return 'bg-gray-600 text-white'
        }
    }

    return (
        <div className="space-y-8">
            <div className="text-center mb-12">
                <h1 className="text-4xl md:text-5xl font-bold gradient-text mb-4">
                    Notas de parches
                </h1>
                <p className="text-gray-400 text-lg">
                    Últimas actualizaciones del juego
                </p>
            </div>

            <div className="space-y-6">
                {patches.map((patch, index) => {
                    if (!patch || !patch.metadata) return null

                    return (
                        <div key={patch.id} className="relative">
                            {index < patches.length - 1 && (
                                <div className="absolute left-4 top-16 bottom-0 w-0.5 bg-dark-border"></div>
                            )}

                            <div className="card relative ml-12">
                                <div className="absolute -left-8 top-6 w-4 h-4 rounded-full bg-primary border-4 border-dark"></div>

                                <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-4">
                                    <div>
                                        <h3 className="text-2xl font-bold mb-2">{patch.title}</h3>
                                        {patch.metadata.release_date && (
                                            <p className="text-gray-400 text-sm">
                                                {format(new Date(patch.metadata.release_date), 'MMMM dd, yyyy')}
                                            </p>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-3 mt-2 md:mt-0">
                                        {patch.metadata.patch_type && (
                                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getPatchTypeColor(patch.metadata.patch_type.key)}`}>
                                                {patch.metadata.patch_type.value}
                                            </span>
                                        )}
                                        {patch.metadata.download_size && (
                                            <span className="text-xs text-gray-400">
                                                {patch.metadata.download_size}
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {patch.metadata.content && (
                                    <div
                                        className="text-gray-300 mb-6"
                                        dangerouslySetInnerHTML={{ __html: patch.metadata.content }}
                                    />
                                )}

                                {patch.metadata.balance_changes && patch.metadata.balance_changes.length > 0 && (
                                    <div className="mb-6">
                                        <h4 className="text-lg font-semibold text-secondary mb-3">Balance Changes</h4>
                                        <div className="space-y-3">
                                            {patch.metadata.balance_changes.map((change, idx) => (
                                                <div key={idx} className="bg-dark p-4 rounded-lg border border-dark-border">
                                                    <div className="font-medium text-secondary mb-1">{change.character}</div>
                                                    <p className="text-sm text-gray-300">{change.description}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {patch.metadata.bug_fixes && patch.metadata.bug_fixes.length > 0 && (
                                    <div className="mb-6">
                                        <h4 className="text-lg font-semibold text-yellow-500 mb-3">Bug Fixes</h4>
                                        <ul className="space-y-2">
                                            {patch.metadata.bug_fixes.map((fix, idx) => (
                                                <li key={idx} className="flex items-start space-x-2">
                                                    <span className="text-yellow-500 mt-1">•</span>
                                                    <span className="text-sm text-gray-300">{fix}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                {patch.metadata.new_features && patch.metadata.new_features.length > 0 && (
                                    <div>
                                        <h4 className="text-lg font-semibold text-accent mb-3">New Features</h4>
                                        <div className="space-y-3">
                                            {patch.metadata.new_features.map((feature, idx) => (
                                                <div key={idx} className="bg-dark p-4 rounded-lg border border-dark-border">
                                                    <div className="font-medium text-accent mb-1">{feature.name}</div>
                                                    <p className="text-sm text-gray-300">{feature.description}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                        </div>
                    )
                })}
            </div>

            {patches.length === 0 && (
                <div className="text-center py-12">
                    <p className="text-gray-400">No patch notes available</p>
                </div>
            )}
            <Comments />
        </div>
    )
}