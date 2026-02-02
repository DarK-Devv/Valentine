// Elements
const yesBtn = document.getElementById('yesBtn');
const noBtn = document.getElementById('noBtn');
const noBtnText = document.getElementById('noBtnText');
const mainScreen = document.getElementById('mainScreen');
const celebrationScreen = document.getElementById('celebrationScreen');
const heartsContainer = document.getElementById('heartsContainer');
const confettiContainer = document.getElementById('confettiContainer');
const heartExplosion = document.getElementById('heartExplosion');

// No button messages
const noMessages = [
    "NO 😅",
    "Are you sure? 🥺",
    "Really sure? 😢",
    "That hurts... 💔",
    "Think again! 😰",
    "Please? 🥹",
    "Don't do this... 😭",
    "One more chance? ❤️"
];

let noClickCount = 0;
let noBtnIsAbsolute = false;

// Create floating hearts
function createFloatingHeart() {
    const heart = document.createElement('div');
    heart.className = 'heart';
    heart.innerHTML = '❤️';
    heart.style.left = Math.random() * 100 + '%';
    heart.style.animationDelay = Math.random() * 3 + 's';
    heart.style.fontSize = (Math.random() * 20 + 15) + 'px';
    heartsContainer.appendChild(heart);

    // Remove heart after animation
    setTimeout(() => {
        heart.remove();
    }, 6000);
}

// Generate hearts continuously
setInterval(createFloatingHeart, 300);

// Initial hearts
for (let i = 0; i < 10; i++) {
    setTimeout(createFloatingHeart, i * 200);
}

// No button flee from cursor
function fleeFromCursor(mouseX, mouseY) {
    const container = document.querySelector('.buttons-container');
    const containerRect = container.getBoundingClientRect();
    const noBtnRect = noBtn.getBoundingClientRect();
    const yesBtnRect = yesBtn.getBoundingClientRect();

    // Calculate center of No button
    const noBtnCenterX = noBtnRect.left + noBtnRect.width / 2;
    const noBtnCenterY = noBtnRect.top + noBtnRect.height / 2;

    // Calculate distance from cursor to button center
    const distance = Math.sqrt(
        Math.pow(mouseX - noBtnCenterX, 2) +
        Math.pow(mouseY - noBtnCenterY, 2)
    );

    // Flee threshold (how close cursor needs to be)
    const fleeThreshold = 200;

    if (distance < fleeThreshold) {
        // Make button absolute if not already
        if (!noBtnIsAbsolute) {
            noBtn.classList.add('moved');
            noBtnIsAbsolute = true;
        }

        // Calculate direction away from cursor
        const angle = Math.atan2(noBtnCenterY - mouseY, noBtnCenterX - mouseX);

        // Calculate new position (run away in opposite direction)
        let newX = noBtnCenterX - containerRect.left + Math.cos(angle) * 300;
        let newY = noBtnCenterY - containerRect.top + Math.sin(angle) * 300;

        // Check for collision with Yes button and adjust
        let attempts = 0;
        const maxAttempts = 20;

        while (attempts < maxAttempts) {
            const testLeft = containerRect.left + newX - noBtnRect.width / 2;
            const testTop = containerRect.top + newY - noBtnRect.height / 2;
            const testRight = testLeft + noBtnRect.width;
            const testBottom = testTop + noBtnRect.height;

            const padding = 30;
            const overlapsYes = !(
                testRight < yesBtnRect.left - padding ||
                testLeft > yesBtnRect.right + padding ||
                testBottom < yesBtnRect.top - padding ||
                testTop > yesBtnRect.bottom + padding
            );

            if (!overlapsYes) break;

            // If overlapping, try a different angle
            const randomAngle = Math.random() * Math.PI * 2;
            newX = noBtnCenterX - containerRect.left + Math.cos(randomAngle) * 300;
            newY = noBtnCenterY - containerRect.top + Math.sin(randomAngle) * 300;
            attempts++;
        }

        // Keep within container bounds
        newX = Math.max(noBtnRect.width / 2, Math.min(containerRect.width - noBtnRect.width / 2, newX));
        newY = Math.max(noBtnRect.height / 2, Math.min(containerRect.height - noBtnRect.height / 2, newY));

        // Apply position (adjust for button center)
        noBtn.style.left = (newX - noBtnRect.width / 2) + 'px';
        noBtn.style.top = (newY - noBtnRect.height / 2) + 'px';

        // Change text
        noClickCount++;
        if (noClickCount < noMessages.length) {
            noBtnText.textContent = noMessages[noClickCount];
        }

        // Shake effect
        if (noClickCount > 3) {
            mainScreen.style.animation = 'shake 0.3s';
            setTimeout(() => {
                mainScreen.style.animation = '';
            }, 300);
        }
    }
}

