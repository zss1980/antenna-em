/**
 * Converts spherical coordinates to Cartesian coordinates.
 * @param {number} r - Radius
 * @param {number} theta - Polar angle (from Z axis), in radians
 * @param {number} phi - Azimuthal angle (in XY plane from X axis), in radians
 * @returns {{x: number, y: number, z: number}}
 */
export function sphericalToCartesian(r, theta, phi) {
    // Three.js uses Y as up, so we swap Z and Y
    // Standard physics: x = r*sin(t)*cos(p), y = r*sin(t)*sin(p), z = r*cos(t)
    // Three.js mapping: x -> x, y -> z, z -> y
    return {
        x: r * Math.sin(theta) * Math.cos(phi),
        y: r * Math.cos(theta),
        z: r * Math.sin(theta) * Math.sin(phi)
    };
}

/**
 * Normalizes an array of linear magnitudes to decibels relative to the max value.
 * @param {Float32Array} values - Array of linear magnitudes (|E|).
 * @param {number} minDb - The minimum dB value to clamp to.
 * @returns {Float32Array} - Array of dB values.
 */
export function normalizeToDb(values, minDb = -60) {
    const maxVal = Math.max(...values.filter(v => isFinite(v) && v > 0));
    if (maxVal === 0) return new Float32Array(values.length).fill(minDb);

    const dbValues = new Float32Array(values.length);
    for (let i = 0; i < values.length; i++) {
        if (values[i] <= 0 || !isFinite(values[i])) {
            dbValues[i] = minDb;
        } else {
            const db = 20 * Math.log10(values[i] / maxVal);
            dbValues[i] = Math.max(minDb, db);
        }
    }
    return dbValues;
}
