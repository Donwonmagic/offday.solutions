/* ============================================================
   OFF DAY SOLUTIONS — Holding Page Interactions
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

    // ── 0. Shared constants + Portfolio feature utilities ────

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const SCRAMBLE_POOL = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%&·—';

    // Cipher-decode scramble for .split-reveal elements (.char spans)
    function scrambleElement(el) {
        if (reducedMotion) {
            el.querySelectorAll('.char:not(.char--space)').forEach(s => {
                s.style.opacity = '1';
                s.style.transform = 'translateY(0)';
            });
            return;
        }
        el.classList.add('scramble-active');
        el.querySelectorAll('.char:not(.char--space)').forEach((span, idx) => {
            const final = span.dataset.finalChar || span.textContent;
            span.dataset.finalChar = final;
            const ITERS = 8, DURATION = 400;
            setTimeout(() => {
                let count = 0;
                const iv = setInterval(() => {
                    if (count >= ITERS) {
                        clearInterval(iv);
                        span.textContent = final;
                        span.style.opacity = '1';
                        span.style.transform = 'translateY(0)';
                        return;
                    }
                    span.textContent = SCRAMBLE_POOL[Math.floor(Math.random() * SCRAMBLE_POOL.length)];
                    span.style.opacity = String(0.3 + (count / ITERS) * 0.7);
                    count++;
                }, DURATION / ITERS);
            }, idx * 30);
        });
    }

    // Cipher-decode scramble for plain-text elements (section labels)
    function scrambleLabelText(el) {
        if (reducedMotion) return;
        const orig = el.dataset.scrambleOrig || el.textContent.trim();
        el.dataset.scrambleOrig = orig;
        let count = 0;
        const iv = setInterval(() => {
            if (count >= 14) { clearInterval(iv); el.textContent = orig; return; }
            el.textContent = orig.split('').map(c =>
                c === ' ' ? ' ' : SCRAMBLE_POOL[Math.floor(Math.random() * SCRAMBLE_POOL.length)]
            ).join('');
            count++;
        }, 35);
    }

    // easeOutExpo ordinal counter (No. 000 → No. 00N)
    function animateOrdinal(el, targetNum, duration) {
        duration = duration || 600;
        const start = performance.now();
        (function tick(now) {
            const t = Math.min((now - start) / duration, 1);
            const eased = t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
            el.textContent = 'No. ' + String(Math.round(eased * targetNum)).padStart(3, '0');
            if (t < 1) requestAnimationFrame(tick);
        })(start);
    }

    // Expose for i18n re-trigger after language switches
    window._scrambleVisible = function(selector) {
        document.querySelectorAll(selector).forEach(el => {
            if (el.classList.contains('is-visible')) {
                el.querySelectorAll('.char').forEach(s => delete s.dataset.finalChar);
                scrambleElement(el);
            }
        });
    };
    window._scrambleLabelText = scrambleLabelText;


    // ── 1. Custom Cursor + Magnetic Physics ─────────────────

    const cursor   = document.getElementById('cursor');
    const follower = document.getElementById('cursor-follower');

    if (window.matchMedia('(any-hover: hover)').matches && !window.matchMedia('(prefers-reduced-motion: reduce)').matches && cursor && follower) {
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
            // Cipher-decode replaces the CSS char fade-in
            if (entry.target.classList.contains('split-reveal')) {
                scrambleElement(entry.target);
            }
            observer.unobserve(entry.target);
        });
    }, observerOpts);

    // Word blur-to-sharp reveal — must be defined before the observe-all loop
    // so it can remove .fade-up before that loop runs (prevents double-observing)
    function initWordBlur(selector) {
        document.querySelectorAll(selector).forEach(el => {
            if (!el.dataset.i18nOrig) el.dataset.i18nOrig = el.innerHTML;
            const tmp = document.createElement('div');
            tmp.innerHTML = el.dataset.i18nOrig;
            const plain = (tmp.textContent || tmp.innerText || '').trim();
            const words = plain.split(/\s+/);
            el.innerHTML = words.map((w, wi) =>
                '<span class="word-unit" style="--wi:' + wi + '">' + w + '</span>'
            ).join(' ');
            el.classList.add('word-blur-reveal');
            el.classList.remove('fade-up');
            if (el.classList.contains('is-visible')) {
                el.classList.remove('is-visible');
                requestAnimationFrame(() => requestAnimationFrame(() => el.classList.add('is-visible')));
            } else {
                observer.observe(el);
            }
        });
    }
    window._initWordBlur = initWordBlur;

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
                // Ordinal count-up — starts 200ms after clip reveal begins
                if (!reducedMotion) {
                    const ordinalEl = entry.target.querySelector('.preview-ordinal');
                    if (ordinalEl) {
                        const match = ordinalEl.textContent.match(/No\.\s*(\d+)/);
                        if (match) {
                            setTimeout(() => animateOrdinal(ordinalEl, parseInt(match[1], 10)), 200);
                        }
                    }
                }
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

    // Word blur-to-sharp on manifesto body — rebuilds innerHTML into word-unit spans.
    // Element is already observed (matched .fade-up above); observer.observe() inside
    // initWordBlur is a no-op since the same observer is already watching it.
    initWordBlur('.manifesto-body');

    // Section label cipher scramble on scroll entry
    const labelObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            setTimeout(() => scrambleLabelText(entry.target), 200);
            labelObserver.unobserve(entry.target);
        });
    }, { threshold: 0.5 });
    document.querySelectorAll('.section-label').forEach(el => {
        if (!el.closest('.hero')) labelObserver.observe(el);
    });

    // ── 3D Card Tilt + Specular Light ───────────────────────
    if (!reducedMotion && window.matchMedia('(any-hover: hover)').matches) {
        document.querySelectorAll('.preview-card').forEach(card => {
            const wrap = card.querySelector('.preview-img-wrap');
            if (!wrap) return;
            card.addEventListener('mousemove', e => {
                const rect = card.getBoundingClientRect();
                const x = (e.clientX - rect.left) / rect.width;
                const y = (e.clientY - rect.top) / rect.height;
                wrap.style.transform = 'perspective(600px) rotateX(' + (-(y - 0.5) * 14) + 'deg) rotateY(' + ((x - 0.5) * 18) + 'deg) scale3d(1.02, 1.02, 1)';
                wrap.style.setProperty('--spec-x', (x * 100) + '%');
                wrap.style.setProperty('--spec-y', (y * 100) + '%');
            });
            card.addEventListener('mouseleave', () => { wrap.style.transform = ''; });
        });
    }


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

    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        let rafParallax = false;

        window.addEventListener('scroll', () => {
            if (rafParallax) return;
            rafParallax = true;
            requestAnimationFrame(() => {
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
    }


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

            // Honeypot: bots that fill hidden fields are silently discarded
            const honeypot = form.querySelector('input[name="website"]');
            if (honeypot && honeypot.value.trim() !== '') {
                form.style.opacity = '0';
                form.style.transition = 'opacity 0.4s ease';
                setTimeout(() => {
                    form.style.display = 'none';
                    successEl.style.display = 'block';
                    requestAnimationFrame(() => successEl.classList.add('visible'));
                }, 420);
                return;
            }

            const email = emailInput.value.trim();
            const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

            if (!valid) {
                errorEl.textContent = 'Please enter a valid email address.';
                emailInput.focus();
                return;
            }

            errorEl.textContent = '';

            // Disable button to prevent double-submission
            const submitBtn = form.querySelector('.waitlist-btn');
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.setAttribute('aria-busy', 'true');
            }

            // Animate form out
            form.style.opacity = '0';
            form.style.transition = 'opacity 0.4s ease';

            setTimeout(() => {
                form.style.display = 'none';
                successEl.style.display = 'block';

                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.removeAttribute('aria-busy');
                }

                // Trigger opacity transition via single rAF
                requestAnimationFrame(() => successEl.classList.add('visible'));
            }, 420);
        });

        // Clear error on input
        emailInput.addEventListener('input', () => {
            if (errorEl.textContent) errorEl.textContent = '';
        });
    }


    // ── 8. Waitlist cursor-tracking glow ────────────────────

    const waitlistFormWrap = document.querySelector('.waitlist-form-wrap');
    if (waitlistFormWrap && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        waitlistFormWrap.addEventListener('mousemove', e => {
            const rect = waitlistFormWrap.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / rect.width) * 100;
            const y = ((e.clientY - rect.top) / rect.height) * 100;
            waitlistFormWrap.style.setProperty('--glow-x', x + '%');
            waitlistFormWrap.style.setProperty('--glow-y', y + '%');
        });
    }


    // ── 9. Smooth-scroll for in-page anchor ─────────────────

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', e => {
            const target = document.querySelector(anchor.getAttribute('href'));
            if (!target) return;
            e.preventDefault();
            const top = target.getBoundingClientRect().top + window.pageYOffset - 80;
            window.scrollTo({ top, behavior: 'smooth' });
        });
    });


    // ── 9. Before You Go — exit intent card ─────────────────

    const bygOverlay  = document.getElementById('byg-overlay');
    const bygClose    = document.getElementById('byg-close');
    const bygForm     = document.getElementById('byg-form');
    const bygSuccess  = document.getElementById('byg-success');
    const bygError    = document.getElementById('byg-error');
    const bygInput    = bygForm ? bygForm.querySelector('.byg-input') : null;
    const BYG_KEY     = 'byg-dismissed';

    function showByg() {
        // Don't show if already dismissed this session, or if main form was submitted
        if (!bygOverlay || sessionStorage.getItem(BYG_KEY)) return;
        bygOverlay.classList.add('is-visible');
        bygOverlay.setAttribute('aria-hidden', 'false');
        // Focus the email input after animation
        setTimeout(() => { if (bygInput) bygInput.focus(); }, 500);
    }

    function dismissByg() {
        if (!bygOverlay) return;
        bygOverlay.classList.remove('is-visible');
        bygOverlay.setAttribute('aria-hidden', 'true');
        sessionStorage.setItem(BYG_KEY, '1');
    }

    if (bygOverlay && bygClose && bygForm && bygInput) {

        // Close button
        bygClose.addEventListener('click', dismissByg);

        // Click outside card
        bygOverlay.addEventListener('click', e => {
            if (e.target === bygOverlay) dismissByg();
        });

        // Escape key
        document.addEventListener('keydown', e => {
            if (e.key === 'Escape' && bygOverlay.classList.contains('is-visible')) dismissByg();
        });

        // Desktop: trigger when mouse leaves toward top of viewport
        const isTouch = window.matchMedia('(any-hover: none)').matches;
        if (!isTouch) {
            document.addEventListener('mouseleave', e => {
                if (e.clientY < 0) showByg();
            });
        } else {
            // Mobile/tablet: show after 30 seconds of engagement
            setTimeout(showByg, 30000);
        }

        // Form submission
        bygForm.addEventListener('submit', e => {
            e.preventDefault();

            // Honeypot check
            const honeypot = bygForm.querySelector('input[name="website"]');
            if (honeypot && honeypot.value.trim() !== '') {
                dismissByg();
                return;
            }

            const email = bygInput.value.trim();
            const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
            if (!valid) {
                bygError.textContent = 'Please enter a valid email address.';
                bygInput.focus();
                return;
            }

            bygError.textContent = '';
            const bygBtn = bygForm.querySelector('.byg-btn');
            if (bygBtn) { bygBtn.disabled = true; bygBtn.setAttribute('aria-busy', 'true'); }

            // Fade form out, show success
            bygForm.style.opacity = '0';
            bygForm.style.transition = 'opacity 0.3s ease';
            setTimeout(() => {
                bygForm.style.display = 'none';
                bygSuccess.classList.add('visible');
                sessionStorage.setItem(BYG_KEY, '1');
                // Auto-close after 2.5s
                setTimeout(dismissByg, 2500);
            }, 320);
        });

        bygInput.addEventListener('input', () => {
            if (bygError.textContent) bygError.textContent = '';
        });
    }

});
