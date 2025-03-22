export async function loadCodeFile(filePath: string): Promise<string> {
  try {
    // Use a relative path for fetch
    const response = await fetch(filePath);
    
    if (!response.ok) {
      throw new Error(`Failed to load file: ${filePath} (Status: ${response.status})`);
    }
    
    return await response.text();
  } catch (error) {
    console.error('Error loading code file:', error);
    return `// Error loading code from ${filePath}\n// Please check that the file exists in the public directory`;
  }
}
