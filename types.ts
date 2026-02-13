
export enum Platform {
  Web = 'Web',
  Mobile = 'Mobile (iOS/Android)',
  API = 'API',
  Database = 'Database'
}

export type Severity = 'Critical' | 'High' | 'Medium' | 'Low';

export interface TestCase {
  category: string;
  severity: Severity;
  description: string;
  testData: string;
  expectedResult: string;
}

export interface GeneratorParams {
  featureName: string;
  platform: Platform;
  context: string;
}
