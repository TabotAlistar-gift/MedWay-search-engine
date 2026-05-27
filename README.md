# MedWay: Authoritative Medical Knowledge Platform

MedWay is a specialized medical search engine designed to provide users with accurate, verified, and well-structured medical information from trusted global sources.

## 🚀 Overview

In an era of medical misinformation and "Cyberchondria," MedWay acts as a clinical filter, prioritizing reliability over popularity. It aggregates data from the world's leading health institutions to provide a direct path to verified knowledge.

## ✨ Key Features

- **Unified Data Integration**: Real-time insights from WHO, CDC, Mayo Clinic, PubMed, and OpenFDA.
- **Structured Overviews**: Intelligent parsing of symptoms, causes, and treatments.
- **Smart Natural Language Search**: Handles complex medical queries using simple language.
- **Personalized Dashboard**: Securely save articles, track symptom checks, and manage search history.
- **High-Authority Ranking**: Prioritizes institutional clinical data over generic SEO-ranked blogs.

## 🛠️ Technology Stack

- **Frontend**: Next.js 15+ (App Router), TypeScript, Tailwind CSS, Framer Motion.
- **Backend**: Prisma ORM with SQLite (Development) / PostgreSQL (Production).
- **APIs**: National Center for Biotechnology Information (NCBI), Center for Disease Control (CDC), Wikipedia API, OpenFDA.

## 🚦 Getting Started

### Prerequisites
- Node.js 18+
- pnpm / npm / yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/medway.git
   ```

2. Install dependencies:
   ```bash
   pnpm install
   ```

3. Set up the database:
   ```bash
   pnpm prisma generate
   pnpm prisma db push
   ```

4. Run the development server:
   ```bash
   pnpm dev
   ```

Open [http://localhost:3000](http://localhost:3000) to explore the platform.

## 📚 References

- [World Health Organization (WHO)](https://www.who.int)
- [Mayo Clinic](https://www.mayoclinic.org)
- [CDC Official Website](https://www.cdc.gov)
- [PubMed (NCBI)](https://pubmed.ncbi.nlm.nih.gov)
- [OpenFDA](https://open.fda.gov)

---
*Developed as a Final Project for Medical Information Retrieval.*

