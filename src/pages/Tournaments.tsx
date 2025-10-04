import { useState, useEffect } from 'react'
import { cosmic, hasStatus } from '../lib/cosmic'
import { Tournament, TournamentStatus } from '../types'
import Loading from '../components/Loading'
import ErrorMessage from '../components/ErrorMessage'
import { format } from 'date-fns'


export default function Tournaments() {
    const [tournaments, setTournaments] = useState<Tournament[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [selectedStatus, setSelectedStatus] = useState<TournamentStatus | 'all'>('all')

    useEffect(() => {
        fetchTournaments()
    }, [])

    async function fetchTournaments() {
        try {
            const response = await cosmic.objects
                .find({ type: 'tournaments' })
                .props(['id', 'title', 'slug', 'metadata'])
                .depth(1)

            const sortedTournaments = (response.objects as Tournament[]).sort((a, b) => {
                const dateA = new Date(a.metadata?.start_date || '').getTime()
                const dateB = new Date(b.metadata?.start_date || '').getTime()
                return dateB - dateA
            })

            setTournaments(sortedTournaments)
        } catch (err) {
            if (hasStatus(err) && err.status === 404) {
                setTournaments([])
            } else {
                setError('Failed to load tournaments')
            }
        } finally {
            setLoading(false)
        }
    }

    if (loading) return <Loading />
    if (error) return <ErrorMessage message={error} />

    const filteredTournaments = selectedStatus === 'all'
        ? tournaments
        : tournaments.filter(tournament => tournament.metadata.status?.key === selectedStatus)

    const getStatusColor = (status?: string) => {
        switch (status) {
            case 'live':
                return 'bg-green-500 text-white animate-pulse'
            case 'upcoming':
                return 'bg-primary text-white'
            case 'finished':
                return 'bg-gray-600 text-white'
            default:
                return 'bg-gray-600 text-white'
        }
    }

    return (
        <div className="space-y-8">
            <div className="text-center mb-12">
                <h1 className="text-4xl md:text-5xl font-bold gradient-text mb-4">
                    Tournaments
                </h1>
                <p className="text-gray-400 text-lg">
                    Compete for glory and incredible prizes
                </p>
            </div>

            <div className="flex justify-center gap-4 flex-wrap">
                <button
                    onClick={() => setSelectedStatus('all')}
                    className={`px-6 py-2 rounded-lg font-medium transition-all duration-200 ${selectedStatus === 'all'
                            ? 'bg-primary text-white'
                            : 'bg-dark-lighter text-gray-400 hover:text-gray-100'
                        }`}
                >
                    All
                </button>
                <button
                    onClick={() => setSelectedStatus('live')}
                    className={`px-6 py-2 rounded-lg font-medium transition-all duration-200 ${selectedStatus === 'live'
                            ? 'bg-green-500 text-white'
                            : 'bg-dark-lighter text-gray-400 hover:text-gray-100'
                        }`}
                >
                    Live
                </button>
                <button
                    onClick={() => setSelectedStatus('upcoming')}
                    className={`px-6 py-2 rounded-lg font-medium transition-all duration-200 ${selectedStatus === 'upcoming'
                            ? 'bg-primary text-white'
                            : 'bg-dark-lighter text-gray-400 hover:text-gray-100'
                        }`}
                >
                    Upcoming
                </button>
                <button
                    onClick={() => setSelectedStatus('finished')}
                    className={`px-6 py-2 rounded-lg font-medium transition-all duration-200 ${selectedStatus === 'finished'
                            ? 'bg-gray-600 text-white'
                            : 'bg-dark-lighter text-gray-400 hover:text-gray-100'
                        }`}
                >
                    Finished
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {filteredTournaments.map((tournament) => {
                    if (!tournament || !tournament.metadata) return null

                    return (
                        <div key={tournament.id} className="card group">
                            {tournament.metadata.tournament_banner && (
                                <div className="relative h-48 mb-4 rounded-lg overflow-hidden">
                                    <img
                                        src={`${tournament.metadata.tournament_banner.imgix_url}?w=800&h=400&fit=crop&auto=format,compress`}
                                        alt={tournament.title}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-dark via-transparent to-transparent"></div>
                                    {tournament.metadata.status && (
                                        <div className="absolute top-4 right-4">
                                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(tournament.metadata.status.key)}`}>
                                                {tournament.metadata.status.value}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            )}

                            <h3 className="text-2xl font-bold mb-2">{tournament.title}</h3>
                            <div className="grid grid-cols-2 gap-4 mb-4">
                                {tournament.metadata.start_date && (
                                    <div>
                                        <div className="text-xs text-gray-400 mb-1">Start Date</div>
                                        <div className="text-sm font-medium">
                                            {format(new Date(tournament.metadata.start_date), 'MMM dd, yyyy')}
                                        </div>
                                    </div>
                                )}
                                {tournament.metadata.end_date && (
                                    <div>
                                        <div className="text-xs text-gray-400 mb-1">End Date</div>
                                        <div className="text-sm font-medium">
                                            {format(new Date(tournament.metadata.end_date), 'MMM dd, yyyy')}
                                        </div>
                                    </div>
                                )}
                            </div>
                            {tournament.metadata.prize_pool && (
                                <div className="mb-4">
                                    <div className="text-xs text-gray-400 mb-1">Prize Pool</div>
                                    <div className="text-2xl font-bold gradient-text">
                                        {tournament.metadata.prize_pool}
                                    </div>
                                </div>
                            )}
                            <div className="flex items-center justify-between mb-4">
                                {tournament.metadata.participants_count !== undefined && tournament.metadata.max_participants && (
                                    <div>
                                        <div className="text-xs text-gray-400 mb-1">Participants</div>
                                        <div className="text-sm font-medium">
                                            {tournament.metadata.participants_count} / {tournament.metadata.max_participants}
                                        </div>
                                    </div>
                                )}
                                {tournament.metadata.winner && (
                                    <div className="text-right">
                                        <div className="text-xs text-gray-400 mb-1">Winner</div>
                                        <div className="text-sm font-bold text-yellow-400">
                                            {tournament.metadata.winner}
                                        </div>
                                    </div>
                                )}
                            </div>
                            {tournament.metadata.content && (
                                <div
                                    className="text-gray-300 text-sm mb-4"
                                    dangerouslySetInnerHTML={{ __html: tournament.metadata.content }}
                                />
                            )}
                            {tournament.metadata.registration_link && tournament.metadata.status?.key !== 'finished' && (
                                <a
                                    href={tournament.metadata.registration_link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="btn btn-primary w-full text-center"
                                >
                                    Register Now
                                </a>
                            )}
                        </div>
                    )
                })}
            </div>

            {filteredTournaments.length === 0 && (
                <div className="text-center py-12">
                    <p className="text-gray-400">No tournaments found</p>
                </div>
            )}
        </div>
    )
}