import React from 'react';
import { motion } from 'framer-motion';
import useScrollReveal from '../hooks/useScrollReveal';

/**
 * ScrollReveal Component - Animates children when they enter viewport
 * 
 * @param {string} animation - Animation type: 'fadeIn', 'slideUp', 'slideLeft', 'slideRight', 'scale', 'blur'
 * @param {number} delay - Animation delay in seconds
 * @param {number} duration - Animation duration in seconds
 * @param {boolean} triggerOnce - Whether to trigger animation only once
 */
const ScrollReveal = ({
    children,
    animation = 'fadeIn',
    delay = 0,
    duration = 0.6,
    triggerOnce = true,
    threshold = 0.1,
}) => {
    const { ref, isVisible } = useScrollReveal({ threshold, triggerOnce });

    const animations = {
        fadeIn: {
            hidden: { opacity: 0 },
            visible: { opacity: 1 },
        },
        slideUp: {
            hidden: { opacity: 0, y: 50 },
            visible: { opacity: 1, y: 0 },
        },
        slideDown: {
            hidden: { opacity: 0, y: -50 },
            visible: { opacity: 1, y: 0 },
        },
        slideLeft: {
            hidden: { opacity: 0, x: 50 },
            visible: { opacity: 1, x: 0 },
        },
        slideRight: {
            hidden: { opacity: 0, x: -50 },
            visible: { opacity: 1, x: 0 },
        },
        scale: {
            hidden: { opacity: 0, scale: 0.8 },
            visible: { opacity: 1, scale: 1 },
        },
        blur: {
            hidden: { opacity: 0, filter: 'blur(10px)' },
            visible: { opacity: 1, filter: 'blur(0px)' },
        },
        zoomIn: {
            hidden: { opacity: 0, scale: 0.5 },
            visible: { opacity: 1, scale: 1 },
        },
        rotateIn: {
            hidden: { opacity: 0, rotate: -10 },
            visible: { opacity: 1, rotate: 0 },
        },
    };

    const selectedAnimation = animations[animation] || animations.fadeIn;

    return (
        <motion.div
            ref={ref}
            initial="hidden"
            animate={isVisible ? 'visible' : 'hidden'}
            variants={selectedAnimation}
            transition={{
                duration,
                delay,
                ease: [0.22, 1, 0.36, 1],
            }}
        >
            {children}
        </motion.div>
    );
};

export default ScrollReveal;