// Track mouse movement
document.addEventListener('mousemove', (e) => {
    fleeFromCursor(e.clientX, e.clientY);
});

// For touch devices, use touch position
document.addEventListener('touchmove', (e) => {
    if (e.touches.length > 0) {
        fleeFromCursor(e.touches[0].clientX, e.touches[0].clientY);
    }
});

// Also flee on click attempt
noBtn.addEventListener('click', (e) => {
    e.preventDefault();
    fleeFromCursor(e.clientX, e.clientY);
});

// Add shake animation to CSS dynamically
const shakeKeyframes = `
@keyframes shake {
    0%, 100% { transform: translateX(0); }
    25% { transform: translateX(-5px); }
    75% { transform: translateX(5px); }
}
`;
const style = document.createElement('style');
style.textContent = shakeKeyframes;
document.head.appendChild(style);

// Yes button click
yesBtn.addEventListener('click', () => {
    // Hide main screen
    mainScreen.classList.add('hidden');

    // Show celebration
    setTimeout(() => {
        celebrationScreen.classList.add('active');
        createConfetti();
        createHeartExplosion();
    }, 500);
});

// Create confetti
function createConfetti() {
    const colors = ['#ff1744', '#f50057', '#c2185b', '#ffc1cc', '#ffb3d9', '#ffd700', '#ffffff'];
    const confettiCount = 150;

    for (let i = 0; i < confettiCount; i++) {
        setTimeout(() => {
            const confetti = document.createElement('div');
            confetti.className = 'confetti';
            confetti.style.left = Math.random() * 100 + '%';
            confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.animationDelay = Math.random() * 0.5 + 's';
            confetti.style.animationDuration = (Math.random() * 2 + 2) + 's';
            confettiContainer.appendChild(confetti);

            // Remove after animation
            setTimeout(() => {
                confetti.remove();
            }, 4000);
        }, i * 20);
    }
}

// Create heart explosion
function createHeartExplosion() {
    const heartCount = 30;
    const hearts = ['❤️', '💕', '💖', '💗', '💓', '💝'];

    for (let i = 0; i < heartCount; i++) {
        const heart = document.createElement('div');
        heart.className = 'explosion-heart';
        heart.innerHTML = hearts[Math.floor(Math.random() * hearts.length)];

        // Random direction
        const angle = (i / heartCount) * 360;
        const distance = 200 + Math.random() * 200;
        const tx = Math.cos(angle * Math.PI / 180) * distance;
        const ty = Math.sin(angle * Math.PI / 180) * distance;

        heart.style.setProperty('--tx', tx + 'px');
        heart.style.setProperty('--ty', ty + 'px');
        heart.style.animationDelay = Math.random() * 0.3 + 's';

        heartExplosion.appendChild(heart);

        // Remove after animation
        setTimeout(() => {
            heart.remove();
        }, 2500);
    }
}

// Prevent context menu on buttons (better mobile experience)
noBtn.addEventListener('contextmenu', (e) => e.preventDefault());
yesBtn.addEventListener('contextmenu', (e) => e.preventDefault());
