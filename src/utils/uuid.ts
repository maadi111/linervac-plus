/**
 * UUID Utilities
 * Matches Node-RED UUID generation logic
 */

/**
 * Generate a UUID in Node-RED format: xxxxxx-xxxx
 * Uses base36 (0-9, a-z) for compatibility with Node-RED
 * 
 * Example: d4rwc-y316
 */
export function generateNodeRedUUID(): string {
  const gen = () =>
    'xxxxxx-xxxx'.replace(/[x]/g, () =>
      (Math.random() * 36 | 0).toString(36)
    )
  
  return gen().toUpperCase()
}

/**
 * Validate UUID format (accepts both Node-RED and standard formats)
 * Node-RED: xxxxxx-xxxx (e.g., D4RWC-Y316)
 * Standard: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
 * 
 * @param uuid - The UUID to validate
 * @returns true if valid format
 */
export function isValidUUID(uuid: string): boolean {
  if (!uuid || typeof uuid !== 'string') return false
  
  // Node-RED format: 6 chars, dash, 4 chars (alphanumeric)
  const nodeRedPattern = /^[A-Z0-9]{6}-[A-Z0-9]{4}$/i
  
  // Standard UUID format
  const standardPattern = /^[A-F0-9]{8}-[A-F0-9]{4}-[A-F0-9]{4}-[A-F0-9]{4}-[A-F0-9]{12}$/i
  
  // Any alphanumeric with dashes (flexible)
  const flexiblePattern = /^[A-Z0-9-]{4,50}$/i
  
  return nodeRedPattern.test(uuid) || 
         standardPattern.test(uuid) || 
         flexiblePattern.test(uuid)
}

/**
 * Format UUID for display (uppercase with proper spacing)
 */
export function formatUUID(uuid: string): string {
  return uuid.toUpperCase().trim()
}

/**
 * Check if UUID is Node-RED format
 */
export function isNodeRedUUID(uuid: string): boolean {
  return /^[A-Z0-9]{6}-[A-Z0-9]{4}$/i.test(uuid)
}

