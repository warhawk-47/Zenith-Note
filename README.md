# Zenith Notes

[cloudflarebutton]

A visually stunning, minimalist, and high-performance note-taking application built on Cloudflare's edge network.

## About The Project

Zenith Notes is a beautifully crafted, minimalist note-taking application designed for clarity, focus, and speed. Built on Cloudflare's edge network, it offers a lightning-fast, seamless experience. The application features a clean, two-panel interface: a sidebar for listing, searching, and managing notes, and a main content area for a distraction-free writing experience. The entire user experience is enhanced with subtle micro-interactions and smooth animations, making note-taking a delightful and productive activity.

### Key Features

*   **Minimalist Interface:** A clean, two-panel layout designed for a distraction-free writing experience.
*   **High Performance:** Built on Cloudflare Workers and Durable Objects for a lightning-fast, seamless experience.
*   **Real-time Search:** Instantly filter and find notes as you type.
*   **Auto-Saving:** Notes are saved automatically with clear visual feedback, so you never lose your work.
*   **Fully Responsive:** A flawless layout that adapts perfectly from large desktops to mobile devices.
*   **Polished UX:** Enhanced with subtle micro-interactions and smooth animations for a delightful user experience.

## Technology Stack

This project is built with a modern, full-stack TypeScript architecture.

*   **Frontend:**
    *   [React](https://react.dev/)
    *   [Vite](https://vitejs.dev/)
    *   [Tailwind CSS](https://tailwindcss.com/)
    *   [shadcn/ui](https://ui.shadcn.com/)
    *   [Zustand](https://zustand-demo.pmnd.rs/) for state management
    *   [Framer Motion](https://www.framer.com/motion/) for animations
    *   [Lucide React](https://lucide.dev/) for icons
*   **Backend:**
    *   [Cloudflare Workers](https://workers.cloudflare.com/)
    *   [Hono](https://hono.dev/)
    *   [Cloudflare Durable Objects](https://developers.cloudflare.com/durable-objects/) for stateful storage
*   **Language:** [TypeScript](https://www.typescriptlang.org/)

## Getting Started

Follow these instructions to get a local copy up and running for development and testing purposes.

### Prerequisites

*   [Node.js](https://nodejs.org/) (v18 or later)
*   [Bun](https://bun.sh/)
*   [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/install-and-update/)

### Installation

1.  **Clone the repository:**
    ```sh
    git clone https://github.com/your-username/zenith-notes.git
    cd zenith-notes
    ```

2.  **Install dependencies:**
    This project uses `bun` for package management.
    ```sh
    bun install
    ```

### Running Locally

To start the development server, which includes the Vite frontend and the local Wrangler server for the backend, run:

```sh
bun dev
```

The application will be available at `http://localhost:3000` (or the port specified in your environment).

## Project Structure

The codebase is organized into three main directories:

*   `src/`: Contains the entire React frontend application, including pages, components, hooks, and the Zustand store.
*   `worker/`: Contains the Cloudflare Worker backend code, including Hono API routes (`user-routes.ts`) and Durable Object entity definitions (`entities.ts`).
*   `shared/`: Contains TypeScript types and mock data that are shared between the frontend and backend to ensure type safety.

## Deployment

This application is designed for easy deployment to the Cloudflare network.

1.  **Log in to Wrangler:**
    If you haven't already, authenticate the Wrangler CLI with your Cloudflare account.
    ```sh
    wrangler login
    ```

2.  **Deploy the application:**
    Run the deploy script, which will build the application and deploy it to your Cloudflare account.
    ```sh
    bun deploy
    ```

Alternatively, you can deploy directly from your GitHub repository with a single click.

[cloudflarebutton]

## Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

## License

Distributed under the MIT License. See `LICENSE` for more information.