// diamondSquare.js
// Map generation using diamond square algo

/**
 * Diamond square noise generation
 * @param {*} size 
 * @param {*} seed 
 */
const diamondSquare = (size, seed) => {
    const buffer = Array(size * size);
    let currSize = size - 1;

    const xorshift32 = () => {
        seed ^= seed << 13;
        seed ^= seed >> 17;
        seed ^= seed << 5;
        return seed / 0xFFFFFFFF;
    }

    // Seed corners
    for (let i = 0; i < size; i += currSize) {
        for (let j = 0; j < size; j += currSize) {
            buffer[size * i + j] = Math.abs(xorshift32());
        }
    }
    currSize /= 2;

    while (currSize >= 1) {

        // Diamond
        for (let i = currSize; i < size; i += 2 * currSize) {
            for (let j = currSize; j < size; j += 2 * currSize) {
                
                let n = 0;
                let s = 0;

                if (i - currSize >= 0 && j - currSize >= 0) {
                    s += buffer[size * (i - currSize) + (j - currSize)]
                    n++;
                }
                if (i - currSize >= 0 && j + currSize < size) {
                    s += buffer[size * (i - currSize) + (j + currSize)]
                    n++;
                }
                if (i + currSize < size && j - currSize >= 0) {
                    s += buffer[size * (i + currSize) + (j - currSize)]
                    n++;
                }
                if (i + currSize < size && j + currSize < size) {
                    s += buffer[size * (i + currSize) + (j + currSize)]
                    n++;
                }
                buffer[size * i + j] = Math.abs((s + xorshift32()) / n);
            }
        }

        // Square
        for (let i = 0; i < size; i += currSize) {
            for (let j = 0; j < size; j += currSize) {

                if (buffer[size * i + j] == undefined) {
                    let n = 0;
                    let s = 0;

                    if (i - currSize >= 0) {
                        s += buffer[size * (i - currSize) + j]
                        n++;
                    }
                    if (i + currSize < size) {
                        s += buffer[size * (i + currSize) + j]
                        n++;
                    }
                    if (j - currSize >= 0) {
                        s += buffer[size * i + (j - currSize)]
                        n++;
                    }
                    if (j + currSize < size) {
                        s += buffer[size * i + (j + currSize)]
                        n++;
                    }
                    buffer[size * i + j] = Math.abs((s + xorshift32()) / n);
                }
            }
        }
        currSize /= 2;
    }

    return buffer;
}

module.exports = {
    diamondSquare: diamondSquare,
}