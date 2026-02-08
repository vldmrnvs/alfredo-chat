import React from 'react';
import Header from './Header';
import { useChatStore } from '../store/store';

interface LayoutProps {
    children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
    const { view } = useChatStore();
    const isChat = view !== 'PRE_SIM';

    return (
        <div
            className="h-screen w-full flex flex-col relative overflow-hidden transition-colors duration-500"
            style={{ backgroundColor: isChat ? '#f2f2f7' : 'transparent' }}
        >
            {/* Background Gradients (from CSS) are on body. 
                When isChat is true, this style covers them. 
                When false, transparent lets them show. */}

            <Header />

            {/* Main App Container - Full Width/Height */}
            <main className="flex-1 w-full relative pt-[72px] flex flex-col min-h-0">
                <div className={`w-full h-full flex flex-col relative bg-transparent ${isChat ? '' : 'max-w-5xl mx-auto'}`}>
                    {children}
                </div>
            </main>
        </div>
    );
}
