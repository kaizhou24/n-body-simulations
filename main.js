import { SimulationEnvironment } from './env.js';

// simulation environment
let env = new SimulationEnvironment();

// Start button functionality
document.getElementById('start-button').addEventListener('click', () => {
    document.getElementById('start-menu').style.display = 'none';
    env.animate();
});

// Create and manage the help menu
function createHelpMenu() {
    const helpMenu = document.createElement('div');
    helpMenu.id = 'help-menu'; // Set an ID for easier management
    helpMenu.style.position = 'absolute';
    helpMenu.style.top = '10px';
    helpMenu.style.right = '10px';
    helpMenu.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
    helpMenu.style.color = 'white';
    helpMenu.style.padding = '20px';
    helpMenu.style.borderRadius = '8px';
    helpMenu.style.display = 'none'; // Initially hidden
    helpMenu.style.zIndex = '1000';

    helpMenu.innerHTML = `
        <h3>Help Menu</h3>
        <ul>
            <li><b>K:</b> Toggle this help menu</li>
            <li><b>H:</b> Pause/Resume simulation</li>
            <li><b>F:</b> Toggle force vectors</li>
        </ul>
        <p>Use mouse to rotate and zoom in the simulation.</p>
    `;

    document.body.appendChild(helpMenu);
    return helpMenu;
}

// Initialize the help menu
const helpMenu = createHelpMenu();

// Keyboard controls
document.addEventListener('keydown', (event) => {
    if (event.key === 'h') {
        env.running = !env.running;
        console.log(env.running ? "Simulation Resumed" : "Simulation Paused");
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

        console.log(env.showForceVectors ? "Force Vectors Visible" : "Force Vectors Hidden");
    } else if (event.key === 'k' || event.key === 'K') {
        // Toggle the help menu visibility
        helpMenu.style.display = helpMenu.style.display === 'none' ? 'block' : 'none';
    }
});
