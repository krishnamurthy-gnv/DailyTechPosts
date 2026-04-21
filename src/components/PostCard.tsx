/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion, AnimatePresence } from "motion/react";
import { Linkedin, Twitter, Share2, Download, RefreshCw, AlertCircle, Sparkles, Cpu } from "lucide-react";
import { PlatformPost, Platform } from "../types";

interface PostCardProps {
  post: PlatformPost;
  onRefreshImage: (platform: Platform) => void | Promise<void>;
}

export const PostCard: React.FC<PostCardProps> = ({ post, onRefreshImage }) => {
  const isLinkedIn = post.platform === 'LinkedIn';
  const isX = post.platform === 'X';

  const cardStyles = {
    LinkedIn: "bg-white text-slate-900 border-slate-200",
    X: "bg-black text-white border-slate-800",
    Social: "bg-slate-900 text-slate-200 border-slate-700",
  };

  const headerIcons = {
    LinkedIn: <div className="w-8 h-8 bg-[#0077b5] rounded flex items-center justify-center text-[10px] text-white font-bold">in</div>,
    X: <div className="w-8 h-8 flex items-center justify-center"><Twitter className="w-5 h-5 text-white" /></div>,
    Social: <div className="w-8 h-8 flex items-center justify-center"><Share2 className="w-5 h-5 text-purple-500" /></div>,
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`rounded-xl shadow-lg flex flex-col overflow-hidden border ${cardStyles[post.platform]} h-full`}
      id={`post-card-${post.platform}`}
    >
      {/* Card Header */}
      <div className={`p-3 border-b flex items-center justify-between ${isX ? 'border-slate-800' : (isLinkedIn ? 'border-slate-200' : 'border-slate-700')}`}>
        <div className="flex items-center gap-2">
          {headerIcons[post.platform]}
          <span className={`text-xs font-semibold ${isLinkedIn ? 'text-slate-900' : 'text-white'}`}>
            {post.platform === 'Social' ? 'Visual Media Post' : `${post.platform} Preview`}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <button 
            onClick={() => onRefreshImage(post.platform)}
            disabled={post.imageLoading}
            className={`p-1.5 rounded-md transition-colors disabled:opacity-30 ${isLinkedIn ? 'hover:bg-slate-100 text-slate-400' : 'hover:bg-white/10 text-slate-500'}`}
          >
            <RefreshCw className={`w-3.5 h-3.5 ${post.imageLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      <div className="p-4 flex-1 flex flex-col">
        {/* Author Simulation for Social feel */}
        {(isLinkedIn || isX) && (
          <div className="flex items-center gap-2 mb-3">
            <div className={`w-10 h-10 rounded-full flex-shrink-0 ${isX ? 'bg-blue-500' : 'bg-slate-200'}`}>
              <div className="w-full h-full rounded-full bg-gradient-to-tr from-slate-400/20 to-slate-200/20" />
            </div>
            <div>
              <div className={`text-xs font-bold ${isLinkedIn ? 'text-slate-900 underline' : 'text-white flex items-center gap-1'}`}>
                Tech Insight Daily
                {isX && <Sparkles className="w-3 h-3 text-blue-400 fill-blue-400" />}
              </div>
              <div className="text-[10px] text-slate-500">
                {isX ? '@tech_insight_daily' : 'Software Architecture News • 2h'}
              </div>
            </div>
          </div>
        )}

        {/* Content Section */}
        <div className="flex-1 flex flex-col">
          <p className={`text-[12px] leading-relaxed mb-4 ${isLinkedIn ? 'text-slate-800' : (isX ? 'text-white' : 'text-slate-300')}`}>
            {post.content.text}
          </p>

          <div className="flex flex-wrap gap-2 mb-4">
            {post.content.tags.map((tag, idx) => (
              <span 
                key={idx} 
                className={`text-[10px] underline font-medium ${isLinkedIn ? 'text-blue-600' : (isX ? 'text-blue-400' : 'text-purple-400')}`}
              >
                {tag.startsWith('#') ? tag : `#${tag}`}
              </span>
            ))}
          </div>

          {/* Media Area */}
          <div className={`w-full relative rounded border overflow-hidden ${post.platform === 'Social' ? 'aspect-[4/5] bg-slate-800' : 'aspect-video bg-slate-100'} ${isX ? 'border-slate-800 bg-slate-900' : 'border-slate-200'}`}>
            <AnimatePresence mode="wait">
              {post.imageLoading ? (
                <div className="absolute inset-0 flex items-center justify-center">
                  <RefreshCw className="w-6 h-6 text-accent animate-spin opacity-40" />
                </div>
              ) : post.imageUrl ? (
                <motion.img
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  src={post.imageUrl}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center opacity-10">
                  <Cpu className="w-12 h-12" />
                </div>
              )}
            </AnimatePresence>
            
            {post.platform === 'Social' && !post.imageLoading && (
              <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center pointer-events-none">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-950/40 via-transparent to-black/40" />
                <h3 className="text-xl font-bold text-white uppercase tracking-tighter relative">NANO BANANA</h3>
                <p className="text-[10px] text-accent font-mono relative">SYSTEM.ARCH.INIT_SUCCESS</p>
              </div>
            )}
          </div>
        </div>

        {post.platform === 'Social' && (
          <div className="mt-4 flex gap-2">
            <button className="h-8 flex-1 bg-slate-800 hover:bg-slate-700 transition-colors rounded flex items-center justify-center text-[10px] font-bold uppercase tracking-wider">Like</button>
            <button className="h-8 flex-1 bg-slate-800 hover:bg-slate-700 transition-colors rounded flex items-center justify-center text-[10px] font-bold uppercase tracking-wider">Share</button>
          </div>
        )}
      </div>
    </motion.div>
  );
};
