import { BaseAntenna } from './BaseAntenna.js';

export class Yagi extends BaseAntenna {
    constructor() {
        super();
        // Typical parameters for a 3-element Yagi
        this.params.reflectorSpacing = 0.25;
        this.params.directorSpacing = 0.25;
    }

    getParameters() {
        return [
            { name: 'Reflector Spacing (λ)', key: 'reflectorSpacing', type: 'number', default: 0.25, min: 0.1, max: 0.5, step: 0.01 },
            { name: 'Director Spacing (λ)', key: 'directorSpacing', type: 'number', default: 0.25, min: 0.1, max: 0.5, step: 0.01 },
        ];
    }

    samplePattern(thetaSteps, phiSteps) {
        const k = 2 * Math.PI; // k = 2pi/lambda

        // Element positions (driven element at origin)
        const d_ref = -this.params.reflectorSpacing;
        const d_drv = 0;
        const d_dir = this.params.directorSpacing;

        // Approximate currents and phases for a 3-element Yagi
        // Reflector: lagging phase, smaller current
        // Driven: reference
        // Director: leading phase, smaller current
        const I = [0.6, 1.0, 0.7]; // Magnitudes
        const alpha = [Math.PI / 2, 0, -Math.PI / 2]; // Phases (radians)

        // Element pattern (approximated as half-wave dipoles)
        const elementPattern = (theta) => {
            if (Math.sin(theta) < 1e-6) return 0;
            return Math.abs(Math.cos(Math.PI / 2 * Math.cos(theta)) / Math.sin(theta));
        };

        return this._createGrid(thetaSteps, phiSteps, (theta, phi) => {
            const cosPhi = Math.cos(phi);

            // Array Factor calculation (complex sum)
            let af_real = 0;
            let af_imag = 0;

            const positions = [d_ref, d_drv, d_dir];
            for(let i=0; i < 3; i++) {
                const phase_shift = k * positions[i] * Math.sin(theta) * cosPhi + alpha[i];
                af_real += I[i] * Math.cos(phase_shift);
                af_imag += I[i] * Math.sin(phase_shift);
            }

            const arrayFactor = Math.sqrt(af_real**2 + af_imag**2);

            // Total pattern = element_pattern * array_factor
            return elementPattern(theta) * arrayFactor;
        });
    }
}
