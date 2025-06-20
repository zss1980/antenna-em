import { BaseAntenna } from './BaseAntenna.js';

export class Dipole extends BaseAntenna {
    constructor() {
        super();
        this.params.length = 0.5; // in wavelengths
    }

    getParameters() {
        return [
            { name: 'Length (in λ)', key: 'length', type: 'number', default: 0.5, min: 0.1, max: 2, step: 0.01 },
        ];
    }

    samplePattern(thetaSteps, phiSteps) {
        const L = this.params.length; // Length in wavelengths
        const kL_half = Math.PI * L; // k*l/2 = (2pi/lambda) * (L*lambda) / 2 = pi*L

        return this._createGrid(thetaSteps, phiSteps, (theta) => {
            if (Math.sin(theta) < 1e-6) return 0; // Avoid division by zero at poles

            const numerator = Math.cos(kL_half * Math.cos(theta)) - Math.cos(kL_half);
            const denominator = Math.sin(theta);

            return Math.abs(numerator / denominator);
        });
    }
}
