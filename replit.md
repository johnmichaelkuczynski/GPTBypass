# GPT Bypass - AI Text Rewriter

## Overview

GPT Bypass is a comprehensive AI text rewriting application designed to transform AI-generated content to bypass detection tools. The system provides surgical style mimicking capabilities using multiple AI providers (OpenAI, Anthropic, DeepSeek, Perplexity) and integrates with GPTZero for AI detection scoring. Users can upload documents, apply style samples, customize rewrite instructions, and process text through intelligent chunking for large documents.

## Recent Changes (January 2025)

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
- **Multi-Provider Support**: Unified interface for OpenAI GPT-4o, Anthropic Claude Sonnet 4, DeepSeek, and Perplexity
- **Model Configuration**: Latest model versions with proper fallback handling and error management  
- **Unified Prompt System**: Single buildRewritePrompt function ensures consistent prompt structure across all providers
- **Advanced Preset Integration**: Comprehensive PRESET_TEXT mapping with expandable combo presets
- **Prompt Engineering**: Sophisticated prompt construction for style mimicking, content mixing, and granular instruction following
- **Rate Limiting**: Built-in error handling and retry logic for API failures

### Style System
- **Categorized Samples**: Writing sample collection organized by category with scalable architecture:
  - **Paradoxes** (26 samples): Classical paradoxes including Hilbert-Bernays, Heterological, Sorites, Coin, Analysis, Barber, Unexpected Hanging, Ross's, Lottery, Slacker's, Economic Efficiency, Raven, Riddle of Induction, and more
  - **Epistemology** (4 samples): Rational belief analysis, Hume's problem of induction with explanation theory, explanatory goodness vs correctness, and knowledge vs awareness distinctions
  - **Content-Neutral** (2 samples): General analytical writing on formal and functional relationships, and alternative accounts with explanatory efficiency
- **Scalable Sample UI**: Category-based dropdown interface with sample counts, designed to handle thousands of samples efficiently
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