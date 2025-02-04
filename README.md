# 📝 Todo App

A powerful and feature-rich Todo application built with the **T3 Stack** (Next.js, tRPC, Prisma, Tailwind, TypeScript) featuring authentication, board management, custom states, real-time updates, and more!

## 🚀 Features

- 🔐 **Authentication**: OAuth login using NextAuth.js (Google, GitHub, etc.)
- 🗂 **Multiple Boards**: Create and manage multiple Todo boards
- 📌 **Custom States**: Define unique states per board
- 🔄 **State Transitions**: Trigger events when moving todos between states
- 🏗 **Role-Based Access**: Invite users with different permissions (owner, editor, viewer)
- 🔴 **Live Updates**: WebSocket-based real-time updates
- 🎨 **Theming**: Dark/Light mode support with `next-themes`
- ✅ **E2E Testing**: Fully tested using Playwright or Cypress

---

## 🛠 Tech Stack

- **Frontend**: [Next.js](https://nextjs.org/), [tRPC](https://trpc.io/), [TailwindCSS](https://tailwindcss.com/)
- **Backend**: [Prisma](https://www.prisma.io/), [NextAuth.js](https://next-auth.js.org/)
- **UI Components**: [ShadCN](https://ui.shadcn.com/), [Framer Motion](https://www.framer.com/motion/)
- **Database**: PostgreSQL (via Prisma ORM)

---

## 📌 Roadmap

### Phase 1: Project Setup ✅

- [x] Initialize Next.js with TypeScript
- [x] Setup Prisma and database models
- [x] Configure NextAuth.js for OAuth authentication

### Phase 2: Core Features 🚧

- [ ] Implement CRUD operations for Boards
- [ ] Allow custom states per Board
- [ ] Create Todos and manage their state transitions
- [ ] Implement drag-and-drop for task organization

### Phase 3: Advanced Features 🔥

- [ ] Add WebSocket-based real-time updates (tRPC subscriptions)
- [ ] Implement user permissions & role-based access control
- [ ] Add event triggers on state transitions (e.g., webhooks, notifications)
- [ ] UI improvements with Framer Motion animations

### Phase 4: Optimization & Deployment 🎯

- [ ] Write E2E tests with Cypress or Playwright
- [ ] Add Dark/Light mode support
- [ ] Deploy to Vercel with CI/CD pipeline

---

## 📂 Project Structure

```bash
📦 todo-app
 ┣ 📂 src
 ┃ ┣ 📂 pages         # Next.js pages
 ┃ ┣ 📂 components    # UI components
 ┃ ┣ 📂 server        # tRPC API routes
 ┃ ┣ 📂 styles        # Tailwind styles
 ┃ ┗ 📂 lib         # Helpers & utilities
 ┣ 📜 .env            # Environment variables
 ┣ 📜 prisma/schema.prisma  # Prisma schema
 ┣ 📜 package.json    # Dependencies & scripts
 ┗ 📜 README.md       # Project documentation
```

---

## 🚀 Getting Started

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/yourusername/todo-app.git
cd todo-app
```

### 2️⃣ Install Dependencies

```bash
yarn install  # or npm install
```

### 3️⃣ Set Up Environment Variables

Create a `.env` file and add the required variables:

```env
DATABASE_URL=your_database_url
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_secret_key
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
```

### 4️⃣ Run the Application

```bash
yarn dev  # Start development server
```

---

## 🤝 Contributing

Contributions are welcome! Feel free to open an issue or submit a pull request.

---

## 📜 License

This project is licensed under the MIT License.
