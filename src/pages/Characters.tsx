import { useState, useEffect } from 'react'
import { cosmic, hasStatus } from '../lib/cosmic'
import { Character, CharacterRole } from '../types'
import Loading from '../components/Loading'
import ErrorMessage from '../components/ErrorMessage'

export default function Characters() {
    const [characters, setCharacters] = useState<Character[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [selectedRole, setSelectedRole] = useState<CharacterRole | 'all'>('all')

    useEffect(() => {
        fetchCharacters()
    }, [])

    async function fetchCharacters() {
        try {
            const response = await cosmic.objects
                .find({ type: 'characters' })
                .props(['id', 'title', 'slug', 'metadata'])
                .depth(1)

            setCharacters(response.objects as Character[])
        } catch (err) {
            if (hasStatus(err) && err.status === 404) {
                setCharacters([])
            } else {
                setError('Failed to load characters')
            }
        } finally {
            setLoading(false)
        }
    }

    if (loading) return <Loading />
    if (error) return <ErrorMessage message={error} />

    const filteredCharacters = selectedRole === 'all'
        ? characters
        : characters.filter(char => char.metadata.role?.key === selectedRole)

    const getRoleColor = (role?: string) => {
        switch (role) {
            case 'assassin':
                return 'text-red-400'
            case 'hunter':
                return 'text-secondary'
            case 'survivor':
                return 'text-accent'
            default:
                return 'text-gray-400'
        }
    }

    const getDifficultyStars = (difficulty?: string) => {
        const count = difficulty === 'hard' ? 3 : difficulty === 'medium' ? 2 : 1
        return '★'.repeat(count) + '☆'.repeat(3 - count)
    }

    return (
        <div className="space-y-8">
            <div className="text-center mb-12">
                <h1 className="text-4xl md:text-5xl font-bold gradient-text mb-4">
                    Characters
                </h1>
                <p className="text-gray-400 text-lg">
                    Master unique abilities and dominate the arena
                </p>
            </div>

            {/* Role Filter */}
            <div className="flex justify-center gap-4 flex-wrap">
                <button
                    onClick={() => setSelectedRole('all')}
                    className={`px-6 py-2 rounded-lg font-medium transition-all duration-200 ${selectedRole === 'all'
                            ? 'bg-primary text-white'
                            : 'bg-dark-lighter text-gray-400 hover:text-gray-100'
                        }`}
                >
                    All
                </button>
                <button
                    onClick={() => setSelectedRole('assassin')}
                    className={`px-6 py-2 rounded-lg font-medium transition-all duration-200 ${selectedRole === 'assassin'
                            ? 'bg-red-500 text-white'
                            : 'bg-dark-lighter text-gray-400 hover:text-gray-100'
                        }`}
                >
                    Assassin
                </button>
                <button
                    onClick={() => setSelectedRole('hunter')}
                    className={`px-6 py-2 rounded-lg font-medium transition-all duration-200 ${selectedRole === 'hunter'
                            ? 'bg-secondary text-white'
                            : 'bg-dark-lighter text-gray-400 hover:text-gray-100'
                        }`}
                >
                    Hunter
                </button>
                <button
                    onClick={() => setSelectedRole('survivor')}
                    className={`px-6 py-2 rounded-lg font-medium transition-all duration-200 ${selectedRole === 'survivor'
                            ? 'bg-accent text-white'
                            : 'bg-dark-lighter text-gray-400 hover:text-gray-100'
                        }`}
                >
                    Survivor
                </button>
            </div>

            {/* Characters Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCharacters.map((character) => {
                    if (!character || !character.metadata) return null

                    return (
                        <div key={character.id} className="card group">
                            {character.metadata.character_image && (
                                <div className="relative h-64 mb-4 rounded-lg overflow-hidden">
                                    <img
                                        src={`${character.metadata.character_image.imgix_url}?w=600&h=400&fit=crop&auto=format,compress`}
                                        alt={character.title}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-dark via-transparent to-transparent"></div>
                                    <div className="absolute bottom-4 left-4">
                                        <h3 className="text-2xl font-bold mb-1">{character.title}</h3>
                                        {character.metadata.role && (
                                            <span className={`text-sm font-medium ${getRoleColor(character.metadata.role.key)}`}>
                                                {character.metadata.role.value}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Stats */}
                            <div className="grid grid-cols-3 gap-4 mb-4">
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-primary">{character.metadata.health_points || 0}</div>
                                    <div className="text-xs text-gray-400">HP</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-secondary">{character.metadata.speed || 0}</div>
                                    <div className="text-xs text-gray-400">Speed</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-lg text-yellow-400">{getDifficultyStars(character.metadata.difficulty?.key)}</div>
                                    <div className="text-xs text-gray-400">Difficulty</div>
                                </div>
                            </div>

                            {/* Special Ability */}
                            {character.metadata.special_ability && (
                                <div className="mb-4">
                                    <h4 className="text-sm font-semibold text-primary mb-2">Special Ability</h4>
                                    <p className="text-sm text-gray-300">{character.metadata.special_ability}</p>
                                </div>
                            )}

                            {/* Skills */}
                            {character.metadata.skills && character.metadata.skills.length > 0 && (
                                <div className="mb-4">
                                    <h4 className="text-sm font-semibold text-secondary mb-2">Skills</h4>
                                    <div className="space-y-2">
                                        {character.metadata.skills.map((skill, index) => (
                                            <div key={index} className="text-sm">
                                                <div className="flex justify-between items-center">
                                                    <span className="font-medium text-gray-200">{skill.name}</span>
                                                    <span className="text-xs text-gray-400">{skill.cooldown}</span>
                                                </div>
                                                <p className="text-xs text-gray-400">{skill.description}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Available Skins */}
                            {character.metadata.available_skins && character.metadata.available_skins.length > 0 && (
                                <div>
                                    <h4 className="text-sm font-semibold text-accent mb-2">Available Skins</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {character.metadata.available_skins.map((skin, index) => (
                                            <span
                                                key={index}
                                                className="px-2 py-1 rounded text-xs bg-dark border border-dark-border"
                                            >
                                                {skin.name}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )
                })}
            </div>

            {filteredCharacters.length === 0 && (
                <div className="text-center py-12">
                    <p className="text-gray-400">No characters found for this role</p>
                </div>
            )}
        </div>
    )
}