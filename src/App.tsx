/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send, Cpu, Newspaper, Sparkles, Terminal, XCircle, ChevronRight } from 'lucide-react';
import { generateTechPosts, generateImageForPlatform } from './services/geminiService';
import { TechNewsState, Platform, PlatformPost } from './types';
import { PostCard } from './components/PostCard';

export default function App() {
  const [state, setState] = useState<TechNewsState>({
    description: '',
    isGenerating: false,
    posts: [],
  });
  const [visualConcept, setVisualConcept] = useState<string>('');
  const [newsTopic, setNewsTopic] = useState<string>('');

  const handleGenerate = async () => {
    if (!state.description.trim()) return;

    setState(prev => ({ ...prev, isGenerating: true, error: undefined, posts: [] }));
    setNewsTopic(state.description);

    try {
      const data = await generateTechPosts(state.description);
      setVisualConcept(data.visualConcept);

      const platforms: Platform[] = ['LinkedIn', 'X', 'Social'];
      const initialPosts: PlatformPost[] = platforms.map(p => ({
        platform: p,
        content: data.posts[p],
        imageLoading: true,
      }));

      setState(prev => ({ ...prev, posts: initialPosts, isGenerating: false }));

      initialPosts.forEach(async (post) => {
        try {
          const imageUrl = await generateImageForPlatform(post.platform, data.visualConcept, state.description);
          setState(prev => ({
            ...prev,
            posts: prev.posts.map(p => 
              p.platform === post.platform ? { ...p, imageUrl, imageLoading: false } : p
            )
          }));
        } catch (err) {
          setState(prev => ({
            ...prev,
            posts: prev.posts.map(p => 
              p.platform === post.platform ? { ...p, imageError: 'Failed to generate image', imageLoading: false } : p
            )
          }));
        }
      });

    } catch (err) {
      console.error(err);
      setState(prev => ({ 
        ...prev, 
        isGenerating: false, 
        error: 'Failed to generate content. Please try again.' 
      }));
    }
  };

  const refreshImage = async (platform: Platform) => {
    setState(prev => ({
      ...prev,
      posts: prev.posts.map(p => 
        p.platform === platform ? { ...p, imageLoading: true, imageError: undefined } : p
      )
    }));

    try {
      const imageUrl = await generateImageForPlatform(platform, visualConcept, newsTopic);
      setState(prev => ({
        ...prev,
        posts: prev.posts.map(p => 
          p.platform === platform ? { ...p, imageUrl, imageLoading: false } : p
        )
      }));
    } catch (err) {
      setState(prev => ({
        ...prev,
        posts: prev.posts.map(p => 
          p.platform === platform ? { ...p, imageError: 'Failed to regenerate image', imageLoading: false } : p
        )
      }));
    }
  };

  return (
    <div className="w-full h-screen bg-slate-950 text-slate-200 flex flex-col font-sans overflow-hidden">
      {/* App Header */}
      <header className="h-16 border-b border-slate-800 flex items-center justify-between px-6 bg-slate-900/50">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center">
            <Cpu className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-lg font-bold tracking-tight text-white">
            Daily Tech Posts <span className="text-accent font-normal">v2.4</span>
          </h1>
        </div>
        <div className="flex items-center gap-4">
          <div className="px-3 py-1 bg-slate-800 rounded-full text-xs font-mono text-slate-400">
            Model: Nano-Banana v4.2
          </div>
          <button 
            onClick={handleGenerate}
            disabled={state.isGenerating || !state.description.trim()}
            className="bg-accent hover:bg-accent-hover text-white px-4 py-1.5 rounded-md text-sm font-medium transition-colors disabled:opacity-50"
          >
            {state.isGenerating ? 'Synthesizing...' : 'Generate All'}
          </button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Editor Sidebar */}
        <aside className="w-80 border-r border-slate-800 p-6 flex flex-col gap-6 bg-slate-950 overflow-y-auto">
          <div className="space-y-4">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Source News Description</label>
            <textarea 
              value={state.description}
              onChange={(e) => setState(prev => ({ ...prev, description: e.target.value }))}
              placeholder="The Nano-Banana architecture has officially reached a breakthrough in edge computing..."
              className="w-full h-48 bg-slate-900 border border-slate-700 rounded-lg p-3 text-sm text-slate-300 focus:outline-none focus:ring-2 focus:ring-accent/50 resize-none transition-all placeholder:text-slate-700"
            />
          </div>

          <div className="space-y-4">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Context Parameters</label>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span>Technical Depth</span>
                <span className="text-accent underline">Expert</span>
              </div>
              <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                <div className="w-[85%] h-full bg-accent"></div>
              </div>
            </div>
            
            {state.error && (
              <div className="p-3 bg-red-900/20 border border-red-500/30 rounded text-[11px] text-red-400 flex items-center gap-2">
                <XCircle className="w-4 h-4 shrink-0" />
                {state.error}
              </div>
            )}

            <div className="flex flex-wrap gap-2 pt-2">
              {visualConcept ? (
                <div className="p-3 bg-slate-900/50 border border-slate-800 rounded-lg w-full">
                  <p className="text-[10px] text-slate-500 font-mono mb-2 uppercase">Current_Theme</p>
                  <p className="text-[11px] text-slate-400 italic">"{visualConcept}"</p>
                </div>
              ) : (
                <>
                  <span className="px-2 py-1 bg-slate-800 rounded text-[10px] text-slate-400">#EdgeComputing</span>
                  <span className="px-2 py-1 bg-slate-800 rounded text-[10px] text-slate-400">#NeuralKernels</span>
                  <span className="px-2 py-1 bg-slate-800 rounded text-[10px] text-slate-400">#NanoBanana</span>
                </>
              )}
            </div>
          </div>

          <footer className="mt-auto pt-6 text-[10px] text-slate-600 font-mono space-y-1">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
              SYSTEM.ARCH.STABLE
            </div>
            <p>LATENCY.OPT: ACTIVE</p>
          </footer>
        </aside>

        {/* Previews Main Area */}
        <main className="flex-1 p-6 overflow-y-auto bg-slate-900/20">
          <AnimatePresence mode="wait">
            {state.posts.length > 0 ? (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="grid grid-cols-1 xl:grid-cols-2 gap-6 h-full content-start"
              >
                {state.posts.map((post) => (
                  <div key={post.platform} className={post.platform === 'Social' ? 'xl:col-span-2' : ''}>
                    <PostCard 
                      post={post} 
                      onRefreshImage={refreshImage} 
                    />
                  </div>
                ))}
              </motion.div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-slate-500 gap-4">
                {state.isGenerating ? (
                  <div className="flex flex-col items-center gap-4">
                    <RefreshCw className="w-12 h-12 text-accent animate-spin" />
                    <p className="font-mono text-xs tracking-widest uppercase animate-pulse">Initializing Synthesis Protocol...</p>
                  </div>
                ) : (
                  <>
                    <Newspaper className="w-16 h-16 opacity-10" />
                    <div className="text-center">
                      <p className="text-sm font-medium">No posts generated yet</p>
                      <p className="text-xs">Describe some tech news to start the engine</p>
                    </div>
                  </>
                )}
              </div>
            )}
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}

function RefreshCw(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
      <path d="M21 3v5h-5" />
      <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
      <path d="M3 21v-5h5" />
    </svg>
  );
}
