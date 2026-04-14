export interface MedicalInsight {
  id: string;
  condition: string;
  category: string;
  lastModified: string;
}

export const medicalInsightsData: MedicalInsight[] = [
  { id: "1", condition: "Type 2 Diabetes", category: "Chronic", lastModified: "2026-04-12" },
  { id: "2", condition: "Migraine", category: "Neurological", lastModified: "2026-04-14" },
  { id: "3", condition: "Hypertension", category: "Cardiovascular", lastModified: "2026-04-10" },
];
