# School Manager - Frontend

Aplicación frontend para el sistema de gestión escolar (LMS). Construida con un enfoque en **buenas prácticas, rendimiento y diseño atómico**.

## Stack Tecnológico
- **Core:** React 19 + Vite
- **Estilos:** TailwindCSS v4
- **Enrutamiento:** React Router v7
- **Peticiones HTTP:** Axios (con interceptores y cliente centralizado)

## Arquitectura (Diseño Atómico)
La UI está estructurada siguiendo el patrón de Atomic Design para garantizar la reutilización de componentes:
- **Atoms:** Componentes indivisibles (Botones, Inputs).
- **Molecules:** Combinación de átomos (Tarjetas, Formularios pequeños).
- **Organisms:** Secciones completas de la interfaz (Tablas complejas, Header, Listados).
- **Pages:** Vistas completas asociadas a una ruta específica.

## Patrón Container-Presentational
La capa visual y la capa de datos están estrictamente separadas:
- Las peticiones a la API viven exclusivamente en la carpeta `/src/api`.
- Los componentes de UI solo reciben datos y disparan eventos, no conocen la lógica de red.

## Instalación y Uso
1. Instalar dependencias: `npm install`
2. Configurar variables de entorno: Copiar `.env.template` a `.env` (si existe) o crear `.env` basado en la documentación.
3. Levantar servidor de desarrollo: `npm run dev`
