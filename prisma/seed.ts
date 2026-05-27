import { PrismaClient } from '@prisma/client';
import "dotenv/config";

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding curated medical knowledge...');

  const curatedData = [
    {
      title: "Hippocrates of Kos",
      description: "Often referred to as the 'Father of Medicine' in Western culture.",
      content: "Hippocrates was a Greek physician of the classical period who is considered one of the most outstanding figures in the history of medicine. He is traditionally credited with coining the Hippocratic Oath, which is still relevant for physicians today. His school of medicine revolutionized ancient Greek medicine, establishing it as a discipline distinct from other fields and making medicine a profession.\n\nKey Contributions:\n- Hippocratic Corpus: A collection of around 60 early ancient Greek medical works.\n- Clinical Observation: Emphasis on observing the patient and documenting symptoms.\n- Medical Ethics: Establishing professional standards for doctors.",
      category: "History",
      source: "MedWay Curated",
      relatedTopics: "Ancient Greece, Medical Ethics, Hippocratic Oath"
    },
    {
      title: "Malaria",
      description: "A life-threatening disease caused by parasites transmitted through the bites of infected female Anopheles mosquitoes.",
      content: "### Overview\nMalaria is a preventable and treatable disease. It is caused by Plasmodium parasites. In 2022, there were an estimated 249 million cases of malaria worldwide.\n\n### Symptoms\n- Fever and chills\n- Headache\n- Nausea and vomiting\n- Muscle pain and fatigue\n\n### Causes\nMalaria is caused by the Plasmodium parasite. The parasite is spread to humans through the bites of infected female Anopheles mosquitoes.\n\n### Treatment\nAntimalarial medicines are used to treat malaria. The choice of medicine depends on the type of parasite and the severity of the symptoms. ACTs (Artemisinin-based combination therapies) are the most effective.",
      category: "Disease",
      source: "MedWay Curated",
      relatedTopics: "Mosquitoes, Plasmodium, Tropical Medicine"
    },
    {
      title: "The Human Heart",
      description: "A muscular organ that pumps blood through the blood vessels of the circulatory system.",
      content: "The heart is located in the chest, slightly to the left of the midline. It is divided into four chambers: two upper atria and two lower ventricles. The heart pumps oxygenated blood to the body and deoxygenated blood to the lungs.\n\n### Functions\n- Pumping blood: Maintaining blood pressure and flow.\n- Transporting nutrients: Delivering oxygen and glucose to cells.\n- Removing waste: Carrying carbon dioxide to the lungs for excretion.",
      category: "Anatomy",
      source: "MedWay Curated",
      relatedTopics: "Circulatory System, Cardiology, Blood Pressure"
    },
    {
      title: "Discovery of Penicillin",
      description: "The first true antibiotic, discovered by Alexander Fleming in 1928.",
      content: "In 1928, at St. Mary's Hospital, London, Alexander Fleming observed that a mold called Penicillium notatum had contaminated a Petri dish of Staphylococci and was preventing the growth of the bacteria. This led to the development of penicillin, which revolutionized the treatment of bacterial infections and saved millions of lives during World War II and beyond.\n\n### Significance\n- Started the 'Antibiotic Era'.\n- Dramatically reduced deaths from infections like pneumonia and syphilis.",
      category: "Fact",
      source: "MedWay Curated",
      relatedTopics: "Antibiotics, Alexander Fleming, Bacterial Infections"
    },
    {
      title: "First General Hospital",
      description: "The Bimaristan of Baghdad, established in the 8th century.",
      content: "The first general hospital was built in Baghdad in 805 CE during the reign of Harun al-Rashid. These hospitals, known as Bimaristans, were advanced for their time, providing free healthcare, separate wards for different diseases, and even music therapy. They served as models for later European hospitals.",
      category: "History",
      source: "MedWay Curated",
      relatedTopics: "Islamic Golden Age, Baghdad, Hospital History"
    }
  ];

  for (const item of curatedData) {
    await prisma.medicalKnowledge.upsert({
      where: { title: item.title },
      update: item,
      create: item,
    });
  }

  console.log('Seeding completed successfully.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
