# GPT Bypass - AI Text Rewriter

## Overview

GPT Bypass is a collaborative AI text rewriting application designed to transform AI-generated content to bypass detection tools. The system features Grok (Zhi 5) as the default AI provider with intelligent length-matching that ensures output maintains approximately the same length as input. Users can select from simplified Academic/Personal style options, upload documents, and process text through AI-powered rewriting.

## Recent Changes (November 2025)

**Simplified Style System with Length Matching (November 25, 2025)**
- Replaced all previous style samples with just TWO options: Academic and Personal
- Style samples loaded from server/data/academic-style.txt and server/data/personal-style.txt
- Implemented intelligent length-matching: server extracts a portion of the style sample matching the input word count
- Added explicit length preservation in AI prompts: output keeps approximately the same word count as input (+/- 10%)
- Updated UI to 3-column layout with style selection via dropdown in left sidebar
- Uses styleId instead of styleText throughout the application

**Grok (Zhi 5) as Default Provider (November 25, 2025)**
- Changed default AI provider from Anthropic to Grok (xAI)
- XAI_API_KEY configured for Grok API access
- Updated header to show "Zhi 5" as the selected provider by default
- Maintains full multi-provider support (OpenAI, Anthropic, DeepSeek, Perplexity, Grok)

**API Keys Button Removed (November 25, 2025)**
- Removed API Keys button from header per user request
- Simplified header UI focusing on provider selection and video instructions

**Database Integration (October 21, 2025)**
- PostgreSQL database provisioned with Neon serverless connection
- DATABASE_URL environment variable configured
- Database tables created: users, documents, rewrite_jobs
- Ready to migrate from MemStorage to DatabaseStorage when needed
- Schema successfully pushed using drizzle-kit

**UI/UX Improvements (October 21, 2025)**
- Dramatically increased text box sizes for better readability (calc(100vh - 300px) height, 600px minimum)
- Increased font size from 14px to 16px (text-base) across all text boxes
- Added relaxed line-height for improved text readability
- Set minimum content area height to 450px for each box (actual heights: Box A 435px, Box B 463px, Box C 463px, Box D 418px)
- Proper scrolling functionality implemented for long text content
- Successfully tested with end-to-end playwright verification

