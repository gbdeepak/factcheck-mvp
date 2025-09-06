// Comprehensive mapping table for document titles to actual .docx filenames
const DOCUMENT_MAPPING: Record<string, string> = {
  // Direct mappings
  'access_management_policy.md': 'Access Management Policy.docx',
  'antivirus_management_procedure.md': 'Antivirus Management Procedure.docx',
  'data_management_policy.md': 'Data Management Policy.docx',
  'disaster_recovery_plan.md': 'Disaster Recovery Plan.docx',
  'encryption_management.md': 'Encryption Management.docx',
  'information_security_policy.md': 'Information Security Policy.docx',
  'risk_management_assessment_and_treatment_policy.md': 'Risk Management Assessment and Treatment Policy.docx',
  'vendor_management_policy.md': 'Vendor Management Policy.docx',
  
  // Alternative mappings (without .md extension)
  'access_management_policy': 'Access Management Policy.docx',
  'antivirus_management_procedure': 'Antivirus Management Procedure.docx',
  'data_management_policy': 'Data Management Policy.docx',
  'disaster_recovery_plan': 'Disaster Recovery Plan.docx',
  'encryption_management': 'Encryption Management.docx',
  'information_security_policy': 'Information Security Policy.docx',
  'risk_management_assessment_and_treatment_policy': 'Risk Management Assessment and Treatment Policy.docx',
  'vendor_management_policy': 'Vendor Management Policy.docx',
};

// Get all available document titles from the docs directory
export function getAvailableDocuments(): string[] {
  return [
    'Access Management Policy.docx',
    'Antivirus Management Procedure.docx', 
    'Data Management Policy.docx',
    'Disaster Recovery Plan.docx',
    'Encryption Management.docx',
    'Information Security Policy.docx',
    'Risk Management Assessment and Treatment Policy.docx',
    'Vendor Management Policy.docx'
  ];
}

// Normalize text for comparison
function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .replace(/[_\s-]+/g, ' ') // Replace underscores, multiple spaces, and hyphens with single space
    .replace(/\.md$/, '') // Remove .md extension
    .trim();
}

// Calculate similarity between two strings
function calculateSimilarity(str1: string, str2: string): number {
  const words1 = str1.split(' ').filter(w => w.length > 2);
  const words2 = str2.split(' ').filter(w => w.length > 2);
  
  if (words1.length === 0 || words2.length === 0) return 0;
  
  let matches = 0;
  words1.forEach(word1 => {
    if (words2.some(word2 => word2.includes(word1) || word1.includes(word2))) {
      matches++;
    }
  });
  
  return matches / Math.max(words1.length, words2.length);
}

// Find best match using fuzzy matching
function findBestMatch(targetTitle: string, availableDocs: string[]): string | null {
  const normalizedTarget = normalizeText(targetTitle);
  let bestMatch: { doc: string; score: number } | null = null;
  
  for (const doc of availableDocs) {
    const normalizedDoc = normalizeText(doc.replace('.docx', ''));
    const similarity = calculateSimilarity(normalizedTarget, normalizedDoc);
    
    if (similarity > 0.7 && (!bestMatch || similarity > bestMatch.score)) {
      bestMatch = { doc, score: similarity };
    }
  }
  
  return bestMatch ? bestMatch.doc : null;
}

// Map document titles from factIndex.json to actual .docx filenames in docs/ directory
export function mapDocumentTitleToDocxPath(documentTitle: string): string {
  // First, try direct mapping
  if (DOCUMENT_MAPPING[documentTitle]) {
    return `/docs/${DOCUMENT_MAPPING[documentTitle]}`;
  }
  
  // Try fuzzy matching
  const availableDocs = getAvailableDocuments();
  const bestMatch = findBestMatch(documentTitle, availableDocs);
  
  if (bestMatch) {
    console.log(`[DocumentMapper] Mapped "${documentTitle}" to "${bestMatch}" using fuzzy matching`);
    return `/docs/${bestMatch}`;
  }
  
  // Fallback: try simple transformation
  const baseName = documentTitle.replace(/\.md$/, '');
  const docxFileName = `${baseName}.docx`;
  
  console.warn(`[DocumentMapper] Could not map "${documentTitle}", using fallback: "${docxFileName}"`);
  return `/docs/${docxFileName}`;
}

// Check if a document exists
export function documentExists(documentTitle: string): boolean {
  // First, try direct mapping
  if (DOCUMENT_MAPPING[documentTitle]) {
    return true;
  }
  
  // Try fuzzy matching
  const availableDocs = getAvailableDocuments();
  const bestMatch = findBestMatch(documentTitle, availableDocs);
  
  if (bestMatch) {
    return true;
  }
  
  // Fallback: check if simple transformation exists
  const baseName = documentTitle.replace(/\.md$/, '');
  const docxFileName = `${baseName}.docx`;
  return availableDocs.includes(docxFileName);
}

// Get the full URL for a document
export function getDocumentUrl(documentTitle: string): string {
  return mapDocumentTitleToDocxPath(documentTitle);
}

// Get the actual filename for a document (for display purposes)
export function getDocumentFileName(documentTitle: string): string {
  // First, try direct mapping
  if (DOCUMENT_MAPPING[documentTitle]) {
    return DOCUMENT_MAPPING[documentTitle];
  }
  
  // Try fuzzy matching
  const availableDocs = getAvailableDocuments();
  const bestMatch = findBestMatch(documentTitle, availableDocs);
  
  if (bestMatch) {
    return bestMatch;
  }
  
  // Fallback: try simple transformation
  const baseName = documentTitle.replace(/\.md$/, '');
  return `${baseName}.docx`;
}
