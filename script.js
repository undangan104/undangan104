/**
 * Islamic Luxury Wedding Invitation
 * JavaScript Logic
 */

document.addEventListener('DOMContentLoaded', () => {

    /* --- URL Parsing for Guest Name --- */
    const urlParams = new URLSearchParams(window.location.search);
    const guestNameParam = urlParams.get('to');
    const guestNameEl = document.getElementById('guest-name');

    if (guestNameParam) {
        // Simple sanitization and decoding
        const decodedName = decodeURIComponent(guestNameParam);
        guestNameEl.textContent = decodedName;
    }

    /* --- Elements --- */
    const body = document.body;
    const openingGate = document.getElementById('opening-gate');
    const btnOpen = document.getElementById('btn-open-invitation');
    const mainContent = document.getElementById('main-content');
    const musicBtn = document.getElementById('music-btn');
    // Using YouTube IFrame API instead of bgMusic element

    // Lock scroll initially
    body.classList.add('locked');

    /* --- Opening Animation & Music --- */
    btnOpen.addEventListener('click', () => {
        // Open Gate
        openingGate.classList.add('open');

        // Show main content
        mainContent.classList.remove('hidden');

        // Unlock scroll after animation
        setTimeout(() => {
            body.classList.remove('locked');
            openingGate.style.display = 'none'; // removing from flow
        }, 2000); // Wait for the transition

        // Play music
        playAudio();
    });

    /* --- Music Control (YouTube) --- */
    let isPlaying = false;

    function playAudio() {
        if (window.ytPlayer && typeof window.ytPlayer.playVideo === 'function') {
            window.ytPlayer.playVideo();
            isPlaying = true;
            musicBtn.classList.remove('hidden');
            musicBtn.classList.add('playing');
            musicBtn.innerHTML = '<i class="ph ph-speaker-high"></i>';
        } else {
            // Player not ready yet, try again
            setTimeout(playAudio, 500);
        }
    }

    function toggleAudio() {
        if (!window.ytPlayer || typeof window.ytPlayer.pauseVideo !== 'function') return;
        if (isPlaying) {
            window.ytPlayer.pauseVideo();
            musicBtn.innerHTML = '<i class="ph ph-speaker-slash"></i>';
            musicBtn.classList.remove('playing');
        } else {
            window.ytPlayer.playVideo();
            musicBtn.innerHTML = '<i class="ph ph-speaker-high"></i>';
            musicBtn.classList.add('playing');
        }
        isPlaying = !isPlaying;
    }

    musicBtn.addEventListener('click', toggleAudio);

    /* --- Countdown Timer --- */
    // Set weddding date (Sabtu, 28 Maret 2026 08:00 WIB)
    // Month is 0-indexed in JS, so March is 2.
    const weddingDate = new Date(2026, 2, 28, 8, 0, 0).getTime();

    function updateCountdown() {
        const now = new Date().getTime();
        const distance = weddingDate - now;

        if (distance < 0) {
            document.querySelector('.countdown-container').innerHTML = "<h3 style='color: var(--gold-base); font-family: var(--font-heading);'>Acara Sedang Berlangsung / Telah Selesai</h3>";
            return;
        }

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        document.getElementById('days').textContent = days.toString().padStart(2, '0');
        document.getElementById('hours').textContent = hours.toString().padStart(2, '0');
        document.getElementById('minutes').textContent = minutes.toString().padStart(2, '0');
        document.getElementById('seconds').textContent = seconds.toString().padStart(2, '0');
    }

    setInterval(updateCountdown, 1000);
    updateCountdown(); // initial call

    /* --- Scroll Reveal Animation --- */
    const revealElements = document.querySelectorAll('.reveal-on-scroll');

    const revealCallback = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Optional: stop observing once revealed
                // observer.unobserve(entry.target);
            }
        });
    };

    const revealOptions = {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    };

    const revealObserver = new IntersectionObserver(revealCallback, revealOptions);
    revealElements.forEach(el => revealObserver.observe(el));

    /* --- RSVP Form Submission --- */
    const rsvpForm = document.getElementById('rsvp-form');
    const rsvpSuccess = document.getElementById('rsvp-success');
    const wishesList = document.getElementById('wishes-list');

    // Load existing wishes from localStorage
    loadWishes();

    rsvpForm.addEventListener('submit', (e) => {
        e.preventDefault();

        // Basic validation and handling
        const name = document.getElementById('name').value;
        const attendance = document.getElementById('attendance').value;
        const message = document.getElementById('message').value;
        const guests = document.getElementById('guests').value;

        if (name && attendance && message) {
            // Save wish
            const newWish = { id: Date.now(), name, attendance, message, guests, date: new Date().toLocaleDateString() };
            saveWish(newWish);

            // Show Success
            rsvpSuccess.classList.remove('hidden');
            rsvpForm.reset();

            // Hide success message after 4s
            setTimeout(() => {
                rsvpSuccess.classList.add('hidden');
            }, 4000);

            // Update List
            loadWishes();
        }
    });

    function saveWish(wish) {
        let wishes = JSON.parse(localStorage.getItem('wedding_wishes')) || [];
        // Add to beginning
        wishes.unshift(wish);
        localStorage.setItem('wedding_wishes', JSON.stringify(wishes));
    }

    function loadWishes() {
        let wishes = JSON.parse(localStorage.getItem('wedding_wishes')) || [];
        wishesList.innerHTML = '';

        if (wishes.length === 0) {
            wishesList.innerHTML = '<p style="text-align:center; color: var(--text-light); opacity: 0.7; font-style: italic;">Jadilah yang pertama untuk memberikan ucapan.</p>';
            return;
        }

        wishes.forEach(wish => {
            const div = document.createElement('div');
            div.className = 'wish-item';

            const badgeClass = wish.attendance === 'hadir' ?
                'style="background: rgba(46, 125, 50, 0.2); color: #a5d6a7;"' :
                'style="background: rgba(198, 40, 40, 0.2); color: #ef9a9a;"';

            const badgeText = wish.attendance === 'hadir' ? `Hadir (${wish.guests})` : 'Tidak Hadir';

            div.innerHTML = `
                <div class="wish-header">
                    <span class="wish-name">${wish.name} <span style="font-size:0.7rem; color: #888; font-weight:normal; margin-left: 5px;">${wish.date}</span></span>
                    <span class="wish-label" ${badgeClass}>${badgeText}</span>
                </div>
                <p style="font-size: 0.9rem; color: var(--text-light); margin-top: 5px;">"${wish.message}"</p>
            `;
            wishesList.appendChild(div);
        });
    }

    /* --- Copy to Clipboard for Digital Gift --- */
    const copyButtons = document.querySelectorAll('.btn-copy');
    copyButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const nomer = btn.getAttribute('data-nomer');
            navigator.clipboard.writeText(nomer).then(() => {
                const originalText = btn.innerHTML;
                btn.innerHTML = '<i class="ph ph-check"></i> Berhasil Disalin';
                btn.style.background = 'rgba(46, 125, 50, 0.2)';
                btn.style.borderColor = '#2e7d32';
                btn.style.color = '#a5d6a7';

                setTimeout(() => {
                    btn.innerHTML = originalText;
                    btn.style.background = '';
                    btn.style.borderColor = '';
                    btn.style.color = '';
                }, 3000);
            }).catch(err => {
                console.error('Failed to copy: ', err);
                alert('Gagal menyalin. Silakan salin manual.');
            });
        });
    });

    /* --- Background Floating Gold Particles --- */
    initParticles();
});

