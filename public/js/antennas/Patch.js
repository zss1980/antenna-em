import { BaseAntenna } from './BaseAntenna.js';

export class Patch extends BaseAntenna {
    constructor() {
        super();
        this.params.length = 0.48; // L in wavelengths
        this.params.width = 0.7;   // W in wavelengths
    }

    getParameters() {
        return [
            { name: 'Length (L/λ₀)', key: 'length', type: 'number', default: 0.48, min: 0.1, max: 2, step: 0.01 },
            { name: 'Width (W/λ₀)', key: 'width', type: 'number', default: 0.7, min: 0.1, max: 2, step: 0.01 },
        ];
    }

    samplePattern(thetaSteps, phiSteps) {
        // Simplified cavity model far-field pattern
        const k = 2 * Math.PI;
        const L = this.params.length; // L / lambda
        const W = this.params.width;   // W / lambda

        return this._createGrid(thetaSteps, phiSteps, (theta, phi) => {
            if (theta > Math.PI / 2) return 0; // Radiates in one hemisphere

            const sinTheta = Math.sin(theta);
            const cosPhi = Math.cos(phi);
            const sinPhi = Math.sin(phi);

            let X = (k * W / 2) * sinTheta * sinPhi;
            let Y = (k * L / 2) * sinTheta * cosPhi;

            if (Math.abs(X) < 1e-6) X = 1e-6;
            if (Math.abs(Y) < 1e-6) Y = 1e-6;

            const factorX = Math.sin(X) / X;
            const factorY = Math.cos(Y); // cos because of dominant TM10 mode

            // E-plane (phi=90) is cos(theta), H-plane (phi=0) is product of sinc*cos
            const E_theta = Math.sin(theta) * factorX * factorY;

            // This is a simplification. A more accurate model includes E_phi.
            // For visualization, this captures the main lobe shape well.
            return Math.abs(E_theta);
        });
    }
}
