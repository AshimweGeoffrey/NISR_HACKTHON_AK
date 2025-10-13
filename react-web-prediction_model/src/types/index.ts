export interface PredictionInput {
  childAge: number;
  householdIncome: number;
  foodInsecurity: number;
  waterAccess: number;
  sanitationAccess: number;
  educationLevel: string;
  region: string;
  householdSize: number;
}

export interface PredictionResult {
  id: string;
  childAge: number;
  region: string;
  riskCategory: 'Low' | 'Medium' | 'High';
  probability: number;
  confidence: number;
  notes: string;
  date: string;
  input: PredictionInput;
}

export interface ActivityLog {
  id: string;
  action: string;
  timestamp: string;
  type: 'prediction' | 'export' | 'system';
}
