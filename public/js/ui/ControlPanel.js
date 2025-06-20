export class ControlPanel {
    constructor(formElement, antennaTypes, onChangeCallback) {
        this.form = formElement;
        this.antennaTypes = antennaTypes;
        this.onChange = onChangeCallback;

        this.specificParamsContainer = document.getElementById('specificParams');
        this.antennaTypeSelect = document.getElementById('antennaType');
        this.resolutionSlider = document.getElementById('resolution');
        this.resolutionValueSpan = document.getElementById('resolutionValue');

        this.populateAntennaSelector();
        this.initEventListeners();
    }

    populateAntennaSelector() {
        this.antennaTypeSelect.innerHTML = '';
        this.antennaTypes.forEach(name => {
            const option = document.createElement('option');
            option.value = name;
            // Add spaces before capital letters for display name
            option.textContent = name.replace(/([A-Z])/g, ' $1').trim();
            if (name === 'Dipole') option.textContent = "Half-Wave Dipole";
            if (name === 'Monopole') option.textContent = "Monopole (Ground)";
            if (name === 'Yagi') option.textContent = "3-Element Yagi-Uda";
            if (name === 'Dish') option.textContent = "Parabolic Dish";
            if (name === 'Patch') option.textContent = "Rectangular Patch";
            this.antennaTypeSelect.appendChild(option);
        });
    }

    initEventListeners() {
        this.form.addEventListener('input', (e) => {
            if (e.target.type === 'range') {
                this.resolutionValueSpan.textContent = `${e.target.value}°`;
            }
            this.onChange();
        });
    }

    buildSpecificParams(params) {
        this.specificParamsContainer.innerHTML = '<legend>Specific Parameters</legend>';
        if (!params || params.length === 0) {
            this.specificParamsContainer.style.display = 'none';
            return;
        }

        this.specificParamsContainer.style.display = 'block';

        params.forEach(p => {
            const group = document.createElement('div');
            group.className = 'control-group';

            const label = document.createElement('label');
            label.setAttribute('for', p.key);
            label.textContent = p.name;
            group.appendChild(label);

            const input = document.createElement('input');
            input.type = p.type || 'number';
            input.id = p.key;
            input.name = p.key;
            input.value = p.default;
            if (p.min !== undefined) input.min = p.min;
            if (p.max !== undefined) input.max = p.max;
            if (p.step !== undefined) input.step = p.step;
            group.appendChild(input);

            this.specificParamsContainer.appendChild(group);
        });

        // Trigger an update with new default values
        this.onChange();
    }

    getSettings() {
        const formData = new FormData(this.form);
        const settings = {};
        for (let [key, value] of formData.entries()) {
            settings[key] = isNaN(parseFloat(value)) || key === "antennaType" || key === "viewMode" ? value : parseFloat(value);
        }
        return settings;
    }
}
