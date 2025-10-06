import { useState, useEffect } from 'react'
import { cosmic, hasStatus } from '../lib/cosmic'
import { PlayerRanking, PlayerRegion } from '../types'
import Loading from '../components/Loading'
import ErrorMessage from '../components/ErrorMessage'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
import { Doughnut } from 'react-chartjs-2'

ChartJS.register(ArcElement, Tooltip, Legend)

export default function Rankings() {
  const [rankings, setRankings] = useState<PlayerRanking[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedRegion, setSelectedRegion] = useState<PlayerRegion | 'all'>('all')
  const [chartType, setChartType] = useState<"players" | "winrate" | "points">("players")

  useEffect(() => {
    fetchRankings()
  }, [])

  async function fetchRankings() {
    try {
      const response = await cosmic.objects
        .find({ type: 'player-rankings' })
        .props(['id', 'title', 'slug', 'metadata'])
        .depth(1)

      const sortedRankings = (response.objects as PlayerRanking[]).sort((a, b) => {
        const rankA = a.metadata?.rank_position || 999
        const rankB = b.metadata?.rank_position || 999
        return rankA - rankB
      })

      setRankings(sortedRankings)
    } catch (err) {
      if (hasStatus(err) && err.status === 404) {
        setRankings([])
      } else {
        setError('Failed to load rankings')
      }
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <Loading />
  if (error) return <ErrorMessage message={error} />

  const filteredRankings = selectedRegion === 'all'
    ? rankings
    : rankings.filter(rank => rank.metadata.region?.key === selectedRegion)

  const getRankColor = (position?: number) => {
    if (!position) return 'text-gray-400'
    if (position === 1) return 'text-yellow-400'
    if (position === 2) return 'text-gray-300'
    if (position === 3) return 'text-amber-600'
    return 'text-gray-400'
  }

  const getRankBadge = (position?: number) => {
    if (!position) return null
    if (position === 1) return '🥇'
    if (position === 2) return '🥈'
    if (position === 3) return '🥉'
    return null
  }

  const regions = ["na", "eu", "latam", "asia"]

  const playersPerRegion = regions.map((r) => ({
    label: r.toUpperCase(),
    value: rankings.filter((rk) => rk.metadata?.region?.key === r).length,
  }))

  const winratePerRegion = regions.map((r) => {
    const regionPlayers = rankings.filter((rk) => rk.metadata?.region?.key === r)
    const totalWins = regionPlayers.reduce((sum, rk) => sum + (rk.metadata?.total_wins || 0), 0)
    const totalMatches = regionPlayers.reduce((sum, rk) => sum + (rk.metadata?.total_matches || 0), 0)
    const winRate = totalMatches > 0 ? (totalWins / totalMatches) * 100 : 0
    return { label: r.toUpperCase(), value: parseFloat(winRate.toFixed(1)) }
  })

  const pointsPerRegion = regions.map((r) => {
    const totalPoints = rankings
      .filter((rk) => rk.metadata?.region?.key === r)
      .reduce((sum, rk) => sum + (rk.metadata?.points || 0), 0)
    return { label: r.toUpperCase(), value: totalPoints }
  })

  const colors = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444"]

  const chartData = {
    labels:
      chartType === "players"
        ? playersPerRegion.map((p) => p.label)
        : chartType === "winrate"
          ? winratePerRegion.map((w) => w.label)
          : pointsPerRegion.map((p) => p.label),
    datasets: [
      {
        data:
          chartType === "players"
            ? playersPerRegion.map((p) => p.value)
            : chartType === "winrate"
              ? winratePerRegion.map((w) => w.value)
              : pointsPerRegion.map((p) => p.value),
        backgroundColor: colors,
        borderColor: "#1f2937",
        borderWidth: 2,
      },
    ],
  }

  return (
    <div className="space-y-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold gradient-text mb-4">
          Rankings de Jugadores
        </h1>
        <p className="text-gray-400 text-lg">El top tier de los gloriosos</p>
      </div>
      <div className="flex justify-center gap-4 flex-wrap">
        <button
          onClick={() => setSelectedRegion('all')}
          className={`px-6 py-2 rounded-lg font-medium transition-all duration-200 ${selectedRegion === 'all'
            ? 'bg-primary text-white'
            : 'bg-dark-lighter text-gray-400 hover:text-gray-100'
            }`}
        >
          Todas las regiones
        </button>
        {['na', 'eu', 'latam', 'asia'].map((region) => (
          <button
            key={region}
            onClick={() => setSelectedRegion(region as PlayerRegion)}
            className={`px-6 py-2 rounded-lg font-medium transition-all duration-200 ${selectedRegion === region
              ? 'bg-primary text-white'
              : 'bg-dark-lighter text-gray-400 hover:text-gray-100'
              }`}
          >
            {region.toUpperCase()}
          </button>
        ))}
      </div>
      <div className="card overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-dark-border">
              <th className="text-left py-4 px-4">Ranngo</th>
              <th className="text-left py-4 px-4">Jugador</th>
              <th className="text-center py-4 px-4">Region</th>
              <th className="text-center py-4 px-4">Puntos</th>
              <th className="text-center py-4 px-4">Victorias</th>
              <th className="text-center py-4 px-4">Partidas</th>
              <th className="text-center py-4 px-4">Tasa de Victoria</th>
              <th className="text-left py-4 px-4">Personaje Favorito</th>
            </tr>
          </thead>
          <tbody>
            {filteredRankings.map((ranking) => {
              if (!ranking || !ranking.metadata) return null
              return (
                <tr
                  key={ranking.id}
                  className="border-b border-dark-border hover:bg-dark-lighter transition-colors duration-200"
                >
                  <td className="py-4 px-4">
                    <div className="flex items-center space-x-2">
                      <span className={`text-2xl font-bold ${getRankColor(ranking.metadata.rank_position)}`}>
                        {ranking.metadata.rank_position}
                      </span>
                      {getRankBadge(ranking.metadata.rank_position) && (
                        <span className="text-2xl">{getRankBadge(ranking.metadata.rank_position)}</span>
                      )}
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center space-x-3">
                      {ranking.metadata.player_avatar && (
                        <img
                          src={`${ranking.metadata.player_avatar.imgix_url}?w=80&h=80&fit=crop&auto=format,compress`}
                          alt={ranking.title}
                          className="w-10 h-10 rounded-full"
                        />
                      )}
                      <div>
                        <div className="font-semibold">{ranking.title}</div>
                        {ranking.metadata.season && (
                          <div className="text-xs text-gray-400">{ranking.metadata.season}</div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-center">
                    <span className="px-2 py-1 rounded text-xs bg-primary/20 text-primary">
                      {ranking.metadata.region?.value || 'N/A'}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-center">
                    <span className="font-semibold text-primary">
                      {ranking.metadata.points?.toLocaleString() || 0}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-center">
                    {ranking.metadata.total_wins?.toLocaleString() || 0}
                  </td>
                  <td className="py-4 px-4 text-center">
                    {ranking.metadata.total_matches?.toLocaleString() || 0}
                  </td>
                  <td className="py-4 px-4 text-center">
                    <span className="font-semibold text-secondary">
                      {ranking.metadata.win_rate ? `${ranking.metadata.win_rate.toFixed(1)}%` : '0%'}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    {ranking.metadata.favorite_character || 'N/A'}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
      <div className="flex justify-center gap-4 mt-12">
        <button
          onClick={() => setChartType("players")}
          className={`px-6 py-2 rounded-lg font-medium ${chartType === "players" ? "bg-primary text-white" : "bg-dark-lighter text-gray-400"
            }`}
        >
          Jugadores por Región
        </button>
        <button
          onClick={() => setChartType("winrate")}
          className={`px-6 py-2 rounded-lg font-medium ${chartType === "winrate" ? "bg-primary text-white" : "bg-dark-lighter text-gray-400"
            }`}
        >
          Win Rate por Región
        </button>
        <button
          onClick={() => setChartType("points")}
          className={`px-6 py-2 rounded-lg font-medium ${chartType === "points" ? "bg-primary text-white" : "bg-dark-lighter text-gray-400"
            }`}
        >
          Región con más Puntos
        </button>
      </div>

      <div className="max-w-2xl mx-auto">
        <Doughnut data={chartData} />
      </div>
    </div>
  )
}
