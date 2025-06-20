# Antenna EM-Field Visualizer

A client-only web application to visualize the 3D electromagnetic-field radiation patterns of common antennas. The app is built with pure HTML, CSS, and JavaScript (ES Modules), using Three.js for 3D rendering.

**Live Demo: [https://antenna-em-visualizer.netlify.app/](https://antenna-em-visualizer.netlify.app/)**

## Features

-   **Real-time Visualization**: Instantly see 3D radiation patterns.
-   **Interactive Controls**: Adjust antenna parameters and view settings on the fly.
-   **Multiple Antenna Types**:
    -   Half-Wave Dipole
    -   Monopole over Ground
    -   Rectangular Patch
    -   Parabolic Dish
    -   3-Element Yagi-Uda
-   **Multiple View Modes**: Render patterns as a solid surface or a point cloud.
-   **Dynamic UI**: The control panel automatically updates for the selected antenna.
-   **Responsive Design**: Works on both desktop and mobile devices.
-   **PNG Export**: Save a snapshot of the current visualization.
-   **Zero Build Step**: Runs directly in any modern browser from a static file server.

## Tech Stack

-   **3D Graphics**: [Three.js](https://threejs.org/) (loaded via local copy)
-   **UI**: Plain HTML and CSS, no frameworks.
-   **Language**: JavaScript (ES2020+ Modules)
-   **Styling**: Pure CSS with Custom Properties (dark-mode friendly).

## How to Run Locally

This project does not require any build tools like Webpack or Vite.

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd antenna-em-visualizer
    ```

2.  **Serve the `public` directory:**
    You need a local web server to handle the ES module imports correctly (due to browser security policies). The easiest way is to use `npx serve`.

    ```bash
    # Make sure you are in the project's root directory
    npx serve public
    ```
    If you don't have `npx`, you can use Python's built-in server:
    ```bash
    # Navigate into the public directory first
    cd public
    python3 -m http.server
    ```

3.  **Open your browser:**
    Navigate to the URL provided by the server (usually `http://localhost:3000` or `http://localhost:8000`).

## Project Structure
