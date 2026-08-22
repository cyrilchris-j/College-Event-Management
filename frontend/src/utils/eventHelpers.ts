/**
 * eventHelpers.ts
 * Pure utility functions for computing derived event state,
 * category colors, and registration status.
 */

import type { Event, EventCategory, RegistrationStatus } from '@/types';

// ─── Registration Status ──────────────────────────────────────────────────────

/**
 * Returns a semantic registration status based on capacity percentage
 * and registration deadline.
 */
export function getRegistrationStatus(event: Event): RegistrationStatus {
  const deadline = event.registration_deadline
    ? new Date(event.registration_deadline)
    : null;
  const now = new Date();

  if (deadline && now > deadline) return 'closed';
  if (event.status === 'closed' || event.status === 'completed') return 'closed';

  const pct = (event.registered_count / event.capacity) * 100;
  if (pct >= 100) return 'full';
  if (pct >= 80) return 'almost_full';
  return 'open';
}

/**
 * Returns registration percentage (0–100), capped at 100.
 */
export function getRegistrationPercentage(event: Event): number {
  return Math.min(Math.round((event.registered_count / event.capacity) * 100), 100);
}

// ─── Status Labels & Colors ───────────────────────────────────────────────────

export interface StatusConfig {
  label: string;
  textColor: string;
  bgColor: string;
  dotColor: string;
}

export const STATUS_CONFIG: Record<RegistrationStatus, StatusConfig> = {
  open: {
    label: '✓ Open',
    textColor: 'text-green-700',
    bgColor: 'bg-green-50',
    dotColor: 'bg-green-500',
  },
  almost_full: {
    label: '⚡ Almost Full',
    textColor: 'text-amber-700',
    bgColor: 'bg-amber-50',
    dotColor: 'bg-amber-500',
  },
  full: {
    label: '✗ Event Full',
    textColor: 'text-red-700',
    bgColor: 'bg-red-50',
    dotColor: 'bg-red-500',
  },
  closed: {
    label: '— Registration Closed',
    textColor: 'text-slate-600',
    bgColor: 'bg-slate-100',
    dotColor: 'bg-slate-400',
  },
};

export function getStatusConfig(status: RegistrationStatus): StatusConfig {
  return STATUS_CONFIG[status];
}

// ─── Category Colors ──────────────────────────────────────────────────────────

export interface CategoryConfig {
  label: EventCategory;
  textColor: string;
  bgColor: string;
  borderColor: string;
}

export const CATEGORY_CONFIG: Record<EventCategory, CategoryConfig> = {
  Technical: {
    label: 'Technical',
    textColor: 'text-blue-700',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
  },
  Hackathon: {
    label: 'Hackathon',
    textColor: 'text-purple-700',
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-200',
  },
  Workshop: {
    label: 'Workshop',
    textColor: 'text-indigo-700',
    bgColor: 'bg-indigo-50',
    borderColor: 'border-indigo-200',
  },
  Seminar: {
    label: 'Seminar',
    textColor: 'text-amber-700',
    bgColor: 'bg-amber-50',
    borderColor: 'border-amber-200',
  },
  Cultural: {
    label: 'Cultural',
    textColor: 'text-pink-700',
    bgColor: 'bg-pink-50',
    borderColor: 'border-pink-200',
  },
  Exhibition: {
    label: 'Exhibition',
    textColor: 'text-teal-700',
    bgColor: 'bg-teal-50',
    borderColor: 'border-teal-200',
  },
  Sports: {
    label: 'Sports',
    textColor: 'text-orange-700',
    bgColor: 'bg-orange-50',
    borderColor: 'border-orange-200',
  },
};

export function getCategoryConfig(category: EventCategory): CategoryConfig {
  return CATEGORY_CONFIG[category] ?? CATEGORY_CONFIG.Technical;
}

// ─── Progress Bar Color ───────────────────────────────────────────────────────

export function getProgressBarColor(percentage: number): string {
  if (percentage >= 90) return 'bg-red-400';
  if (percentage >= 75) return 'bg-amber-400';
  return 'bg-green-500';
}

// ─── Default Event Thumbnail ──────────────────────────────────────────────────

const CATEGORY_THUMBS: Record<EventCategory, string> = {
  Technical:
    'https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=200&h=130&fit=crop',
  Hackathon:
    'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=200&h=130&fit=crop',
  Workshop:
    'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=200&h=130&fit=crop',
  Seminar:
    'https://images.unsplash.com/photo-1560439514-4e9645039924?w=200&h=130&fit=crop',
  Cultural:
    'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=200&h=130&fit=crop',
  Exhibition:
    'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=200&h=130&fit=crop',
  Sports:
    'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=200&h=130&fit=crop',
};

export function getEventThumbnail(event: Event): string {
  return event.banner_url ?? CATEGORY_THUMBS[event.category];
}
