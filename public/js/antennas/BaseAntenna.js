export class BaseAntenna {
    constructor() {
        this.params = {
            frequency: 300, // MHz
            power: 1, // W
        };
        this.c = 299792458; // speed of light m/s
    }

    // This should be overridden by subclasses
    getParameters() {
        return [];
    }

    updateParams(newParams) {
        Object.assign(this.params, newParams);
        this.wavelength = (this.c / (this.params.frequency * 1e6));
    }

    // This MUST be implemented by subclasses
    // returns a Float32Array of magnitudes
    samplePattern(thetaSteps, phiSteps) {
        throw new Error("samplePattern() must be implemented by subclasses.");
    }

    _createGrid(thetaSteps, phiSteps, calculationFn) {
        const rad = Math.PI / 180;
        const magnitudes = new Float32Array((thetaSteps + 1) * (phiSteps + 1));
        const resolution = 180 / thetaSteps;

        for (let i = 0; i <= thetaSteps; i++) {
            for (let j = 0; j <= phiSteps; j++) {
                const theta = i * resolution * rad;
                const phi = j * resolution * rad;
                const index = i * (phiSteps + 1) + j;
                magnitudes[index] = calculationFn(theta, phi);
            }
        }
        return magnitudes;
    }
}
