/**
 * Parses the clique size distribution from ELS algorithm output text
 */
export interface CliqueDistribution {
  cliqueSize: number;
  count: number;
}

export interface ParsedELSOutput {
  totalCliques: number;
  largestCliqueSize: number;
  distribution: CliqueDistribution[];
  testCase: string;
}

export async function parseELSOutput(filePath: string): Promise<ParsedELSOutput> {
  try {
    const response = await fetch(filePath);
    
    if (!response.ok) {
      throw new Error(`Failed to load file: ${filePath}`);
    }
    
    const text = await response.text();
    const lines = text.split('\n');
    
    // Extract file name from path for test case name
    const pathParts = filePath.split('/');
    const fileName = pathParts[pathParts.length - 1];
    const testCase = fileName.includes('Email-Enron') ? 'Email-Enron' : 'WikiVote';
    
    // Find total cliques line
    const totalCliquesLine = lines.find(line => line.includes('Total number of maximal cliques:'));
    const totalCliques = totalCliquesLine 
      ? parseInt(totalCliquesLine.split(':')[1].trim()) 
      : 0;
    
    // Find largest clique size line
    const largestCliqueLine = lines.find(line => line.includes('Largest clique size:'));
    const largestCliqueSize = largestCliqueLine 
      ? parseInt(largestCliqueLine.split(':')[1].trim()) 
      : 0;
    
    // Parse distribution table
    const distribution: CliqueDistribution[] = [];
    let inDistributionTable = false;
    
    for (const line of lines) {
      if (line.includes('===== Clique Size Distribution =====')) {
        inDistributionTable = true;
        continue;
      }
      
      if (inDistributionTable) {
        // Skip table header lines
        if (line.includes('Clique Size') || line.includes('-------------') || line.trim() === '') {
          continue;
        }
        
        // End of table
        if (line.includes('-----') && !line.includes('|')) {
          break;
        }
        
        // Parse data row
        const matches = line.match(/\|\s*(\d+)\s*\|\s*(\d+)\s*\|/);
        if (matches && matches.length === 3) {
          distribution.push({
            cliqueSize: parseInt(matches[1]),
            count: parseInt(matches[2])
          });
        }
      }
    }
    
    return {
      totalCliques,
      largestCliqueSize,
      distribution,
      testCase
    };
  } catch (error) {
    console.error('Error parsing ELS output:', error);
    return {
      totalCliques: 0,
      largestCliqueSize: 0,
      distribution: [],
      testCase: 'Unknown'
    };
  }
}
