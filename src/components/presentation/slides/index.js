import Slide01Introduction from './Slide01Introduction';
import Slide02TheProblem from './Slide02TheProblem';
import Slide03ProposedSolution from './Slide03ProposedSolution';
import Slide04SoftwareArchitecture from './Slide04SoftwareArchitecture';
import Slide05HardwareBlueprint from './Slide05HardwareBlueprint';
import Slide06InteractiveExplorer from './Slide06InteractiveExplorer';
import Slide07MissionControl from './Slide07MissionControl';
import Slide08PerformanceMonitoring from './Slide08PerformanceMonitoring';
import Slide09TestingEvaluation from './Slide09TestingEvaluation';
import Slide10LimitationsFutureWork from './Slide10LimitationsFutureWork';
import Slide11ThankYouVision from './Slide11ThankYouVision';

/**
 * ADITI Presentation Slides Registry
 * 
 * 11 distinct, modular slides designed for cinematic engineering demonstration.
 */
export const slides = [
  {
    id: 'intro',
    number: 1,
    title: 'System Introduction',
    category: 'OVERVIEW & GENESIS',
    component: Slide01Introduction
  },
  {
    id: 'problem',
    number: 2,
    title: 'The Urban Overload Challenge',
    category: 'PROBLEM DEFINITION',
    component: Slide02TheProblem
  },
  {
    id: 'solution',
    number: 3,
    title: 'The Proposed Solution',
    category: 'SMART GLASSES ARCHITECTURE',
    component: Slide03ProposedSolution
  },
  {
    id: 'software-arch',
    number: 4,
    title: 'Software Processing Pipeline',
    category: 'DATA ENGINE & FUSION',
    component: Slide04SoftwareArchitecture
  },
  {
    id: 'hardware-blueprint',
    number: 5,
    title: 'Hardware Blueprint (Conceptual)',
    category: 'SCHEMATIC EXPLODED VIEW',
    component: Slide05HardwareBlueprint
  },
  {
    id: 'component-explorer',
    number: 6,
    title: 'Component Inspection Explorer',
    category: 'INTERACTIVE SUBSYSTEMS',
    component: Slide06InteractiveExplorer
  },
  {
    id: 'mission-control',
    number: 7,
    title: 'Simulation & Mission Control',
    category: 'REAL-TIME HUD TELEMETRY',
    component: Slide07MissionControl
  },
  {
    id: 'performance',
    number: 8,
    title: 'Performance Monitoring',
    category: 'EDGE LATENCY & BENCHMARKS',
    component: Slide08PerformanceMonitoring
  },
  {
    id: 'testing-eval',
    number: 9,
    title: 'Testing & Engineering Evaluation',
    category: 'SIMULATION VALIDATION',
    component: Slide09TestingEvaluation
  },
  {
    id: 'limitations',
    number: 10,
    title: 'Limitations & Future Work',
    category: 'TRANSITION ROADMAP',
    component: Slide10LimitationsFutureWork
  },
  {
    id: 'thank-you',
    number: 11,
    title: 'Future Vision & Conclusion',
    category: 'FINAL CAPSTONE VERDICT',
    component: Slide11ThankYouVision
  }
];

export default slides;
