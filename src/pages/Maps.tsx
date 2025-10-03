import { useState, useEffect } from 'react'
import { cosmic, hasStatus } from '../lib/cosmic'
import { GameMap, MapEnvironment } from '../types'
import Loading from '../components/Loading'
import ErrorMessage from '../components/ErrorMessage'

export default function Maps() {
    const [maps, setMaps] = useState<GameMap[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [selectedEnvironment, setSelectedEnvironment] = useState<MapEnvironment | 'all'>('all')

    useEffect(() => {
        fetchMaps()
    }, [])

    async function fetchMaps() {
        try {
            const response = await cosmic.objects
                .find({ type: 'game-maps' })
                .props(['id', 'title', 'slug', 'metadata'])
                .depth(1)

            setMaps(response.objects as GameMap[])
        } catch (err) {
            if (hasStatus(err) && err.status === 404) {
                setMaps([])
            } else {
                setError('Failed to load maps')
            }
        } finally {
            setLoading(false)
        }
    }

    if (loading) return <Loading />
    if (error) return <ErrorMessage message={error} />

    const filteredMaps = selectedEnvironment === 'all'
        ? maps
        : maps.filter(map => map.metadata.environment?.key === selectedEnvironment)

    const getEnvironmentColor = (env?: string) => {
        switch (env) {
            case 'urban':
                return 'text-gray-400'
            case 'forest':
                return 'text-green-400'
            case 'industrial':
                return 'text-yellow-400'
            case 'desert':
                return 'text-amber-400'
            default:
                return 'text-gray-400'
        }
    }

    const getDifficultyColor = (difficulty?: string) => {
        switch (difficulty) {
            case 'easy':
                return 'bg-green-500/20 text-green-400'
            case 'medium':
                return 'bg-yellow-500/20 text-yellow-400'
            case 'hard':
                return 'bg-red-500/20 text-red-400'
            default:
                return 'bg-gray-500/20 text-gray-400'
        }
    }

    return (
        <div className="space-y-8">
            <div className="text-center mb-12">
                <h1 className="text-4xl md:text-5xl font-bold gradient-text mb-4">
                    Game Maps
                </h1>
                <p className="text-gray-400 text-lg">
                    Explore diverse battlegrounds and master tactical positions
                </p>
            </div>

            {/* Environment Filter */}
            <div className="flex justify-center gap-4 flex-wrap">
                <button
                    onClick={() => setSelectedEnvironment('all')}
                    className={`px-6 py-2 rounded-lg font-medium transition-all duration-200 ${selectedEnvironment === 'all'
                            ? 'bg-primary text-white'
                            : 'bg-dark-lighter text-gray-400 hover:text-gray-100'
                        }`}
                >
                    All
                </button>
                {['urban', 'forest', 'industrial', 'desert'].map((env) => (
                    <button
                        key={env}
                        onClick={() => setSelectedEnvironment(env as MapEnvironment)}
                        className={`px-6 py-2 rounded-lg font-medium transition-all duration-200 ${selectedEnvironment === env
                                ? 'bg-primary text-white'
                                : 'bg-dark-lighter text-gray-400 hover:text-gray-100'
                            }`}
                    >
                        {env.charAt(0).toUpperCase() + env.slice(1)}
                    </button>
                ))}
            </div>

            {/* Maps Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {filteredMaps.map((map) => {
                    if (!map || !map.metadata) return null

                    return (
                        <div key={map.id} className="card group">
                            {map.metadata.map_image && (
                                <div className="relative h-64 mb-4 rounded-lg overflow-hidden">
                                    <img
                                        src={`${map.metadata.map_image.imgix_url}?w=800&h=400&fit=crop&auto=format,compress`}
                                        alt={map.title}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-dark via-transparent to-transparent"></div>
                                    <div className="absolute bottom-4 left-4 right-4">
                                        <h3 className="text-2xl font-bold mb-2">{map.title}</h3>
                                        <div className="flex items-center gap-2 flex-wrap">
                                            {map.metadata.environment && (
                                                <span className={`text-sm font-medium ${getEnvironmentColor(map.metadata.environment.key)}`}>
                                                    {map.metadata.environment.value}
                                                </span>
                                            )}
                                            {map.metadata.size && (
                                                <span className="text-sm text-gray-300">
                                                    • {map.metadata.size.value}
                                                </span>
                                            )}
                                            {map.metadata.max_players && (
                                                <span className="text-sm text-gray-300">
                                                    • {map.metadata.max_players} Players
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Difficulty Badge */}
                            {map.metadata.difficulty && (
                                <div className="mb-4">
                                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getDifficultyColor(map.metadata.difficulty.key)}`}>
                                        {map.metadata.difficulty.value}
                                    </span>
                                </div>
                            )}

                            {/* Description */}
                            {map.metadata.content && (
                                <div
                                    className="text-gray-300 text-sm mb-4"
                                    dangerouslySetInnerHTML={{ __html: map.metadata.content }}
                                />
                            )}

                            {/* Special Features */}
                            {map.metadata.special_features && map.metadata.special_features.length > 0 && (
                                <div>
                                    <h4 className="text-sm font-semibold text-primary mb-3">Special Features</h4>
                                    <div className="space-y-2">
                                        {map.metadata.special_features.map((feature, index) => (
                                            <div key={index} className="bg-dark p-3 rounded-lg border border-dark-border">
                                                <div className="font-medium text-secondary text-sm mb-1">{feature.name}</div>
                                                <p className="text-xs text-gray-400">{feature.description}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )
                })}
            </div>

            {filteredMaps.length === 0 && (
                <div className="text-center py-12">
                    <p className="text-gray-400">No maps found for this environment</p>
                </div>
            )}
        </div>
    )
}