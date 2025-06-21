import { SceneManager } from './scene/SceneManager.js';
import { ControlPanel } from './ui/ControlPanel.js';
import { PatternMesh } from './scene/PatternMesh.js';
import { Dipole, Monopole, Patch, Dish, Yagi } from './antennas/index.js';

class App {
    constructor() {
        this.sceneManager = null;
        this.controlPanel = null;
        this.patternMesh = null;
        this.currentAntenna = null;

        this.ANTENNA_CLASSES = {
            Dipole, Monopole, Yagi, Dish, Patch
        };

        this.loader = document.getElementById('loader');
        this.init();
    }

    init() {
        this.showLoader(true);

        const canvas = document.getElementById('emScene');
        this.sceneManager = new SceneManager(canvas);

        this.controlPanel = new ControlPanel(
            document.getElementById('controlForm'),
            Object.keys(this.ANTENNA_CLASSES),
            () => this.onControlsChanged()
        );

        this.patternMesh = new PatternMesh();
        this.sceneManager.add(this.patternMesh.getMesh());

        this.setupEventListeners();

        // Initial setup
        const initialSettings = this.controlPanel.getSettings();
        this.changeAntenna(initialSettings.antennaType);
        this.updatePattern();

        this.sceneManager.start();
        this.showLoader(false);
    }

    showLoader(visible) {
        this.loader.style.display = visible ? 'block' : 'none';
    }

    setupEventListeners() {
        document.getElementById('exportBtn').addEventListener('click', () => {
            this.sceneManager.exportPNG();
        });
        document.getElementById('resetBtn').addEventListener('click', () => {
            this.sceneManager.resetControls();
        });
        document.getElementById('themeToggle').addEventListener('click', () => {
            const body = document.documentElement;
            body.classList.toggle('light-mode');
            const isLight = body.classList.contains('light-mode');
            document.getElementById('themeToggle').textContent = isLight ? '🌙' : '☀️';
            this.sceneManager.updateTheme(isLight);
        });

        const menuBtn = document.getElementById('menuToggle');
        if (menuBtn) {
            menuBtn.addEventListener('click', () => {
                document.getElementById('controls').classList.toggle('open');
            });
        }
    }

    onControlsChanged() {
        const settings = this.controlPanel.getSettings();

        // Check if antenna type has changed
        if (this.currentAntenna.constructor.name !== settings.antennaType) {
            this.changeAntenna(settings.antennaType);
        }

        this.updatePattern();
    }

    changeAntenna(typeName) {
        if (this.ANTENNA_CLASSES[typeName]) {
            this.currentAntenna = new this.ANTENNA_CLASSES[typeName]();
            this.controlPanel.buildSpecificParams(this.currentAntenna.getParameters());
        }
    }

    async updatePattern() {
        this.showLoader(true);
        // Use a timeout to allow the loader to render before the heavy computation
        await new Promise(resolve => setTimeout(resolve, 10));

        const settings = this.controlPanel.getSettings();
        this.currentAntenna.updateParams(settings);

        const newMesh = this.patternMesh.updateGeometry(
            this.currentAntenna,
            settings.resolution,
            settings.viewMode
        );

        if (newMesh) {
            this.sceneManager.replace(this.patternMesh.getMesh(), newMesh);
            this.patternMesh.setMesh(newMesh);
        }

        this.showLoader(false);
    }
}

window.addEventListener('DOMContentLoaded', () => new App());
