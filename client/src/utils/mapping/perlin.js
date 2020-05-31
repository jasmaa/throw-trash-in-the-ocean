// perlin.js
// Map generation using perlin noise
// Adapted from https://flafla2.github.io/2014/08/09/perlinnoise.html

import { lerp, fade } from 'src/utils';

let p;

/**
 * Generates permutation from seed
 * 
 * @param {*} seed 
 */
function generatePerm(seed) {
    const xorshift32 = () => {
        seed ^= seed << 13;
        seed ^= seed >> 17;
        seed ^= seed << 5;
        return seed / 0xFFFFFFFF;
    }

    p = new Array(256);
    for (let i = 0; i < 256; i++) {
        p[i] = Math.abs(Math.floor(256 * xorshift32()));
    }
    p = p.concat(p);
}

/**
 * Finds gradient for Perlin noise
 * 
 * @param {*} hash 
 * @param {*} x 
 * @param {*} y 
 * @param {*} z 
 */
function grad(hash, x, y, z) {
    switch (hash & 0xF) {
        case 0x0: return x + y;
        case 0x1: return -x + y;
        case 0x2: return x - y;
        case 0x3: return -x - y;
        case 0x4: return x + z;
        case 0x5: return -x + z;
        case 0x6: return x - z;
        case 0x7: return -x - z;
        case 0x8: return y + z;
        case 0x9: return -y + z;
        case 0xA: return y - z;
        case 0xB: return -y - z;
        case 0xC: return y + x;
        case 0xD: return -y + z;
        case 0xE: return y - x;
        case 0xF: return -y - z;
        default: return 0;
    }
}

/**
 * Perlin noise function
 * 
 * @param {*} x 
 * @param {*} y 
 * @param {*} z 
 */
function perlin(x, y, z) {

    const xi = Math.floor(x) & 0xFFFFFF;
    const yi = Math.floor(y) & 0xFFFFFF;
    const zi = Math.floor(z) & 0xFFFFFF;
    const xf = x - Math.floor(x);
    const yf = y - Math.floor(y);
    const zf = z - Math.floor(z);

    const u = fade(xf);
    const v = fade(yf);
    const w = fade(zf);

    const aaa = p[p[p[xi] + yi] + zi];
    const aba = p[p[p[xi] + yi + 1] + zi];
    const aab = p[p[p[xi] + yi] + zi + 1];
    const abb = p[p[p[xi] + yi + 1] + zi + 1];
    const baa = p[p[p[xi + 1] + yi] + zi];
    const bba = p[p[p[xi + 1] + yi + 1] + zi];
    const bab = p[p[p[xi + 1] + yi] + zi + 1];
    const bbb = p[p[p[xi + 1] + yi + 1] + zi + 1];

    const y1 = lerp(
        lerp(grad(aaa, xf, yf, zf), grad(baa, xf - 1, yf, zf), u),
        lerp(grad(aba, xf, yf - 1, zf), grad(bba, xf - 1, yf - 1, zf), u),
        v,
    );
    const y2 = lerp(
        lerp(grad(aab, xf, yf, zf - 1), grad(bab, xf - 1, yf, zf - 1), u),
        lerp(grad(abb, xf, yf - 1, zf - 1), grad(bbb, xf - 1, yf - 1, zf - 1), u),
        v,
    );

    return (lerp(y1, y2, w) + 1) / 2;
}

/**
 * Generates Perlin noise from size and seed
 * 
 * @param {*} size 
 * @param {*} seed 
 */
export function generatePerlin(size, seed) {

    const buffer = Array(size * size);
    generatePerm(seed);

    const octaves = 4;

    for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {

            let frequency = 1;
            let amplitude = 1;
            let maxValue = 0;
            let total = 0;

            for (let k = 0; k < octaves; k++) {
                total += perlin(5 * frequency * i / size, 5 * frequency * j / size, 0) * amplitude;
                maxValue += amplitude;
                amplitude *= 0.4;
                frequency *= 2;
            }

            buffer[size * i + j] = total / maxValue;
        }
    }

    return buffer;
}