function initParticles() {
    const canvas = document.getElementById('particles-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');

    // Resize canvas
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    const particles = [];
    // Reduced count for subtle luxury effect
    const particleCount = window.innerWidth < 768 ? 20 : 40;

    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            // Very small particles
            this.size = Math.random() * 2 + 0.5;
            // Slow upward drift
            this.speedY = Math.random() * 0.5 + 0.1;
            this.speedX = (Math.random() - 0.5) * 0.3;
            // Gold colors with variance
            const alpha = Math.random() * 0.5 + 0.1;
            const colors = [
                `rgba(212, 175, 55, ${alpha})`, // Gold base
                `rgba(243, 229, 171, ${alpha})`, // Gold light
                `rgba(255, 255, 255, ${alpha - 0.1})` // White sparkle
            ];
            this.color = colors[Math.floor(Math.random() * colors.length)];

            // Sparkle effect
            this.sparkleP = Math.random() * Math.PI * 2;
            this.sparkleS = Math.random() * 0.05 + 0.01;
        }

        update() {
            this.y -= this.speedY;
            this.x += this.speedX;

            this.sparkleP += this.sparkleS;

            // Reset to bottom when off top
            if (this.y < -10) {
                this.y = canvas.height + 10;
                this.x = Math.random() * canvas.width;
            }
            if (this.x > canvas.width + 10) this.x = -10;
            if (this.x < -10) this.x = canvas.width + 10;
        }

        draw() {
            ctx.beginPath();

            // Adding sparkle scaling
            const currentSize = this.size + Math.sin(this.sparkleP) * (this.size * 0.5);

            ctx.arc(this.x, this.y, Math.max(0.1, currentSize), 0, Math.PI * 2);
            ctx.fillStyle = this.color;
            ctx.fill();

            // Glow for slightly larger particles
            if (this.size > 1.5) {
                ctx.shadowBlur = 5;
                ctx.shadowColor = '#d4af37';
            } else {
                ctx.shadowBlur = 0;
            }
        }
    }

    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        particles.forEach(p => {
            p.update();
            p.draw();
        });

        requestAnimationFrame(animate);
    }

    animate();
}

// YouTube IFrame API initialization (Global scope)
window.onYouTubeIframeAPIReady = function () {
    window.ytPlayer = new YT.Player('youtube-audio', {
        height: '0',
        width: '0',
        videoId: '8bWRU2ipOwA',
        playerVars: {
            'autoplay': 0,
            'controls': 0,
            'showinfo': 0,
            'rel': 0,
            'loop': 1,
            'playlist': 'oZKK8SZnqOY'
        }
    });
};