**Instructional Video Integration (October 11, 2025)**
- Added dedicated video instructions page at `/video-instructions` route
- Prominent "LINK TO INSTRUCTIONAL VIDEO" button in header with PlayCircle icon
- Embedded YouTube video (https://www.youtube.com/watch?v=PR0JX_Hrgqc) with responsive iframe
- 16:9 aspect ratio maintained with padding-bottom technique for all screen sizes
- Full YouTube player controls including fullscreen, quality selection, and playback speed
- Back navigation button returns users to main application
- Successfully tested: navigation flow, video playback, and responsive behavior

**GPTZero Integration Fixed (October 2, 2025)**
- Successfully updated GPTZero API key with proper authentication
- Confirmed API integration working with 32-character key format
- Text analysis returning accurate AI detection scores (tested with 100% AI content)
- Full pipeline operational: PDF upload → Text extraction → GPTZero analysis → AI rewriting → Output analysis

**PDF Binary-Safe Processing (Confirmed Working)**
- Dedicated `/api/pdf/extract` endpoint using multer memory storage
- Clean text extraction using pdf-parse library
- Binary corruption issues fully resolved - PDFs display readable text
- "Completely de novo" implementation as required

**Advanced Preset System Implementation**
- Added comprehensive PRESET_TEXT mapping with 40+ precise rewrite instructions
- Implemented expandPresets function for combo preset handling ("Lean & Sharp", "Analytic")
- Created unified buildRewritePrompt function replacing individual provider prompt logic
- Added "Advanced Techniques" category with 8 sophisticated instructions:
  - Mixed cadence + clause sprawl, Asymmetric emphasis, One aside, Hedge twice
  - Local disfluency, Analogy injection, Topic snap, Friction detail
- All AI providers now use consistent prompt structure with proper preset integration
- Removed deprecated buildSystemPrompt method for cleaner codebase

**Default AI Provider Update**
- Changed default AI provider from OpenAI to Anthropic Claude Sonnet 4
- Updated both main interface and chat interface to default to Anthropic
- Maintains full multi-provider support (OpenAI, Anthropic, DeepSeek, Perplexity)

**Default Style Sample Configuration**
- Set "Formal and Functional Relationships" as the default style sample
- Automatically loads in style text box when application starts
- Pre-selected in the LeftSidebar dropdown for immediate use

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **React + TypeScript SPA**: Modern single-page application using React 18 with TypeScript for type safety
- **Vite Build System**: Fast development server and optimized production builds with HMR support
- **Styling**: Tailwind CSS with shadcn/ui components providing a consistent design system
- **State Management**: TanStack Query (React Query) for server state management and caching
- **Routing**: Wouter for lightweight client-side routing
- **Form Handling**: React Hook Form with Zod validation for type-safe form management

### Backend Architecture
- **Express.js API**: RESTful API server handling file uploads, text processing, and AI provider integrations
- **File Processing**: Multer-based file upload system supporting TXT, PDF, DOC/DOCX formats up to 50MB
- **Service Layer Pattern**: Modular services for file processing, text chunking, GPTZero integration, and AI provider management
- **Memory Storage**: In-memory storage implementation with interface design for easy database migration
- **Middleware Stack**: Request logging, JSON parsing, and error handling middleware

### Data Architecture
- **Drizzle ORM**: Type-safe database toolkit with PostgreSQL support (configured but using memory storage currently)
- **Schema Design**: Well-defined schemas for users, documents, and rewrite jobs with proper relationships
- **Text Chunking**: Intelligent text segmentation for large documents (>500 words) with configurable overlap
- **Job Management**: Async rewrite job processing with status tracking and result storage

### AI Provider Integration
- **Default Provider**: Grok (Zhi 5) via xAI API - selected by default in the UI
- **Multi-Provider Support**: Unified interface for Grok, OpenAI GPT-4o, Anthropic Claude Sonnet 4, DeepSeek, and Perplexity
- **Model Configuration**: Latest model versions with proper fallback handling and error management  
- **Unified Prompt System**: Single buildRewritePrompt function ensures consistent prompt structure across all providers
- **Length Preservation in Prompts**: Explicit instructions to maintain approximately same word count as input (+/- 10%)
- **Advanced Preset Integration**: Comprehensive PRESET_TEXT mapping with expandable combo presets
- **Prompt Engineering**: Sophisticated prompt construction for style mimicking, content mixing, and granular instruction following
- **Rate Limiting**: Built-in error handling and retry logic for API failures

### Style System
- **Simplified Style Selection**: Two comprehensive style options only:
  - **Academic**: Professional academic writing style with formal tone and structure
  - **Personal**: Casual, conversational writing style for everyday communication
- **Intelligent Length Matching**: Server-side service extracts portion of style sample matching input word count
- **Length Preservation**: AI prompt explicitly instructs maintaining approximately same word count as input (+/- 10%)
- **Style Sample Files**: Full samples stored at server/data/academic-style.txt and server/data/personal-style.txt
- **Advanced Instruction Presets**: 40+ categorized rewrite instructions with sophisticated controls:
  - **Advanced Techniques**: Mixed cadence + clause sprawl, Asymmetric emphasis, One aside, Hedge twice, Local disfluency, Analogy injection, Topic snap, Friction detail
  - **Structure & Cadence**: Compression levels, Mixed cadence, Clause surgery, Front/back-load claims
  - **Framing & Inference**: Conditional framing, Local contrast, Scope check, Imply steps
  - **Voice & Style**: Low-heat voice, Hedge controls, Intensifier removal, Concrete benchmarks
  - **Content Control**: Quote management, Claim/entity locks, Exact nouns, Metric nudges
- **Combo Presets**: "Lean & Sharp" and "Analytic" automatically expand to atomic instructions
- **Custom Instructions**: User-defined rewrite instructions with preset combination support
- **Style Analysis**: GPTZero integration for analyzing both input and reference texts

### File Processing Pipeline
- **Multi-Format Support**: Handles TXT, PDF, and Word documents with appropriate parsing
- **Content Extraction**: Clean text extraction maintaining document structure
- **Word Count Analysis**: Accurate word counting for chunking decisions
- **Temporary File Management**: Secure file handling with automatic cleanup

## External Dependencies

### AI Services
- **OpenAI API**: GPT-4o model for text rewriting with configurable parameters
- **Anthropic API**: Claude Sonnet 4 integration for alternative AI processing
- **GPTZero API**: AI detection scoring service for input and output analysis
- **DeepSeek & Perplexity**: Additional AI provider support (configured for future implementation)

### Database
- **PostgreSQL**: Configured via Neon Database serverless connection (ready for production)
- **Drizzle Kit**: Database migration and schema management tools

### File Processing
- **PDF Processing**: PDF parsing capabilities for document upload support
- **Word Document Processing**: DOC/DOCX file parsing and text extraction

### UI Framework
- **Radix UI**: Comprehensive component primitives for accessible interface elements
- **Lucide Icons**: Modern icon library for consistent visual elements
- **Font Awesome**: Additional icon support for specialized interface elements

### Development Tools
- **TypeScript**: Full type safety across frontend and backend
- **ESBuild**: Fast bundling for production server builds
- **Replit Integration**: Development environment optimization and deployment support