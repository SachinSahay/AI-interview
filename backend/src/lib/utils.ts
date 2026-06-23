// ==========================================
// InterviewIQ AI — Frontend Utility Functions
// ==========================================

/**
 * Generate a unique ID with an optional prefix.
 */
export function generateId(prefix = ''): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 8);
  return prefix ? `${prefix}_${timestamp}_${random}` : `${timestamp}_${random}`;
}

/**
 * Format a date string into a human-readable format.
 */
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

/**
 * Format seconds into MM:SS or HH:MM:SS.
 */
export function formatTime(totalSeconds: number): string {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const pad = (n: number) => n.toString().padStart(2, '0');

  if (hours > 0) {
    return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
  }
  return `${pad(minutes)}:${pad(seconds)}`;
}

/**
 * Get a color based on a score (0-100).
 */
export function getScoreColor(score: number): string {
  if (score >= 80) return 'var(--accent-success)';
  if (score >= 60) return 'var(--accent-secondary)';
  if (score >= 40) return 'var(--accent-gold)';
  return 'var(--accent-warm)';
}

/**
 * Get a label based on a score (0-100).
 */
export function getScoreLabel(score: number): string {
  if (score >= 90) return 'Excellent';
  if (score >= 80) return 'Very Good';
  if (score >= 70) return 'Good';
  if (score >= 60) return 'Above Average';
  if (score >= 50) return 'Average';
  if (score >= 40) return 'Below Average';
  return 'Needs Improvement';
}

/**
 * Generate a random avatar gradient color.
 */
export function getAvatarColor(): string {
  const colors = [
    '#6c5ce7', '#00cec9', '#fd79a8', '#fdcb6e',
    '#e17055', '#0984e3', '#00b894', '#e84393',
    '#6c5ce7', '#a29bfe',
  ];
  return colors[Math.floor(Math.random() * colors.length)];
}

/**
 * Delay utility for simulating async operations.
 */
export function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Capitalize first letter of a string.
 */
export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Get initials from a name.
 */
export function getInitials(name: string): string {
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .substring(0, 2);
}

/**
 * Format file size in human readable form.
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

/**
 * Clamp a score between 0 and 100.
 */
export function clampScore(score: number): number {
  return Math.min(100, Math.max(0, Math.round(score)));
}

/**
 * Shuffle an array using Fisher-Yates algorithm.
 */
export function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}
