# Bugged Night Dashboard

Este proyecto es un **Single Page Application (SPA)** desarrollado en **React** y utiliza **Cosmic CMS** como backend para la gestión de contenido dinámico. El dashboard permite visualizar y administrar información sobre personajes, rankings, torneos, mapas, noticias, notas de parches y FAQs del juego multijugador Bugged Night.

## Características

- **React SPA:** Navegación rápida y fluida entre páginas usando React Router.
- **Cosmic CMS:** Integración con Cosmic para obtener y administrar datos como personajes, torneos, rankings, noticias, mapas y FAQs.
- **TailwindCSS:** Estilos modernos y responsivos.
- **Gráficos:** Visualización de datos con Chart.js y react-chartjs-2.
- **Animaciones:** Transiciones y efectos con Framer Motion.
- **Comentarios:** Sistema de comentarios conectado a Cosmic.
- **Formulario de contacto:** Envío de mensajes y notificaciones por email también conectado a Cosmic.

## Estructura del Proyecto

- `/src`: Código principal de la aplicación React.
- `/cosmic`: Componentes y utilidades relacionados con la integración de Cosmic CMS (Comentarios se integró en _src/_).
- `/public`: Archivos estáticos.
- `/pages`: Vistas principales (Home, Characters, Rankings, Tournaments, PatchNotes, Maps, FAQs, ContactForm).
- `/components`: Componentes reutilizables (Navigation, Footer, Loading, ErrorMessage, Carrusel, Comments, etc).

## Screenshots sobre el Dashboard de Cosmic

**Vista general del dashboard**
![vista general del dashboard](/screenshots/4.png)

**Marketplace de plugins propio de Cosmic**
![marketplace para encontrar plugins](/screenshots/2.png)

**Instalación de plugin**
![pasos para instalar un plugin](/screenshots/1.png)

**Object types para la información al no usar una base de datos como tal**
![lista de object types](/screenshots/3.png)

**Listado de objetos**
![descripcion](/screenshots/6.png)

**Panel de creación/edición de contenido**
![panel de creacion o edicion de contenido](/screenshots/5.png)
