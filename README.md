# Policy Document Inconsistency Analyzer

A modern web application built with Next.js 14, TypeScript, and Tailwind CSS for analyzing policy document inconsistencies and reviewing extracted facts.

## Features

### 📊 Dashboard Overview

- **Total Facts**: Displays the total number of extracted facts
- **Inconsistent Facts**: Shows facts with conflicting values across documents
- **Consistent Facts**: Shows facts with consistent values
- **Consistency Rate**: Calculates the percentage of consistent facts

### 🔍 Advanced Filtering

- **All Facts**: View all extracted facts
- **Inconsistencies**: Filter to show only conflicting facts
- **Consistent Facts**: Filter to show only consistent facts
- **Search**: Search across fact names, values, documents, and context

### 📋 Interactive Fact Cards

- **Expandable Cards**: Click to expand and view detailed fact information
- **Status Indicators**: Visual indicators for consistent (✅) and inconsistent (⚠️) facts
- **Source Information**: View document source, reference, and context
- **Document Viewer**: Click to open source documents with highlighting

### 📄 Document Viewer

- **Modal Interface**: Clean modal for viewing source documents
- **Fact Highlighting**: Highlights the specific sentence containing the fact
- **Context Information**: Shows full context and reference information
- **Responsive Design**: Works on desktop and mobile devices

## Technology Stack

- **Frontend**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Custom components with Radix UI primitives
- **Icons**: Lucide React
- **Data Processing**: Client-side processing of JSON data

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd policy-fact-analyzer
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Data Structure

The application expects a `factIndex.json` file in the `public/` directory with the following structure:

```json
{
  "fact_key": [
    {
      "value": "Fact value",
      "document_title": "document.md",
      "fact_name": "Human readable fact name",
      "source_sentence": "Original sentence from document",
      "context": "Additional context",
      "reference": "Document reference/section"
    }
  ]
}
```

## Key Components

### Dashboard Stats

- Displays key metrics about the policy analysis
- Shows consistency rates and fact counts
- Provides visual indicators for different fact types

### Filter Tabs

- Allows filtering between all facts, inconsistencies, and consistent facts
- Shows count badges for each category
- Responsive design with clear visual feedback

### Fact Cards

- Expandable cards showing detailed fact information
- Status indicators and badges
- Interactive buttons for document viewing
- Responsive grid layout

### Document Viewer

- Modal interface for viewing source documents
- Highlights specific fact sentences
- Shows full context and reference information
- Clean, accessible design

## Features in Detail

### Inconsistency Detection

The application automatically detects inconsistencies by:

- Grouping facts by their key
- Identifying facts with multiple values
- Flagging conflicting information across documents

### Search Functionality

Search works across:

- Fact names
- Fact values
- Document titles
- Context information
- Source sentences

### Responsive Design

- Mobile-first approach
- Responsive grid layouts
- Touch-friendly interactions
- Accessible design patterns

## Development

### Project Structure

```
src/
├── app/                 # Next.js app router pages
├── components/          # React components
│   ├── ui/             # Reusable UI components
│   └── ...             # Feature-specific components
├── lib/                # Utility functions and data processing
├── types/              # TypeScript type definitions
└── ...
```

### Key Files

- `src/app/page.tsx` - Main application page
- `src/lib/data-processor.ts` - Data processing logic
- `src/types/index.ts` - TypeScript type definitions
- `public/factIndex.json` - Source data file

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.
