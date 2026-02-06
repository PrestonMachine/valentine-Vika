document.addEventListener('DOMContentLoaded', () => {
    const mainCard = document.getElementById('mainCard');
    const bgMusic = document.getElementById('bgMusic');
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    
    let width, height;
    let particles = [];
    let floatingHeartsInterval;

    // Resize canvas
    function resize() {
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.width = width;
        canvas.height = height;
    }
    
    window.addEventListener('resize', resize);
    resize();

    // Opening animation
    mainCard.addEventListener('click', () => {
        if (!mainCard.classList.contains('open')) {
            mainCard.classList.add('open');
            
            // Play music on opening
            if (bgMusic.paused) {
                bgMusic.volume = 0.3;
                bgMusic.play().catch(e => console.log("Audio play failed:", e));
            }

            // Trigger confetti/hearts explosion
            createExplosion(width/2, height/2);
            startFloatingHearts();
        }
    });

    // Hover sparkles
    document.addEventListener('mousemove', (e) => {
        if(Math.random() > 0.9) {
            createSparkle(e.clientX, e.clientY);
        }
    });

    function createSparkle(x, y) {
        const sparkle = document.createElement('div');
        sparkle.classList.add('sparkle');
        sparkle.style.left = x + 'px';
        sparkle.style.top = y + 'px';
        document.body.appendChild(sparkle);
        setTimeout(() => sparkle.remove(), 1000);
    }

    // Background Particle System
    class Particle {
        constructor() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.vx = (Math.random() - 0.5) * 0.5;
            this.vy = (Math.random() - 0.5) * 0.5;
            this.size = Math.random() * 2;
            this.color = `rgba(255, 77, 109, ${Math.random() * 0.5})`;
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;

            if (this.x < 0) this.x = width;
            if (this.x > width) this.x = 0;
            if (this.y < 0) this.y = height;
            if (this.y > height) this.y = 0;
        }

        draw() {
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    // Initialize background particles
    for (let i = 0; i < 50; i++) {
        particles.push(new Particle());
    }

    // Heart Particle System for "Explosion"
    let hearts = [];
    
    class Heart {
        constructor(x, y) {
            this.x = x;
            this.y = y;
            this.size = Math.random() * 10 + 5;
            this.vx = (Math.random() - 0.5) * 10;
            this.vy = (Math.random() - 1) * 10 - 5; // Upward burst
            this.gravity = 0.2;
            this.opacity = 1;
            this.rotation = Math.random() * 360;
            this.rotationSpeed = (Math.random() - 0.5) * 10;
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;
            this.vy += this.gravity;
            this.opacity -= 0.01;
            this.rotation += this.rotationSpeed;
        }

        draw() {
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.rotate(this.rotation * Math.PI / 180);
            ctx.globalAlpha = this.opacity;
            ctx.fillStyle = '#ff4d6d';
            
            // Draw heart shape
            ctx.beginPath();
            const topCurveHeight = this.size * 0.3;
            ctx.moveTo(0, topCurveHeight);
            ctx.bezierCurveTo(0, 0, -this.size / 2, 0, -this.size / 2, topCurveHeight);
            ctx.bezierCurveTo(-this.size / 2, (this.size + topCurveHeight) / 2, 0, (this.size + topCurveHeight) / 2, 0, this.size);
            ctx.bezierCurveTo(0, (this.size + topCurveHeight) / 2, this.size / 2, (this.size + topCurveHeight) / 2, this.size / 2, topCurveHeight);
            ctx.bezierCurveTo(this.size / 2, 0, 0, 0, 0, topCurveHeight);
            ctx.fill();
            
            ctx.restore();
        }
    }

    function createExplosion(x, y) {
        for(let i=0; i<30; i++) {
            hearts.push(new Heart(x, y));
        }
    }

    function startFloatingHearts() {
        clearInterval(floatingHeartsInterval); // Clear any existing
        floatingHeartsInterval = setInterval(() => {
            if(hearts.length < 50) { // Limit concurrent hearts
                const x = Math.random() * width;
                const h = new Heart(x, height + 20);
                h.vy = -Math.random() * 3 - 2; // Slow float up
                h.gravity = 0; // No gravity for floating hearts
                h.opacity = 0.8;
                hearts.push(h);
            }
        }, 300);
    }

    function animate() {
        ctx.clearRect(0, 0, width, height);
        
        // Update background
        particles.forEach(p => {
            p.update();
            p.draw();
        });

        // Update hearts
        for (let i = hearts.length - 1; i >= 0; i--) {
            hearts[i].update();
            hearts[i].draw();
            if (hearts[i].opacity <= 0) {
                hearts.splice(i, 1);
            }
        }

        requestAnimationFrame(animate);
    }

    animate();

    // Reasons functionality with personalized text
    const reasons = [
        "Ніколи не забуду той вогник у твоїх очах, коли ми вперше обирали твій ноутбук...",
        "Твоя щира посмішка — це моє найбільше натхнення.",
        "Обожнюю ті миті, коли ти ніяковієш і ховаєш погляд у вікно авто. Це так зворушливо.",
        "Навіть твої грайливі 'кусь' для мене приємніші за будь-які дотики.",
        "Твій талант дотепно жартувати наді мною — це окремий вид мистецтва, який я обожнюю.",
        "Наша історія — 'не як у всіх', і саме в цьому її неповторна магія."
    ];

    const btn = document.getElementById('reasonBtn');
    const display = document.getElementById('reasonDisplay');
    const proposalModal = document.getElementById('proposalModal');
    const yesBtn = document.getElementById('yesBtn');
    const noBtn = document.getElementById('noBtn');
    const kissOverlay = document.getElementById('kissOverlay');
    let reasonIndex = 0;

    btn.addEventListener('click', (e) => {
        e.stopPropagation();

        btn.style.transform = 'scale(0.95)';
        setTimeout(() => btn.style.transform = 'scale(1.05)', 100);

        if (reasonIndex < reasons.length) {
            // Show next reason
            display.classList.remove('show');
            setTimeout(() => {
                display.textContent = reasons[reasonIndex];
                display.classList.add('show');
                reasonIndex++;
                
                // Dynamic button text to encourage continuing
                if (reasonIndex === reasons.length) {
                    btn.textContent = "І найголовніше...";
                } else {
                    const nextTexts = [
                        "Це ще не все...", 
                        "А знаєш, що ще?", 
                        "Слухай далі ❤️", 
                        "І ще дещо...", 
                        "Є ще одна причина..."
                    ];
                    // Cycle through texts or pick specific ones 
                    btn.textContent = nextTexts[(reasonIndex - 1) % nextTexts.length];
                }
            }, 300);
        } else {
            // Show Proposal
            proposalModal.classList.add('visible');
            createHugeExplosion();
        }
    });

    yesBtn.addEventListener('click', () => {
        // Celebrate!
        createHugeExplosion();
        createHugeExplosion();
        setTimeout(createHugeExplosion, 500);
        yesBtn.textContent = "Я теж тебе кохаю! ❤️";
        bgMusic.volume = 0.5; // Turn up music
        
        // Hide no button if it's still visible
        noBtn.style.display = 'none';

        // Start curtain sequence and reset after a delay
        setTimeout(() => {
            startHeartCurtain();
            
            // Timeline:
            // T+0: Curtain starts (lasts 5s)
            // T+4s: Kiss appears AND music starts fading
            // T+7s: Kiss disappears
            // T+10s: Reset

            setTimeout(() => {
                kissOverlay.classList.remove('hidden');
                kissOverlay.classList.add('visible');
            }, 4000);

            // Start fading music so it finishes exactly when reset happens (T+10s)
            // Fade takes 4s, so start at T+6s
            setTimeout(fadeOutMusic, 6000);

            setTimeout(() => {
                kissOverlay.classList.remove('visible');
                kissOverlay.classList.add('hidden');
            }, 7000); // Kiss lasts 3s

            // Reset everything after 10s total
            setTimeout(resetExperience, 10000);
        }, 3000);
    });

    // "No" Button Teleport Logic
    function moveNoBtn() {
        // Keep button strictly within the central 60% of the screen
        // avoiding edges completely
        const marginX = window.innerWidth * 0.2; // 20% margin left/right
        const marginY = window.innerHeight * 0.2; // 20% margin top/bottom

        // Ensure we have positive dimensions to work with
        const availableWidth = Math.max(0, window.innerWidth - (marginX * 2) - noBtn.offsetWidth);
        const availableHeight = Math.max(0, window.innerHeight - (marginY * 2) - noBtn.offsetHeight);

        const x = marginX + Math.random() * availableWidth;
        const y = marginY + Math.random() * availableHeight;
        
        noBtn.style.position = 'fixed';
        noBtn.style.left = x + 'px';
        noBtn.style.top = y + 'px';
    }

    noBtn.addEventListener('mouseover', moveNoBtn);
    noBtn.addEventListener('click', moveNoBtn);
    noBtn.addEventListener('touchstart', (e) => {
        e.preventDefault(); // Prevent click
        moveNoBtn();
    });

    function createHugeExplosion() {
        for(let i=0; i<5; i++) {
            setTimeout(() => {
                createExplosion(Math.random()*width, Math.random()*height);
            }, i * 200);
        }
    }

    function startHeartCurtain() {
        canvas.style.zIndex = "200"; // Bring to front to cover everything
        
        // Create a massive amount of hearts falling from top
        const curtainInterval = setInterval(() => {
            for(let i=0; i<40; i++) { // Much denser!
                const x = Math.random() * width;
                const h = new Heart(x, -50 - Math.random() * 200);
                h.vy = Math.random() * 8 + 8; // Faster fall
                h.vx = 0;
                h.gravity = 0;
                h.opacity = 1; // Solid hearts
                h.size = Math.random() * 15 + 10; // Bigger hearts
                hearts.push(h);
            }
        }, 30); // Very frequent updates

        // Stop creating hearts after 5 seconds
        setTimeout(() => {
            clearInterval(curtainInterval);
        }, 5000);
        
        // Reset z-index after they have fallen
        setTimeout(() => {
            canvas.style.zIndex = "0";
        }, 12000); // 5s spawn + time to fall
    }

    function fadeOutMusic() {
        const fadeInterval = setInterval(() => {
            if(bgMusic.volume > 0.05) {
                bgMusic.volume -= 0.05;
            } else {
                bgMusic.volume = 0;
                bgMusic.pause();
                bgMusic.currentTime = 0;
                clearInterval(fadeInterval);
            }
        }, 400); // Slower fade out (approx 4s)
    }

    function resetExperience() {
        clearInterval(floatingHeartsInterval);
        
        // Reset DOM state
        mainCard.classList.remove('open');
        proposalModal.classList.remove('visible');
        display.classList.remove('show');
        display.textContent = '';
        kissOverlay.classList.remove('visible');
        kissOverlay.classList.add('hidden');
        
        reasonIndex = 0;
        btn.textContent = 'Чому ти?';
        yesBtn.textContent = 'ТАК!';
        
        // Reset "No" button
        noBtn.style.display = '';
        noBtn.style.position = ''; // Reset fixed positioning
        noBtn.style.left = '';
        noBtn.style.top = '';

        // NOTE: We do NOT clear hearts here immediately,
        // we let the curtain finish falling down to reveal the reset state.
    }
});

