// src/components/Footer.tsx
"use client"

import { Link } from "react-router-dom"
import { motion } from "framer-motion"

export default function Footer() {
    return (
        <footer className="relative mt-16 border-t border-dark-border bg-dark-lighter text-gray-300">
            <div className="mx-auto max-w-7xl px-6 py-10 lg:py-14">
                <div className="grid grid-cols-1 gap-10 md:grid-cols-3">
                    <div>
                        <h2 className="text-xl font-bold gradient-text mb-3">
                            Bugged Night
                        </h2>
                        <p className="text-sm text-gray-400 leading-relaxed">
                            Un survival game multijugador en desarrollo. <br />
                            Vive la tensión entre asesinos y sobrevivientes, con mapas dinámicos
                            y jugabilidad competitiva.
                        </p>
                    </div>
                    <div>
                        <ul className="flex flex-wrap gap-6">
                            <li>
                                <Link
                                    to="/"
                                    className="hover:text-white transition-colors duration-200"
                                >
                                    Home
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/personajes"
                                    className="hover:text-white transition-colors duration-200"
                                >
                                    Personajes
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/rankings"
                                    className="hover:text-white transition-colors duration-200"
                                >
                                    Rankings
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/notas-parche"
                                    className="hover:text-white transition-colors duration-200"
                                >
                                    Notas de Parche
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/torneos"
                                    className="hover:text-white transition-colors duration-200"
                                >
                                    Torneos
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/mapas"
                                    className="hover:text-white transition-colors duration-200"
                                >
                                    Mapas
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/contactform"
                                    className="hover:text-white transition-colors duration-200"
                                >
                                    Contacto
                                </Link>
                            </li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="text-sm font-semibold text-gray-200 uppercase mb-3">
                            Comunidad
                        </h3>
                        <div className="flex gap-4 text-lg">
                            <a
                                href="https://discord.gg/bugged-night"
                                target="_blank"
                                rel="noreferrer"
                                className="hover:text-primary"
                            >
                                Discord
                            </a>
                            <a
                                href="https://twitter.com/bugged-night"
                                target="_blank"
                                rel="noreferrer"
                                className="hover:text-primary"
                            >
                                Twitter
                            </a>
                            <a
                                href="https://github.com/bugged-night"
                                target="_blank"
                                rel="noreferrer"
                                className="hover:text-primary"
                            >
                                GitHub
                            </a>
                        </div>

                        <p className="mt-4 text-xs text-gray-500">
                            contact@buggednight.dev
                        </p>
                    </div>
                </div>
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="mt-10 border-t border-dark-border pt-6 text-center text-xs text-gray-500"
                >
                    © {new Date().getFullYear()} Bugged Night — Todos los derechos
                    reservados.
                </motion.div>
            </div>
        </footer>
    )
}
