# Wanderlist 🌍

**Transform your family travel planning into a beautiful story**

Wanderlist treats each trip like a chapter in your family's adventure book. No more boring checklists — just meaningful narratives of your family's journey through the world.

## ✨ What's Wanderlist?

Wanderlist is a family travel planning app that helps dads and parents organize trips with a storytelling approach. Instead of corporate-style "To Do/In Progress/Done" columns, Wanderlist uses "Daydreams," "Quests," and "Tales" to create emotional investment in family adventures.

### 🎯 Key Features

- **✅ Trip Creation Form** - Create trips with title, dates, and notes
- **✅ Data Persistence** - Trips saved to browser localStorage
- **✅ Form Validation** - Real-time validation with helpful error messages
- **Daydreams, Quests & Tales** - Narrative trip progression (coming soon)
- **Story Cards** - Rich trip information with photos and notes (coming soon)
- **Memory Mode** - Timeline view of completed family adventures (coming soon)
- **Family Sparks** - Quick inspiration capture (coming soon)
- **At-a-Glance Dashboard** - Whimsical progress overview (coming soon)

## 🚀 Current Status

### ✅ **Completed: Core Trip Creation**
- **Trip Data Types** - Complete TypeScript interfaces and validation
- **localStorage Integration** - Persistent trip storage with error handling
- **Trip Creation Form** - Full-featured form with validation and error handling
- **Comprehensive Testing** - 45+ tests covering data operations and form interactions
- **Validation System** - Robust input validation and user-friendly error messages

### 🔄 **In Progress: Trip Display & Dashboard**
- Trip card display components
- Dashboard integration
- Trip management interface
- User experience polish

## 🛠️ Tech Stack

- **Framework:** Next.js 15 with React 19
- **Language:** TypeScript
- **Styling:** Tailwind CSS with shadcn/ui components
- **Testing:** Jest + React Testing Library
- **Storage:** Browser localStorage (MVP)
- **Deployment:** Vercel

## 🏃‍♂️ Getting Started

### Prerequisites
- Node.js 18+
- pnpm (recommended) or npm

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd wanderlist
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   # or
   npm install
   ```

3. **Start development server**
   ```bash
   pnpm dev
   # or
   npm run dev
   ```

4. **Open your browser**
   - Navigate to [http://localhost:3000](http://localhost:3000)
   - The app will hot-reload as you make changes

### Testing

```bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Run tests for specific file
pnpm test -- lib/__tests__/trip.test.ts
```

## 📁 Project Structure

```
wanderlist/
├── .agent-os/                 # Agent OS documentation and specs
│   ├── product/              # Mission, roadmap, tech stack
│   └── specs/                # Feature specifications
├── app/                      # Next.js app directory
│   ├── globals.css          # Global styles
│   ├── layout.tsx           # Root layout
│   └── page.tsx             # Home page
├── lib/                      # Core business logic
│   ├── trip.ts              # Trip data types and storage
│   └── utils.ts             # Utility functions
├── components/               # React components
│   ├── TripForm.tsx         # Trip creation form
│   └── ui/                  # shadcn/ui components
├── public/                   # Static assets
└── *.config.*               # Configuration files
```

## 🎨 Development Roadmap

### Phase 1: Core Trip Planning Foundation (Current)
- [x] Trip data types and storage layer
- [x] Trip creation form component
- [ ] Trip card display component
- [ ] Dashboard integration
- [x] Form validation and error handling

### Phase 2: Narrative Magic & Memory Features
- [ ] Narrative stages system (Daydreams/Quests/Tales)
- [ ] Memory Mode timeline
- [ ] Family Sparks quick-add
- [ ] Enhanced progress dashboard

### Phase 3: Polish & Family Touch
- [ ] Photo and sketch integration
- [ ] Enhanced animations
- [ ] Mobile optimization
- [ ] Family sharing features

## 🤝 Contributing

This project uses **Agent OS** for structured development. Each feature follows a complete workflow:

1. **Planning** - Create detailed specifications
2. **Implementation** - TDD with comprehensive testing
3. **Review** - Code quality and functionality verification
4. **Integration** - Merge and deploy

### Development Workflow

1. Check the roadmap in `.agent-os/product/roadmap.md`
2. Create a feature spec using the Agent OS workflow
3. Implement with TDD approach
4. Run full test suite before committing
5. Update documentation as needed

## 📚 Learn More

- **[Agent OS Documentation](https://buildermethods.com/agent-os)** - Structured development workflow
- **[Next.js Documentation](https://nextjs.org/docs)** - Framework reference
- **[Tailwind CSS](https://tailwindcss.com/docs)** - Styling framework
- **[shadcn/ui](https://ui.shadcn.com/)** - Component library

## 🚀 Deployment

Deploy to Vercel with one click:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/your-username/wanderlist)

## 📄 License

This project is private and proprietary.

---

**Built with ❤️ for families who love to explore**

*Transforming travel planning from a chore into a cherished family story* 📖✨