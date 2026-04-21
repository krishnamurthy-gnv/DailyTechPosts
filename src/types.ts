/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type Platform = 'LinkedIn' | 'X' | 'Social';

export interface PostContent {
  text: string;
  tags: string[];
}

export interface PlatformPost {
  platform: Platform;
  content: PostContent;
  imageUrl?: string;
  imageLoading: boolean;
  imageError?: string;
}

export interface TechNewsState {
  description: string;
  isGenerating: boolean;
  posts: PlatformPost[];
  error?: string;
}
