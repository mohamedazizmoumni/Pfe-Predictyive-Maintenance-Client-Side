# Sentinel AI — Corporate Website

## Overview

This repository contains the frontend application for the official Sentinel AI corporate website.

The application is designed to present Sentinel AI's industrial artificial intelligence solutions and provide visitors with information about the services offered by the company.

The website serves as a public communication platform where potential clients can:

- Discover Sentinel AI solutions
- Understand the company's expertise
- Explore offered services
- Contact the project administrator for further information


---

## Project Purpose

The purpose of this application is to provide a modern and professional digital presence for Sentinel AI.

The website focuses on presenting:

- Artificial Intelligence solutions for industrial environments
- Predictive maintenance concepts
- Industrial monitoring services
- Data-driven maintenance approaches
- Company information and capabilities


This project is a presentation website only. It does not include:

- User authentication
- Customer accounts
- Industrial dashboards
- Machine monitoring features
- Maintenance management workflows


---

# Main Features

## Service Presentation

The website presents Sentinel AI's main services, including:

### Predictive Maintenance

Presentation of AI-based maintenance solutions designed to help organizations anticipate equipment failures and improve operational efficiency.

### Industrial AI Solutions

Showcase of artificial intelligence technologies applied to industrial environments.

### Smart Monitoring

Explanation of connected monitoring approaches and data-driven operational improvement.


---

## Contact Interface

The website provides a communication channel allowing visitors to contact the Sentinel AI administrator.

The contact functionality is intended for:

- Business inquiries
- Partnership requests
- Service information requests
- Project discussions


---

## Responsive Design

The application is optimized for different screen sizes:

- Desktop
- Laptop
- Tablet
- Mobile devices


The interface follows a modern enterprise design approach focused on:

- Clear information hierarchy
- Professional branding
- Simple navigation
- High-quality user experience


---

# Technology Stack

## Frontend

| Technology | Purpose |
|------------|---------|
| Angular 17 | Frontend framework |
| TypeScript | Application development |
| HTML5 | Web structure |
| CSS3 | Styling and responsive design |
| Angular CLI | Development and build tools |


## Development Tools

| Tool | Purpose |
|------|---------|
| Node.js | Runtime environment |
| npm | Dependency management |
| Git | Version control |


---

# Requirements

Before running the project locally, install:

## Node.js

Recommended version:

```
Node.js 18+
```

Check installation:

```bash
node --version
```


## npm

Check installation:

```bash
npm --version
```


## Angular CLI

Install Angular CLI:

```bash
npm install -g @angular/cli
```

Verify:

```bash
ng version
```


---

# Installation

Clone the repository:

```bash
git clone https://github.com/mohamedazizmoumni/Pfe-Predictyive-Maintenance-Client-Side.git
```

Navigate to the project directory:

```bash
cd Pfe-Predictyive-Maintenance-Client-Side
```


Install dependencies:

```bash
npm install
```


---

# Running Locally

Start the development server:

```bash
ng serve
```

The application will be available at:

```
http://localhost:4300/
```


The Angular development server automatically reloads when source files are modified.


---

# Production Build

Generate a production build:

```bash
ng build --configuration production
```

The generated files will be available inside:

```
dist/
```


The application can be deployed using static hosting platforms such as:

- Vercel
- Netlify
- Firebase Hosting
- AWS Amplify


---

# Project Structure

```
src/

├── app/
│   ├── components/
│   ├── pages/
│   ├── services/
│   ├── models/
│   └── app.routes.ts
│
├── assets/
│   ├── images/
│   ├── logos/
│   └── static files
│
├── environments/
│
├── styles.css
│
└── main.ts
```


---

# Configuration

Environment configuration files:

```
src/environments/
```

These files can be used for:

- Application configuration
- External service URLs
- Deployment settings


---

# Development Commands

Install dependencies:

```bash
npm install
```

Run development server:

```bash
ng serve
```

Build application:

```bash
ng build
```

Execute tests:

```bash
ng test
```


---

# Deployment

The application is a static Angular frontend.

Deployment workflow:

1. Install dependencies.
2. Generate the production build.
3. Deploy the content of the `dist` directory.
4. Configure the hosting provider.


---

# License

This project is developed as part of an engineering project focused on creating a professional digital platform for Sentinel AI.