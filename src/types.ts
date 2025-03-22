export interface AlgorithmData {
  name: string;
  nameingraph: string;
  paper: string;
  paperUrl: string;
  description: string;
  timeComplexity: string;
  results: {
    testCase1: number;
    testCase2: number;
    testCase3: number;
  };
  implementation: {
    language: string;
    filePath: string; // Change from code to filePath
  };
}
