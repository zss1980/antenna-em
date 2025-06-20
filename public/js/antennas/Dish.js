import { BaseAntenna } from './BaseAntenna.js';

export class Dish extends BaseAntenna {
    constructor() {
        super();
        this.params.diameter = 10; // in wavelengths
        this.params.efficiency = 0.6;
    }

    getParameters() {
        return [
            { name: 'Diameter (D/λ)', key: 'diameter', type: 'number', default: 10, min: 1, max: 50, step: 0.5 },
            { name: 'Efficiency (η)', key: 'efficiency', type: 'number', default: 0.6, min: 0.1, max: 1.0, step: 0.01 },
        ];
    }

    // Bessel function J1(x) - approximation for visualization is fine
    _J1(x) {
        if (x === 0) return 0;
        return Math.sin(x)/x**2 - Math.cos(x)/x;
    }

    samplePattern(thetaSteps, phiSteps) {
        const D_lambda = this.params.diameter;

        return this._createGrid(thetaSteps, phiSteps, (theta) => {
            if (theta > Math.PI / 2) return 0; // Simplified: No back-lobes

            const sin_theta = Math.sin(theta);
            if (sin_theta < 1e-9) return this.params.efficiency; // Maximum at theta=0

            const x = Math.PI * D_lambda * sin_theta;

            // Airy disk pattern approximation: |2*J1(x)/x|^2
            // We use the field strength, so |2*J1(x)/x|
            const pattern = Math.abs(2 * this._J1(x) / x);

            return this.params.efficiency * pattern;
        });
    }
}
