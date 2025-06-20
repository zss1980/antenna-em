import { BaseAntenna } from './BaseAntenna.js';

export class Monopole extends BaseAntenna {
    constructor() {
        super();
        this.params.height = 0.25; // in wavelengths
    }

    getParameters() {
        return [
            { name: 'Height (in λ)', key: 'height', type: 'number', default: 0.25, min: 0.1, max: 1, step: 0.01 },
        ];
    }

    samplePattern(thetaSteps, phiSteps) {
        // A monopole is like a dipole of twice the height, radiating only in the upper hemisphere
        const L = this.params.height * 2;
        const kL_half = Math.PI * L;

        return this._createGrid(thetaSteps, phiSteps, (theta) => {
            if (theta > Math.PI / 2) return 0; // No radiation below ground plane
            if (Math.sin(theta) < 1e-6) return 0;

            const numerator = Math.cos(kL_half * Math.cos(theta)) - Math.cos(kL_half);
            const denominator = Math.sin(theta);

            return Math.abs(numerator / denominator);
        });
    }
}
