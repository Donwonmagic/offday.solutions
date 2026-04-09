/* ============================================================
   OFF DAY SOLUTIONS — Holding Page Interactions
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

    // ── 1. Custom Cursor + Magnetic Physics ─────────────────

    const cursor   = document.getElementById('cursor');
    const follower = document.getElementById('cursor-follower');

    if (window.matchMedia('(any-hover: hover)').matches && cursor && follower) {
        document.body.classList.add('custom-cursor-active');

        let mouseX = window.innerWidth / 2;
        let mouseY = window.innerHeight / 2;
        let followX = mouseX;
        let followY = mouseY;

        document.addEventListener('mousemove', e => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            cursor.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%)`;
        });

        // Spring-lerp follower loop
        (function animateFollower() {
            followX += (mouseX - followX) * 0.13;
            followY += (mouseY - followY) * 0.13;
            follower.style.transform = `translate3d(${followX}px, ${followY}px, 0) translate(-50%, -50%)`;
            requestAnimationFrame(animateFollower);
        })();

        // Magnetic attraction on .hover-magnetic elements
        document.querySelectorAll('.hover-magnetic').forEach(el => {
            el.addEventListener('mousemove', e => {
                const rect = el.getBoundingClientRect();
                const dx = e.clientX - (rect.left + rect.width  / 2);
                const dy = e.clientY - (rect.top  + rect.height / 2);
                el.style.transform = `translate3d(${dx * 0.28}px, ${dy * 0.28}px, 0)`;
                follower.classList.add('magnetic-active');
            });
            el.addEventListener('mouseleave', () => {
                el.style.transform = 'translate3d(0, 0, 0)';
                follower.classList.remove('magnetic-active');
            });
        });
    }


    // ── 2. Split Text Initialisation ────────────────────────

    function initSplitText(selector) {
        document.querySelectorAll(selector).forEach(el => {
            const raw = el.textContent;
            let charIndex = 0;
            const words = raw.trim().split(' ');
            el.innerHTML = words.map((word, wi) => {
                const charSpans = word.split('').map(char =>
                    `<span class="char" style="--i:${charIndex++}" aria-hidden="true">${char}</span>`
                ).join('');
                // Space span inserted between words (not after last word)
                const spaceSpan = wi < words.length - 1
                    ? `<span class="char char--space" style="--i:${charIndex++}" aria-hidden="true">&nbsp;</span>`
                    : '';
                return `<span class="word">${charSpans}</span>${spaceSpan}`;
            }).join('');
            // Preserve accessible text via aria-label
            el.setAttribute('aria-label', raw.trim());
        });
    }

    window._initSplitText = initSplitText; // exposed for i18n re-split
    initSplitText('.split-reveal');


    // ── 3. Intersection Observer (unified reveals) ──────────

    const observerOpts = {
        threshold: 0.08,
        rootMargin: '0px 0px -8% 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
        });
    }, observerOpts);

    // Staggered observer for preview cards
    const cardObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            const index = parseInt(entry.target.dataset.index || '0', 10);
            setTimeout(() => {
                entry.target.classList.add('is-visible');
                // Also trigger inner fade-up children
                entry.target.querySelectorAll('.fade-up').forEach(child => {
                    child.classList.add('is-visible');
                });
                // Trigger the clip reveal
                const wrap = entry.target.querySelector('.reveal-clip');
                if (wrap) wrap.classList.add('is-visible');
            }, index * 140);
            cardObserver.unobserve(entry.target);
        });
    }, { threshold: 0.06, rootMargin: '0px 0px -5% 0px' });

    // Assign data-index and observe preview cards
    document.querySelectorAll('.preview-card').forEach((card, i) => {
        card.dataset.index = i;
        cardObserver.observe(card);
    });

    // Observe all standard reveal targets (hero .fade-up excluded — CSS animation handles those)
    document.querySelectorAll('.fade-up, .reveal-clip, .split-reveal').forEach(el => {
        if (el.closest('.preview-card')) return; // handled by cardObserver
        if (el.closest('.hero')) return;          // handled by CSS animation
        observer.observe(el);
    });


    // ── 4. Nav Scroll Behaviour ─────────────────────────────

    const nav = document.getElementById('store-nav');
    let lastScroll = 0;
    let ticking = false;

    window.addEventListener('scroll', () => {
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(() => {
            const current = window.pageYOffset;
            // Glass effect
            nav.classList.toggle('scrolled', current > 60);
            // Directional hide/show
            if (current > lastScroll && current > 250) {
                nav.classList.add('hidden');
            } else {
                nav.classList.remove('hidden');
            }
            lastScroll = current <= 0 ? 0 : current;
            ticking = false;
        });
    }, { passive: true });


    // ── 5. Parallax on Scroll ───────────────────────────────

    const parallaxImages = document.querySelectorAll('.parallax-img');
    let rafParallax = false;

    window.addEventListener('scroll', () => {
        if (rafParallax) return;
        rafParallax = true;
        requestAnimationFrame(() => {
            const scrollY = window.pageYOffset;
            parallaxImages.forEach(img => {
                const rect = img.getBoundingClientRect();
                if (rect.bottom < 0 || rect.top > window.innerHeight) {
                    rafParallax = false;
                    return;
                }
                const speed = 0.07;
                const offset = -(rect.top * speed);
                img.style.transform = `scale(1.12) translateY(${offset}px)`;
            });
            rafParallax = false;
        });
    }, { passive: true });


    // ── 6. Marquee — handled entirely in CSS ───────────────
    // Animation, loop, and hover-pause are all CSS-driven. No JS needed.


    // ── 7. Waitlist Form ────────────────────────────────────

    const form       = document.getElementById('waitlist-form');
    const successEl  = document.getElementById('waitlist-success');
    const errorEl    = document.getElementById('form-error');
    const emailInput = form ? form.querySelector('.waitlist-input') : null;

    if (form && successEl && emailInput) {
        form.addEventListener('submit', e => {
            e.preventDefault();

            const email = emailInput.value.trim();
            const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

            if (!valid) {
                errorEl.textContent = 'Please enter a valid email address.';
                emailInput.focus();
                return;
            }

            errorEl.textContent = '';

            // Animate form out
            form.style.opacity = '0';
            form.style.transition = 'opacity 0.4s ease';

            setTimeout(() => {
                form.style.display = 'none';
                successEl.style.display = 'block';

                // Trigger opacity transition via rAF
                requestAnimationFrame(() => {
                    requestAnimationFrame(() => {
                        successEl.classList.add('visible');
                    });
                });
            }, 420);
        });

        // Clear error on input
        emailInput.addEventListener('input', () => {
            if (errorEl.textContent) errorEl.textContent = '';
        });
    }


    // ── 8. Smooth-scroll for in-page anchor ─────────────────

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', e => {
            const target = document.querySelector(anchor.getAttribute('href'));
            if (!target) return;
            e.preventDefault();
            const top = target.getBoundingClientRect().top + window.pageYOffset - 80;
            window.scrollTo({ top, behavior: 'smooth' });
        });
    });

});
