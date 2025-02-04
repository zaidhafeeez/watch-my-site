'use client'

import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Portal from './Portal'

export default function Modal({ isOpen, onClose, children, title }) {
    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === 'Escape') onClose()
        }
        
        document.addEventListener('keydown', handleEscape)
        return () => document.removeEventListener('keydown', handleEscape)
    }, [onClose])

    if (!isOpen) return null

    return (
        <Portal>
            <AnimatePresence>
                <div className="fixed inset-0 overflow-y-auto z-[100]">
                    <div className="min-h-screen px-4 text-center">
                        {/* Overlay */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
                            onClick={onClose}
                            aria-hidden="true"
                        />

                        {/* This element is to trick the browser into centering the modal contents. */}
                        <span
                            className="inline-block h-screen align-middle"
                            aria-hidden="true"
                        >
                            &#8203;
                        </span>

                        {/* Modal */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 10 }}
                            className="inline-block w-full max-w-md p-0
                                     my-8 text-left align-middle
                                     bg-white dark:bg-gray-800
                                     rounded-xl shadow-xl
                                     border border-gray-200 dark:border-gray-700
                                     overflow-hidden
                                     transform transition-all"
                        >
                            {/* Modal Header */}
                            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                                        {title}
                                    </h2>
                                    <button
                                        onClick={onClose}
                                        className="p-2 text-gray-400 hover:text-gray-500 dark:hover:text-gray-300
                                                 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700
                                                 transition-colors"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>
                            </div>

                            {/* Modal Content */}
                            <div className="p-6">
                                {children}
                            </div>
                        </motion.div>
                    </div>
                </div>
            </AnimatePresence>
        </Portal>
    )
}
