# Wanderlist 🌍

**Transform your family travel planning into a beautiful story**

Wanderlist treats each trip like a chapter in your family's adventure book. No more boring checklists — just meaningful narratives of your family's journey through the world.

## ✨ What's Wanderlist?

Wanderlist is a family travel planning app that transforms trip planning into a beautiful storytelling experience. Instead of boring checklists, Wanderlist treats each trip like a chapter in your family's adventure book.

**Current Experience:**
- **Create Trips** - Add trips with title, dates, and personal notes
- **Beautiful Cards** - Each trip displays as a narrative card with dates and notes
- **Persistent Storage** - All trips saved locally in your browser
- **Smart Validation** - Real-time form validation with helpful error messages
- **Responsive Design** - Works beautifully on desktop and mobile

**Coming Soon:**
- **Narrative Stages** - Progress from "Daydreams" → "Quests" → "Tales"
- **Memory Mode** - Timeline view of your family's completed adventures
- **Photo Integration** - Add photos and sketches to trip memories
- **Family Sharing** - Share adventures with loved ones

### 🎯 Key Features

- **✅ Trip Creation Form** - Create trips with title, dates, and notes
- **✅ Data Persistence** - Trips saved to browser localStorage
- **✅ Form Validation** - Real-time validation with helpful error messages
- **✅ Trip Cards** - Beautiful, responsive trip display cards
- **✅ Dashboard** - Complete trip management with grid layout and modal forms
- **Daydreams, Quests & Tales** - Narrative trip progression (coming soon)
- **Story Cards** - Rich trip information with photos and notes (coming soon)
- **Memory Mode** - Timeline view of completed family adventures (coming soon)
- **Family Sparks** - Quick inspiration capture (coming soon)
- **At-a-Glance Dashboard** - Whimsical progress overview (coming soon)

## 🚀 Current Status

### ✅ **Completed: Full Trip Management System**
- **Trip Data Types** - Complete TypeScript interfaces and validation
- **localStorage Integration** - Persistent trip storage with error handling
- **Trip Creation Form** - Full-featured form with validation and error handling
- **Trip Card Display** - Beautiful, responsive trip cards with narrative styling
- **Dashboard Integration** - Complete dashboard with trip grid, modal forms, and loading states
- **Comprehensive Testing** - 90+ tests covering all components and interactions
- **Validation System** - Robust input validation with accessibility features
- **User Experience** - Real-time error clearing, form reset, and character counters

### 🔄 **Next: Phase 2 - Narrative Magic & Memory Features**
- **Narrative Stages System** - Daydreams → Quests → Tales progression
- **Memory Mode Timeline** - Beautiful timeline of completed adventures
- **Family Sparks** - Quick inspiration capture and mood board
- **Enhanced Dashboard** - Progress visualization and family insights
- **Photo Integration** - Trip photos and family memories
- **Family Sharing** - Share adventures with loved ones

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
│   ├── instructions/         # Core development workflows
│   ├── product/              # Mission, roadmap, tech stack
│   ├── specs/                # Feature specifications
│   └── standards/            # Code style and best practices
├── app/                      # Next.js app directory
│   ├── globals.css          # Global styles
│   ├── layout.tsx           # Root layout
│   └── page.tsx             # Home page
├── lib/                      # Core business logic
│   ├── __tests__/           # Business logic tests
│   ├── trip.ts              # Trip data types and storage
│   └── utils.ts             # Utility functions
├── components/               # React components
│   ├── __tests__/           # Component tests
│   ├── ui/                  # shadcn/ui components
│   ├── Dashboard.tsx        # Main dashboard with trip management
│   ├── TripForm.tsx         # Trip creation form (32 tests)
│   └── TripCard.tsx         # Trip display card component
├── public/                   # Static assets
├── *.config.*               # Configuration files
└── AGENTS.md                # Agent OS integration guide
```

## 🎨 Development Roadmap

### Phase 1: Core Trip Planning Foundation ✅ **COMPLETED**
- [x] Trip data types and storage layer
- [x] Trip creation form component
- [x] Trip card display component
- [x] Dashboard integration
- [x] Form validation and error handling
- [x] Comprehensive testing (90+ tests)
- [x] Accessibility features and UX polish

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
