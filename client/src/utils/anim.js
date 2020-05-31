// anim.js
// Animation functions

/**
 * Lerps between two scalars
 * @param {*} a 
 * @param {*} b 
 * @param {*} t 
 */
export const lerp = (a, b, t) => a + (b - a) * t;

/**
 * Fades with time
 * @param {*} t 
 */
export const fade = (t) => t * t * t * (t * (t * 6 - 15) + 10);
