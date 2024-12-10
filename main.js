import { SimulationEnvironment } from './env.js';

let env;

const objectSettingsContainer = document.getElementById('object-settings');
const objectCountInput = document.getElementById('object-count');

function updateObjectInputs() {
    const count = parseInt(objectCountInput.value, 10);
    objectSettingsContainer.innerHTML = ''; // Clear existing inputs

    for (let i = 0; i < count; i++) {
        const objectInputDiv = document.createElement('div');
        objectInputDiv.classList.add('object-input');

        objectInputDiv.innerHTML = `
            <label>Object ${i + 1} - </label>
            <label>X: <input id="x-${i}" type="number" value="${(Math.random() * 150- - 50).toFixed(2)}" /></label>
            <label>Y: <input id="y-${i}" type="number" value="${(Math.random() * 150 - 50).toFixed(2)}" /></label>
            <label>Z: <input id="z-${i}" type="number" value="${(Math.random() * 150 - 50).toFixed(2)}" /></label>
            <label>Mass: <input id="mass-${i}" type="number" value="10" min="1" max="50" /></label>
            <label>Color: <input id="color-${i}" type="color" value="#${Math.floor(Math.random() * 16777215).toString(16)}" /></label>
        `;

        objectSettingsContainer.appendChild(objectInputDiv);
    }
}

// Initialize default settings
updateObjectInputs();

// Update inputs when the object count changes
objectCountInput.addEventListener('input', updateObjectInputs);


// Start simulation button logic
document.getElementById('start-button').addEventListener('click', () => {
    const positions = [];
    const masses = [];

    for (let i = 0; i < parseInt(objectCountInput.value, 10); i++) {
        const x = parseFloat(document.getElementById(`x-${i}`).value);
        const y = parseFloat(document.getElementById(`y-${i}`).value);
        const z = parseFloat(document.getElementById(`z-${i}`).value);
        const mass = parseFloat(document.getElementById(`mass-${i}`).value);
        const radius = mass;
        const color = parseInt(document.getElementById(`color-${i}`).value.replace('#', ''), 16);

        positions.push([x, y, z, color, radius]);
        masses.push(mass);
    }

    // Pass the positions, masses, and radii to the simulation environment
    env = new SimulationEnvironment(positions, masses);

    document.getElementById('start-menu').style.display = 'none';
    env.animate();
});

function createHelpMenu() {
    const helpMenu = document.createElement('div');
    helpMenu.id = 'help-menu';
    helpMenu.style.position = 'absolute';
    helpMenu.style.top = '10px';
    helpMenu.style.right = '10px';
    helpMenu.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
    helpMenu.style.color = 'white';
    helpMenu.style.padding = '20px';
    helpMenu.style.borderRadius = '8px';
    helpMenu.style.display = 'none';
    helpMenu.style.zIndex = '1000';

    helpMenu.innerHTML = `<h3>Help Menu</h3>
        <ul>
            <li><b>K:</b> Toggle this help menu</li>
            <li><b>H:</b> Pause/Resume simulation</li>
            <li><b>F:</b> Toggle force vectors</li>
            <li><b>R:</b> Toggle auto rotate</li>

        </ul>
        <p>Use mouse to rotate and zoom in the simulation.</p>
        <p>Made by Caleb Han and Kai Zhou</p>`;

    document.body.appendChild(helpMenu);
    return helpMenu;
}

const helpMenu = createHelpMenu();

document.addEventListener('keydown', (event) => {
    if (event.key === 'h') {
        env.running = !env.running;
    } else if (event.key === 'f') {
        env.showForceVectors = !env.showForceVectors;

        env.forceVectors.forEach((vectorGroup) => {
            if (vectorGroup) {
                vectorGroup.forEach((vector) => {
                    if (vector) vector.visible = env.showForceVectors;
                });
            }
        });

        env.netForceVectors.forEach((vector) => {
            if (vector) vector.visible = env.showForceVectors;
        });

    } else if (event.key === 'k') {
        helpMenu.style.display = helpMenu.style.display === 'none' ? 'block' : 'none';
    } else if (event.key === 'r') {
        env.controls.autoRotate = !env.controls.autoRotate;
        env.controls.autoRotateSpeed = 1.0;
    }
});
