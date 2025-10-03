import { Link, useLocation } from 'react-router-dom'

export default function Navigation() {
    const location = useLocation()

    const isActive = (path: string) => {
        return location.pathname === path
            ? 'text-primary border-b-2 border-primary'
            : 'text-gray-400 hover:text-gray-100'
    }

    return (
        <nav className="bg-dark-lighter border-b border-dark-border">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between h-16">
                    <Link to="/" className="flex items-center space-x-2">
                        <span className="text-2xl font-bold gradient-text">Bugged Night</span>
                    </Link>

                    <div className="hidden md:flex space-x-8">
                        <Link to="/" className={`${isActive('/')} transition-colors duration-200 py-4`}>
                            Inicio
                        </Link>
                        <Link to="/characters" className={`${isActive('/characters')} transition-colors duration-200 py-4`}>
                            Personajes
                        </Link>
                        <Link to="/rankings" className={`${isActive('/rankings')} transition-colors duration-200 py-4`}>
                            Rankings
                        </Link>
                        <Link to="/tournaments" className={`${isActive('/tournaments')} transition-colors duration-200 py-4`}>
                            Torneos
                        </Link>
                        <Link to="/patch-notes" className={`${isActive('/patch-notes')} transition-colors duration-200 py-4`}>
                            Notas del Parche
                        </Link>
                        <Link to="/maps" className={`${isActive('/maps')} transition-colors duration-200 py-4`}>
                            Mapas
                        </Link>
                        <Link to="/contactform" className={`${isActive('/maps')} transition-colors duration-200 py-4`}>
                            Contacto
                        </Link>
                        <Link to="/faqs" className={`${isActive('/maps')} transition-colors duration-200 py-4`}>
                            FAQs
                        </Link>
                    </div>

                    <div className="md:hidden">
                        <button className="text-gray-400 hover:text-gray-100">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    )
}