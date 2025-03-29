# Meeting Vibeometer - Implementation Plan

## 1. Project Overview
The Meeting Vibeometer is an application that allows meeting participants to express their current mood during presentations, enabling presenters to gauge audience sentiment in real-time.

### 1.1 Core Objectives
- Enable real-time mood tracking during meetings
- Visualize engagement trends over time
- Allow participants to submit feedback
- Provide presenters with a dashboard to view mood data

## 2. Technology Stack

### 2.1 Frontend & Backend
- **Framework**: Next.js with App Router
- **Styling**: Tailwind CSS v4
- **State Management**: React Hooks
- **Data Visualization**: Chart.js for visualizations
- **Real-time Communication**: Supabase Realtime

### 2.2 Database
- **Database**: Supabase (PostgreSQL)
- **Schema Design**: Tables for meetings, mood data, feedback

### 2.3 Deployment
- **Hosting**: Vercel
- **Database Hosting**: Supabase Cloud

## 3. System Architecture

### 3.1 High-Level Architecture
```
┌─────────────────────┐      ┌─────────────┐
│                     │      │             │
│  Next.js App        │◄────►│  Supabase   │
│  (Frontend & API)   │      │  (Database) │
│                     │      │             │
└─────────────────────┘      └─────────────┘
```

### 3.2 Component Diagram
- **Participant View**: Interface for submitting current mood and feedback
- **Presenter View**: Dashboard showing aggregated mood data and feedback

## 4. Database Schema

### 4.1 Meetings Table
```sql
CREATE TABLE meetings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  meeting_code TEXT UNIQUE NOT NULL,
  start_time TIMESTAMP WITH TIME ZONE,
  end_time TIMESTAMP WITH TIME ZONE,
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 4.2 MoodData Table
```sql
CREATE TABLE mood_data (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  meeting_id UUID REFERENCES meetings(id) ON DELETE CASCADE,
  participant_id TEXT,
  mood_value INTEGER NOT NULL CHECK (mood_value BETWEEN 1 AND 5),
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 4.3 Feedback Table
```sql
CREATE TABLE feedback (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  meeting_id UUID REFERENCES meetings(id) ON DELETE CASCADE,
  participant_id TEXT,
  message TEXT NOT NULL,
  tags TEXT[],
  status TEXT DEFAULT 'unread',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## 5. Implementation Phases

### 5.1 Phase 1: Project Setup (3 days)
- Initialize Next.js project with Tailwind CSS v4
- Set up Supabase project and database tables
- Create basic project structure

#### 5.1.1 Tasks
- [x] Create GitHub repository
- [x] Initialize Next.js project
- [x] Configure Tailwind CSS v4
- [x] Set up Supabase account and project
- [x] Create database tables in Supabase

### 5.2 Phase 2: Meeting Setup and Mood Tracking (1 week)
- Create meeting creation and joining flow
- Implement mood selection UI
- Set up Supabase Realtime subscriptions for mood updates
- Build basic mood visualization

#### 5.2.1 Tasks
- [x] Create meeting creation page
- [x] Generate unique meeting codes
- [x] Build participant join page
- [x] Implement mood selection component
- [ ] Set up Supabase Realtime subscriptions
- [ ] Create current mood visualization component
- [ ] Build basic presenter dashboard

### 5.3 Phase 3: Feedback System and Visualization (1 week)
- Implement anonymous feedback submission
- Create feedback display for presenters
- Build timeline visualization for mood trends
- Create meeting summary view

#### 5.3.1 Tasks
- [ ] Build feedback submission component
- [ ] Implement simple tagging system
- [ ] Create presenter feedback view
- [ ] Build Chart.js timeline component
- [ ] Implement basic meeting summary

### 5.4 Phase 4: Polish and Deployment (4 days)
- UI/UX refinement
- Final testing
- Deployment setup

#### 5.4.1 Tasks
- [ ] Refine UI/UX based on testing
- [ ] Add responsive design improvements
- [ ] Prepare deployment configuration
- [ ] Deploy to Vercel
- [ ] Connect deployed app to Supabase

## 6. Project Timeline
- **Phase 1**: 3 days
- **Phase 2**: 7 days
- **Phase 3**: 7 days
- **Phase 4**: 4 days

Total estimated development time: 3 weeks for demo version