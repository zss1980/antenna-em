import * as THREE from 'three';
import { sphericalToCartesian, normalizeToDb } from '../math/spherical.js';

export class PatternMesh {
    constructor() {
        this.mesh = null;
        this.geometry = null;
        this.material = null;
        this.viewMode = 'surface';
        this.resolution = -1;
    }

    getMesh() {
        return this.mesh;
    }

    setMesh(newMesh) {
        this.mesh = newMesh;
    }

    updateGeometry(antenna, resolution, viewMode) {
        const res = parseInt(resolution);
        const { vertices, colors, indices } = this.generatePatternData(antenna, res);

        const resolutionChanged = this.resolution !== res;
        const viewModeChanged = this.viewMode !== viewMode;

        if (!this.mesh || resolutionChanged || viewModeChanged) {
            this.viewMode = viewMode;
            this.resolution = res;
            return this.createMesh(vertices, colors, indices, viewMode);
        } else {
            // Update existing geometry
            this.geometry.attributes.position.array.set(vertices);
            this.geometry.attributes.color.array.set(colors);
            this.geometry.attributes.position.needsUpdate = true;
            this.geometry.attributes.color.needsUpdate = true;
            this.geometry.computeVertexNormals();
            return null; // No new mesh object created
        }
    }

    generatePatternData(antenna, resolution) {
        const rad = Math.PI / 180;
        const thetaSteps = Math.floor(180 / resolution);
        const phiSteps = Math.floor(360 / resolution);

        const magnitudes = antenna.samplePattern(thetaSteps, phiSteps);
        const dbValues = normalizeToDb(magnitudes, -40); // Cap at -40 dB

        const vertices = [];
        const colors = [];
        const indices = [];

        const color = new THREE.Color();

        for (let i = 0; i <= thetaSteps; i++) {
            for (let j = 0; j <= phiSteps; j++) {
                const index = i * (phiSteps + 1) + j;
                const r = magnitudes[index];
                const theta = i * resolution * rad;
                const phi = j * resolution * rad;

                const { x, y, z } = sphericalToCartesian(r, theta, phi);
                vertices.push(x, y, z);

                // Color mapping: 0dB (red) -> -40dB (blue)
                const hue = 0.7 * (1 - (dbValues[index] / -40));
                color.setHSL(Math.max(0, Math.min(0.7, hue)), 0.9, 0.6);
                colors.push(color.r, color.g, color.b);
            }
        }

        for (let i = 0; i < thetaSteps; i++) {
            for (let j = 0; j < phiSteps; j++) {
                const a = i * (phiSteps + 1) + j;
                const b = a + phiSteps + 1;
                const c = b + 1;
                const d = a + 1;
                indices.push(a, b, d);
                indices.push(b, c, d);
            }
        }

        return {
            vertices: new Float32Array(vertices),
            colors: new Float32Array(colors),
            indices: new Uint32Array(indices)
        };
    }

    createMesh(vertices, colors, indices, viewMode) {
        this.geometry = new THREE.BufferGeometry();
        this.geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
        this.geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

        if (viewMode === 'surface') {
            this.geometry.setIndex(new THREE.BufferAttribute(indices, 1));
            this.geometry.computeVertexNormals();
            this.material = new THREE.MeshStandardMaterial({
                vertexColors: true,
                side: THREE.DoubleSide,
                roughness: 0.7,
                metalness: 0.1,
            });
            return new THREE.Mesh(this.geometry, this.material);
        } else { // 'points'
            this.material = new THREE.PointsMaterial({
                vertexColors: true,
                size: 0.05
            });
            return new THREE.Points(this.geometry, this.material);
        }
    }
}
