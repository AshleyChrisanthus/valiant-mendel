export type CompanySource = 'wikidata' | 'gleif' | 'sec';

export interface SubsidiaryRelation {
  id: string;
  name: string;
  relationType: string;             // e.g. "Subsidiary", "Accounting Parent", "Owned Brand", "Studio"
  jurisdiction?: string;           // Country or US State code (e.g. US-CA, US-DE, GB, FR)
  lei?: string;                    // GLEIF LEI code
  cik?: string;                    // SEC CIK number
  logoUrl?: string;                // Logo or image URL
  description?: string;            // Brief description or business activity
  badge?: string;                  // e.g. "Conglomerate", "Subsidiary", "LEI: 549300...", "Delaware Corp"
  source: CompanySource;
  children?: SubsidiaryRelation[];
}

export interface UnifiedCompanyData {
  id: string;
  name: string;
  source: CompanySource;
  badge?: string;
  jurisdiction?: string;
  logoUrl?: string;
  description?: string;
  lei?: string;
  cik?: string;
  subsidiaries: SubsidiaryRelation[];
}

export interface CanvasNodeData {
  id: string;
  title: string;
  logoUrl?: string | null;
  source: CompanySource;
  badge?: string;
  jurisdiction?: string;
  relationType?: string;
  lei?: string;
  cik?: string;
  description?: string;
  hasChildren?: boolean;
  childrenCount?: number;
  [key: string]: unknown;
}

export interface CompanyCanvasNode {
  id: string;
  type?: string;
  position: { x: number; y: number };
  data: CanvasNodeData;
  width?: number;
  height?: number;
  selected?: boolean;
}

export interface CompanyCanvasEdge {
  id: string;
  source: string;
  target: string;
  label?: string;
  relationType?: string;
  animated?: boolean;
  style?: Record<string, string | number>;
}

export interface CompanyHierarchyCanvas {
  id: string;
  name: string;
  companyName: string;
  source: CompanySource;
  description?: string;
  nodes: CompanyCanvasNode[];
  edges: CompanyCanvasEdge[];
  viewport?: { x: number; y: number; zoom: number };
  createdAt: string;
  updatedAt: string;
}
