import { useState, useEffect, useRef } from 'react'
import { cosmic, hasStatus } from '../lib/cosmic'
import { Character, CharacterRole } from '../types'
import Loading from '../components/Loading'
import ErrorMessage from '../components/ErrorMessage'

import { motion, useMotionTemplate, useMotionValue, useSpring } from "framer-motion"

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

  const filteredCharacters =
    selectedRole === 'all'
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


  const TiltCard = ({ children }: { children: React.ReactNode }) => {
    const ref = useRef<HTMLDivElement>(null)
    const ROTATION_RANGE = 32.5
    const HALF_ROTATION_RANGE = ROTATION_RANGE / 2

    const x = useMotionValue(0)
    const y = useMotionValue(0)

    const xSpring = useSpring(x)
    const ySpring = useSpring(y)

    const transform = useMotionTemplate`rotateX(${xSpring}deg) rotateY(${ySpring}deg)`

    const handleMouseMove = (e: React.MouseEvent) => {
      if (!ref.current) return

      const rect = ref.current.getBoundingClientRect()
      const width = rect.width
      const height = rect.height

      const mouseX = (e.clientX - rect.left) * ROTATION_RANGE
      const mouseY = (e.clientY - rect.top) * ROTATION_RANGE

      const rX = (mouseY / height - HALF_ROTATION_RANGE) * -1
      const rY = mouseX / width - HALF_ROTATION_RANGE

      x.set(rX)
      y.set(rY)
    }

    const handleMouseLeave = () => {
      x.set(0)
      y.set(0)
    }

    return (
      <motion.div
        ref={ref}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          transformStyle: "preserve-3d",
          transform,
        }}
        className="card group cursor-pointer"
      >
        {children}
      </motion.div>
    )
  }

  // group-hover:scale-110 transition-transform duration-300

  return (
    <div className="space-y-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold gradient-text mb-4">
          Personajes
        </h1>
        <p className="text-gray-400 text-lg">
          Conocé a los personajes disponibles del juego
        </p>
      </div>

      <div className="flex justify-center gap-4 flex-wrap">
        {['all', 'assassin', 'hunter', 'survivor'].map((role) => (
          <button
            key={role}
            onClick={() => setSelectedRole(role as CharacterRole | 'all')}
            className={`px-6 py-2 rounded-lg font-medium transition-all duration-200 ${selectedRole === role
              ? role === 'assassin'
                ? 'bg-red-500 text-white'
                : role === 'hunter'
                  ? 'bg-secondary text-white'
                  : role === 'survivor'
                    ? 'bg-accent text-white'
                    : 'bg-primary text-white'
              : 'bg-dark-lighter text-gray-400 hover:text-gray-100'
              }`}
          >
            {role === 'all'
              ? 'All'
              : role.charAt(0).toUpperCase() + role.slice(1)}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCharacters.map((character) => {
          if (!character || !character.metadata) return null

          return (
            <TiltCard key={character.id}>

              {character.metadata.character_image && (
                <div className="relative h-64 mb-4 rounded-lg overflow-hidden">
                  <img
                    src={`${character.metadata.character_image.imgix_url}?w=600&h=400&fit=crop&auto=format,compress`}
                    alt={character.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-dark via-transparent to-transparent"></div>
                  <div className="absolute bottom-4 left-4">
                    <h3 className="text-2xl font-bold mb-1">{character.title}</h3>
                    {character.metadata.role && (
                      <span
                        className={`text-sm font-medium ${getRoleColor(
                          character.metadata.role.key
                        )}`}
                      >
                        {character.metadata.role.value}
                      </span>
                    )}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">
                    {character.metadata.health_points || 0}
                  </div>
                  <div className="text-xs text-gray-400">HP</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-secondary">
                    {character.metadata.speed || 0}
                  </div>
                  <div className="text-xs text-gray-400">Velocidad</div>
                </div>
                <div className="text-center">
                  <div className="text-lg text-yellow-400">
                    {getDifficultyStars(character.metadata.difficulty?.key)}
                  </div>
                  <div className="text-xs text-gray-400">Dificultad</div>
                </div>
              </div>

              {character.metadata.special_ability && (
                <div className="mb-4">
                  <h4 className="text-sm font-semibold text-primary mb-2">
                    Habilidad Especial
                  </h4>
                  <p className="text-sm text-gray-300">
                    {character.metadata.special_ability}
                  </p>
                </div>
              )}


              {character.metadata.skills &&
                character.metadata.skills.length > 0 && (
                  <div className="mb-4">
                    <h4 className="text-sm font-semibold text-secondary mb-2">
                      Habilidades
                    </h4>
                    <div className="space-y-2">
                      {character.metadata.skills.map((skill, index) => (
                        <div key={index} className="text-sm">
                          <div className="flex justify-between items-center">
                            <span className="font-medium text-gray-200">
                              {skill.name}
                            </span>
                            <span className="text-xs text-gray-400">
                              {skill.cooldown}
                            </span>
                          </div>
                          <p className="text-xs text-gray-400">
                            {skill.description}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              {character.metadata.available_skins &&
                character.metadata.available_skins.length > 0 && (
                  <div>
                    <h4 className="text-sm font-semibold text-accent mb-2">
                      Skins Disponibles
                    </h4>
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
            </TiltCard>
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
