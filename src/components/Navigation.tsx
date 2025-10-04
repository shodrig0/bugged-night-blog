import { Link, useLocation } from "react-router-dom"
import { motion } from "framer-motion"

export default function Navigation() {
  const location = useLocation()

  const links = [
    { path: "/", label: "Inicio" },
    { path: "/characters", label: "Personajes" },
    { path: "/rankings", label: "Rankings" },
    { path: "/tournaments", label: "Torneos" },
    { path: "/patch-notes", label: "Notas del Parche" },
    { path: "/maps", label: "Mapas" },
    { path: "/contactform", label: "Contacto" },
    { path: "/faqs", label: "FAQs" },
  ]

  return (
    <nav className="bg-dark-lighter border-b border-dark-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-2xl font-bold gradient-text">
              Bugged Night
            </span>
          </Link>

          <div className="hidden md:flex space-x-4 relative">
            {links.map((link) => {
              const isActive = location.pathname === link.path
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`relative px-3 py-1 rounded-md text-sm font-medium transition-colors duration-200 ${
                    isActive
                      ? "text-white"
                      : "text-gray-400 hover:text-gray-100"
                  }`}
                >
                  <span className="relative z-10">{link.label}</span>
                  {isActive && (
                    <motion.span
                      layoutId="nav-pill"
                      transition={{ type: "spring", duration: 0.5 }}
                      className="absolute inset-0 z-0 bg-gradient-to-r from-violet-600 to-indigo-600 rounded-md"
                    />
                  )}
                </Link>
              )
            })}
          </div>

          {/* Mobile menu button (aún sin animación) */}
          <div className="md:hidden">
            <button className="text-gray-400 hover:text-gray-100">
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}
