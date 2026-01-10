// Dynamic Organ Classification based on API field definitions

interface FieldDefinition {
  description: string;
  keywords: string[];
  examples?: string[];
}

interface OrganClassification {
  organ: string;
  position: string;
  color: string;
  emoji: string;
}

// Cache for field definitions
let fieldDefinitionsCache: Record<string, FieldDefinition> | null = null;

export async function fetchFieldDefinitions(format: string = 'syntex_system'): Promise<Record<string, FieldDefinition>> {
  if (fieldDefinitionsCache) return fieldDefinitionsCache;

  try {
    const response = await fetch(`https://dev.syntx-system.com/api/strom/formats/${format}/fields`);
    const data = await response.json();
    fieldDefinitionsCache = data.fields;
    return data.fields;
  } catch (error) {
    console.error('Failed to fetch field definitions:', error);
    return {};
  }
}

// Classify organ based on field semantics from API
export function classifyOrgan(
  fieldName: string, 
  fieldDefinition?: FieldDefinition
): OrganClassification {
  const field = fieldName.toLowerCase();
  const keywords = fieldDefinition?.keywords?.map(k => k.toLowerCase()) || [];
  const description = fieldDefinition?.description?.toLowerCase() || '';
  
  // Check keywords and description for classification
  const hasKeyword = (terms: string[]) => 
    terms.some(term => 
      field.includes(term) || 
      keywords.some(k => k.includes(term)) || 
      description.includes(term)
    );

  // HERZ (Heart) - Frequenz, Rhythmus, Puls
  if (hasKeyword(['frequenz', 'rhythm', 'puls', 'herz', 'heart'])) {
    return { organ: 'HERZ', position: 'top-center', color: '#ef4444', emoji: '❤️' };
  }
  
  // LEBER (Liver) - Drift, Bewegung, Fluss
  if (hasKeyword(['drift', 'bewegung', 'fluss', 'leber', 'liver']) && !field.includes('korper')) {
    return { organ: 'LEBER', position: 'middle-right', color: '#22c55e', emoji: '🌿' };
  }
  
  // MILZ (Spleen) - Mechanismus, Transformation
  if (hasKeyword(['mechanismus', 'transform', 'milz', 'spleen'])) {
    return { organ: 'MILZ', position: 'middle-left', color: '#eab308', emoji: '🟡' };
  }
  
  // NIERE (Kidney) - Körper, Essenz, Tiefe, Wurzel
  if (hasKeyword(['korper', 'körper', 'tiefe', 'essenz', 'wurzel', 'niere', 'kidney'])) {
    return { organ: 'NIERE', position: 'bottom-center', color: '#3b82f6', emoji: '💧' };
  }
  
  // LUNGE (Lung) - Strömung, Atmung, Luft
  if (hasKeyword(['strom', 'strömung', 'atmung', 'luft', 'lunge', 'lung'])) {
    return { organ: 'LUNGE', position: 'top-sides', color: '#f3f4f6', emoji: '🫁' };
  }
  
  // MAGEN (Stomach) - Wirkung, Verdauung
  if (hasKeyword(['wirkung', 'verdau', 'magen', 'stomach'])) {
    return { organ: 'MAGEN', position: 'middle-center', color: '#f97316', emoji: '🔶' };
  }
  
  // BLASE (Bladder) - Druck
  if (hasKeyword(['druck', 'pressure', 'blase', 'bladder'])) {
    return { organ: 'BLASE', position: 'bottom-left', color: '#06b6d4', emoji: '💠' };
  }
  
  // GALLENBLASE - Kalibrierung, Regulation
  if (hasKeyword(['kalibr', 'regulation', 'galle'])) {
    return { organ: 'GALLENBLASE', position: 'middle-right-lower', color: '#84cc16', emoji: '🟢' };
  }
  
  // DICKDARM - Klartext, Ausscheidung
  if (hasKeyword(['klar', 'text', 'ausscheid', 'darm'])) {
    return { organ: 'DICKDARM', position: 'middle-left-lower', color: '#78716c', emoji: '🟤' };
  }
  
  // PERIKARD - Dichte, Schutz
  if (hasKeyword(['dichte', 'schutz', 'perikard'])) {
    return { organ: 'PERIKARD', position: 'top-center-left', color: '#a855f7', emoji: '💜' };
  }
  
  // DREIFACH-ERWÄRMER - Extrakt, Energie
  if (hasKeyword(['extrakt', 'energie', 'erwärm'])) {
    return { organ: 'DREIFACH-ERWÄRMER', position: 'top-center-right', color: '#ec4899', emoji: '🩷' };
  }
  
  // MERIDIANE - Sigma, Ströme, Verbindungen
  if (hasKeyword(['sigma', 'meridian', 'verbindung'])) {
    return { organ: 'MERIDIANE', position: 'all', color: '#06b6d4', emoji: '⚡' };
  }
  
  // MATRIX - Hintergrund, Muster
  if (hasKeyword(['hintergrund', 'muster', 'matrix', 'background'])) {
    return { organ: 'MATRIX', position: 'background', color: '#6b7280', emoji: '🕸️' };
  }
  
  // Default: Unknown organ
  return { 
    organ: fieldName.toUpperCase(), 
    position: 'unknown', 
    color: '#6b7280', 
    emoji: '❓' 
  };
}

// Classify all fields with their definitions
export async function classifyAllOrgans(
  fields: Record<string, number>,
  format: string = 'syntex_system'
): Promise<Record<string, Array<{ field: string; weight: number } & OrganClassification>>> {
  const definitions = await fetchFieldDefinitions(format);
  
  const organsByPosition: Record<string, any[]> = {};
  
  Object.entries(fields).forEach(([field, weight]) => {
    const classification = classifyOrgan(field, definitions[field]);
    if (!organsByPosition[classification.position]) {
      organsByPosition[classification.position] = [];
    }
    organsByPosition[classification.position].push({
      field,
      weight,
      ...classification
    });
  });
  
  return organsByPosition;
}
