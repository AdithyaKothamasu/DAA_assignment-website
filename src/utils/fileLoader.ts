export async function loadCodeFile(filePath: string): Promise<string> {
  try {
    // Add base path for absolute paths
    const adjustedPath = filePath.startsWith('/') 
      ? import.meta.env.BASE_URL + filePath.slice(1) 
      : filePath;
    
    const response = await fetch(adjustedPath);
    
    if (!response.ok) {
      throw new Error(`Failed to load file: ${filePath} (Status: ${response.status})`);
    }
    
    return await response.text();
  } catch (error) {
    console.error('Error loading code file:', error);
    return `// Error loading code from ${filePath}\n// Please check that the file exists in the public directory`;
  }
}
