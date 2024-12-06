import { SimulationEnvironment } from './env.js';

// simulation environment
let env = new SimulationEnvironment();

document.getElementById('start-button').addEventListener('click', () => {
    document.getElementById('start-menu').style.display = 'none';
    env.animate();
});

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
    }
});
