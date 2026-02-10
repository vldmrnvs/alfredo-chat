// import confetti from 'canvas-confetti';
// Using CDN due to npm permission issues
declare var confetti: any;

export const triggerCelebration = () => {
    if (typeof confetti !== 'function') return;
    const colors = ['#94F6AD', '#CEFA83', '#2D4A3A', '#132116'];

    (function frame() {
        // Animation loop
        // Let's use a standard implementation for "Fireworks" or "School Pride" from canvas-confetti docs, adapted.

        // Actually, let's do a simple burst first, then maybe a longer stream.
        // User asked for "release a confetti animation".

        // Let's do a "realistic" look
        const count = 200;
        const defaults = { origin: { y: 0.7 } };

        function fire(particleRatio: number, opts: any) {
            confetti({
                ...defaults,
                ...opts,
                particleCount: Math.floor(count * particleRatio),
                colors: colors
            });
        }

        fire(0.25, {
            spread: 26,
            startVelocity: 55,
        });
        fire(0.2, {
            spread: 60,
        });
        fire(0.35, {
            spread: 100,
            decay: 0.91,
            scalar: 0.8
        });
        fire(0.1, {
            spread: 120,
            startVelocity: 25,
            decay: 0.92,
            scalar: 1.2
        });
        fire(0.1, {
            spread: 120,
            startVelocity: 45,
        });
    }());
};
