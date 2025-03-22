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
    // Add base path for absolute paths
    const adjustedPath = filePath.startsWith('/') 
      ? import.meta.env.BASE_URL + filePath.slice(1) 
      : filePath;
    
    // console.log('Fetching data from:', adjustedPath);
    const response = await fetch(adjustedPath);
    
    if (!response.ok) {
      throw new Error(`Failed to load file: ${filePath} (Status: ${response.status})`);
    }
    
    const text = await response.text();
    const lines = text.split('\n');
    
    // Extract file name from path for test case name
    const pathParts = filePath.split('/');
    const fileName = pathParts[pathParts.length - 1];
    let testCase = 'Unknown';
    if (fileName.includes('Email-Enron')) {
      testCase = 'Email-Enron';
    } else if (fileName.includes('WikiVote')) {
      testCase = 'WikiVote';
    } else if (fileName.includes('skitter')) {
      testCase = 'Skitter';
    }
    
    // Parse distribution table
    const distribution: CliqueDistribution[] = [];
    let totalCliques = 0;
    let largestCliqueSize = 0;
    
    // Find the line that marks the start of the clique size distribution table
    const tableSectionIndex = lines.findIndex(line => 
      line.includes("| Clique Size | Number of Cliques")
    );
    
    if (tableSectionIndex !== -1) {
      // Skip the header and separator lines
      let i = tableSectionIndex + 2;
      
      // Read data rows until we hit a line that doesn't match the pattern
      while (i < lines.length) {
        const line = lines[i];
        
        // Check if we've reached the end of the table
        if (!line.includes('|') || line.includes('----')) {
          break;
        }
        
        // Parse the data row - handle padding variations
        const matches = line.match(/\|\s*(\d+)\s*\|\s*(\d+)/);
        if (matches && matches.length === 3) {
          distribution.push({
            cliqueSize: parseInt(matches[1]),
            count: parseInt(matches[2].replace(/,/g, ''))
          });
        }
        
        i++;
      }
    }
    
    // Find total cliques count
    const totalCliquesLine = lines.find(line => 
      line.includes("Total Number of Maximal Cliques:") || 
      line.includes("Total Number of Cliques:")
    );
    
    if (totalCliquesLine) {
      const matches = totalCliquesLine.match(/\d+/);
      if (matches) {
        totalCliques = parseInt(matches[0]);
      }
    } else if (distribution.length > 0) {
      // Calculate total if not found in file
      totalCliques = distribution.reduce((sum, item) => sum + item.count, 0);
    }
    
    // Find largest clique size or calculate from distribution
    if (distribution.length > 0) {
      largestCliqueSize = Math.max(...distribution.map(item => item.cliqueSize));
    }
    
    // Sort distribution by clique size for proper display
    distribution.sort((a, b) => a.cliqueSize - b.cliqueSize);
    
    return {
      totalCliques,
      largestCliqueSize,
      distribution,
      testCase
    };
  } catch (error) {
    console.error('Error parsing clique data:', error);
    return {
      totalCliques: 0,
      largestCliqueSize: 0,
      distribution: [],
      testCase: 'Unknown'
    };
  }
}
