document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. Weightless Custom Cursor & Magnetic Physics ---
    const cursor = document.getElementById('cursor');
    const follower = document.getElementById('cursor-follower');
    
    // Only init if device supports hover
    if (window.matchMedia("(any-hover: hover)").matches) {
        document.body.classList.add('custom-cursor-active'); // Safely hide native cursor
        
        let mouseX = window.innerWidth / 2;
        let mouseY = window.innerHeight / 2;
        let followerX = mouseX;
        let followerY = mouseY;
        
        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            // Update dot instantly
            cursor.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
        });

        // Spring animation loop for the follower ring
        function animateFollower() {
            // Lerp (Linear Interpolation) for weightless lag effect
            followerX += (mouseX - followerX) * 0.15;
            followerY += (mouseY - followerY) * 0.15;
            follower.style.transform = `translate3d(${followerX}px, ${followerY}px, 0)`;
            requestAnimationFrame(animateFollower);
        }
        animateFollower();

        // Magnetic Buttons Logic
        const magnetics = document.querySelectorAll('.hover-magnetic');
        magnetics.forEach(btn => {
            btn.addEventListener('mousemove', (e) => {
                const rect = btn.getBoundingClientRect();
                const h = rect.width / 2;
                const v = rect.height / 2;
                const x = e.clientX - rect.left - h;
                const y = e.clientY - rect.top - v;
                
                // Gently pull the button towards the mouse
                btn.style.transform = `translate3d(${x * 0.3}px, ${y * 0.3}px, 0)`;
                follower.classList.add('magnetic-active');
            });
            btn.addEventListener('mouseleave', () => {
                btn.style.transform = `translate3d(0, 0, 0)`;
                follower.classList.remove('magnetic-active');
            });
        });
    }

    // --- 2. Parallax & Nav Scroll Logic ---
    const nav = document.getElementById('store-nav');
    const parallaxImages = document.querySelectorAll('.parallax-img');
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        // Glass Nav Logic
        if (currentScroll > 50) { nav.classList.add('scrolled'); } 
        else { nav.classList.remove('scrolled'); }

        // Hide/Show Nav Directionally
        if (currentScroll > lastScroll && currentScroll > 200 && !document.getElementById('cart-drawer').classList.contains('active')) {
            nav.classList.add('hidden');
        } else {
            nav.classList.remove('hidden');
        }
        
        // Weightless Parallax Calculation
        parallaxImages.forEach(img => {
            const speed = 0.08;
            // Only transform if in viewport (optimization)
            const rect = img.getBoundingClientRect();
            if(rect.top < window.innerHeight && rect.bottom > 0) {
                const yPos = -(rect.top * speed);
                img.style.transform = `translate3d(0, ${yPos}px, 0)`;
            }
        });

        lastScroll = currentScroll;
    });

    // --- 3. Intersection Observers (The Reveals) ---
    const revealOptions = { threshold: 0.1, rootMargin: "0px 0px -10% 0px" };
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, revealOptions);

    document.querySelectorAll('.reveal-clip, .fade-up').forEach(el => observer.observe(el));

    // --- 4. Cart State Engine ---
    const cartDrawer = document.getElementById('cart-drawer');
    const cartOverlay = document.getElementById('cart-overlay');
    const cartCountEl = document.getElementById('cart-count');
    const cartBody = document.getElementById('cart-body');
    const checkoutBtn = document.getElementById('checkout-btn');
    const cartTotalEl = document.getElementById('cart-total-price');
    
    let cartState = { items: [], total: 0 };

    window.toggleCart = function() {
        const isActive = cartDrawer.classList.contains('active');
        cartDrawer.classList.toggle('active');
        cartOverlay.classList.toggle('active');
        document.body.style.overflow = isActive ? '' : 'hidden';
    };

    window.mockAddToCart = function(title, price, imageSrc) {
        cartState.items.push({ title, price, imageSrc });
        cartState.total += price;
        cartCountEl.innerText = cartState.items.length;
        renderCartUI();
        
        if (!cartDrawer.classList.contains('active')) window.toggleCart();
        
        // Interaction feedback
        checkoutBtn.style.background = '#C9A84C'; 
        checkoutBtn.style.color = '#000';
        setTimeout(() => {
            checkoutBtn.style.background = '';
            checkoutBtn.style.color = '';
        }, 800);
    };

    function renderCartUI() {
        if (cartState.items.length === 0) {
            cartBody.innerHTML = '<span class="empty-cart-msg">Your bag is currently empty.</span>';
            cartTotalEl.innerText = '$0.00';
            return;
        }
        cartBody.innerHTML = cartState.items.map((item, index) => `
            <div class="cart-item">
                <img src="${item.imageSrc}" class="cart-item-img" alt="${item.title}">
                <div class="cart-item-details">
                    <h4 class="cart-item-title">${item.title}</h4>
                    <p class="cart-item-price">$${item.price}.00</p>
                    <button class="cart-item-remove hover-magnetic" onclick="removeMockItem(${index})">Remove</button>
                </div>
            </div>
        `).join('');
        cartTotalEl.innerText = `$${cartState.total}.00`;
        
        // Re-init magnetics for dynamic buttons
        const newMagnetics = cartBody.querySelectorAll('.hover-magnetic');
        newMagnetics.forEach(btn => { /* Attach magnetic listeners if needed here */ });
    }

    window.removeMockItem = function(index) {
        cartState.total -= cartState.items[index].price;
        cartState.items.splice(index, 1);
        cartCountEl.innerText = cartState.items.length;
        renderCartUI();
    };
});        });
    }, observerOptions);

    document.querySelectorAll('.product-card').forEach(el => {
        revealObserver.observe(el);
    });

    // --- 3. Smart Sticky Navigation ---
    const nav = document.getElementById('store-nav');
    const cartDrawer = document.getElementById('cart-drawer');
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        // Don't hide nav if at the top
        if (currentScroll <= 0) { 
            nav.classList.remove('hidden');
            return; 
        }
        
        // Hide nav on scroll down, show on scroll up. 
        // NEVER hide if the cart drawer is currently open.
        if (currentScroll > lastScroll && !cartDrawer.classList.contains('active')) {
            nav.classList.add('hidden');
        } else {
            nav.classList.remove('hidden');
        }
        
        lastScroll = currentScroll;
    });

    // --- 4. Cart Drawer UI Logic ---
    const cartOverlay = document.getElementById('cart-overlay');
    const cartCountEl = document.getElementById('cart-count');
    const cartBody = document.getElementById('cart-body');
    const checkoutBtn = document.getElementById('checkout-btn');
    const cartTotalEl = document.getElementById('cart-total-price');
    
    let cartState = {
        items: [],
        total: 0
    };

    // Make toggleCart globally available for HTML onclick attributes
    window.toggleCart = function() {
        const isActive = cartDrawer.classList.contains('active');
        
        if (isActive) {
            cartDrawer.classList.remove('active');
            cartOverlay.classList.remove('active');
            document.body.style.overflow = ''; // Restore scrolling
        } else {
            cartDrawer.classList.add('active');
            cartOverlay.classList.add('active');
            document.body.style.overflow = 'hidden'; // Lock background scrolling
        }
    };

    // Make mockAddToCart globally available
    window.mockAddToCart = function(title, price, imageSrc) {
        // 1. Add to state
        cartState.items.push({ title, price, imageSrc });
        cartState.total += price;
        
        // 2. Update Header Count
        cartCountEl.innerText = cartState.items.length;
        
        // 3. Render Cart HTML
        renderCartUI();
        
        // 4. Open Cart to show feedback
        if (!cartDrawer.classList.contains('active')) {
            window.toggleCart();
        }
        
        // 5. Visual confirmation on button
        checkoutBtn.style.background = '#C9A84C'; // Flash Gold
        checkoutBtn.style.color = '#000';
        setTimeout(() => {
            checkoutBtn.style.background = '';
            checkoutBtn.style.color = '';
        }, 800);
    };

    // Internal function to redraw the cart contents
    function renderCartUI() {
        if (cartState.items.length === 0) {
            cartBody.innerHTML = '<span class="empty-cart-msg">Your bag is currently empty.</span>';
            cartTotalEl.innerText = '$0.00';
            checkoutBtn.innerText = 'Checkout';
            return;
        }

        // Map over items and create HTML string
        const itemsHTML = cartState.items.map((item, index) => `
            <div class="cart-item">
                <img src="${item.imageSrc}" class="cart-item-img" alt="${item.title}">
                <div class="cart-item-details">
                    <div>
                        <h4 class="cart-item-title">${item.title}</h4>
                        <p class="cart-item-price">$${item.price}.00</p>
                    </div>
                    <button class="cart-item-remove" onclick="removeMockItem(${index})">Remove</button>
                </div>
            </div>
        `).join('');

        cartBody.innerHTML = itemsHTML;
        cartTotalEl.innerText = `$${cartState.total}.00`;
        checkoutBtn.innerText = 'Proceed to Checkout';
    }

    // Global function to remove items
    window.removeMockItem = function(index) {
        const itemPrice = cartState.items[index].price;
        cartState.total -= itemPrice;
        cartState.items.splice(index, 1);
        
        cartCountEl.innerText = cartState.items.length;
        renderCartUI();
    };

});    const cursorBlur = document.getElementById('cursor-blur');
    const hoverTriggers = document.querySelectorAll('.hover-trigger');

    if (window.matchMedia("(min-width: 768px)").matches && cursor && cursorBlur) {
        let mx = -100, my = -100;
        let bx = -100, by = -100;
        let prevMx = mx, prevMy = my;

        document.addEventListener('mousemove', (e) => {
            mx = e.clientX;
            my = e.clientY;
            if (cursor.style.opacity !== '1') {
                cursor.style.opacity = '1';
                cursorBlur.style.opacity = '1';
            }
        }, { passive: true });

        (function loop() {
            // Velocity for this frame
            const vx = mx - prevMx;
            const vy = my - prevMy;
            prevMx = mx;
            prevMy = my;

            const speed = Math.sqrt(vx * vx + vy * vy);
            const angle = Math.atan2(vy, vx) * (180 / Math.PI);

            // Stretch blob in direction of travel, squish perpendicular
            const scaleX = 1 + Math.min(speed * 0.045, 0.65);
            const scaleY = 1 - Math.min(speed * 0.016, 0.28);

            cursor.style.transform = `translate(calc(${mx}px - 50%), calc(${my}px - 50%))`;

            bx += (mx - bx) * 0.12;
            by += (my - by) * 0.12;
            cursorBlur.style.transform =
                `translate(calc(${bx}px - 50%), calc(${by}px - 50%))
                 rotate(${angle}deg)
                 scaleX(${scaleX})
                 scaleY(${scaleY})`;

            requestAnimationFrame(loop);
        })();

        hoverTriggers.forEach(trigger => {
            trigger.addEventListener('mouseenter', () => document.body.classList.add('hovering'));
            trigger.addEventListener('mouseleave', () => document.body.classList.remove('hovering'));
        });

        document.querySelectorAll('.gold-btn, .access-cta').forEach(btn => {
            btn.addEventListener('mouseenter', () => document.body.classList.add('cursor-on-gold'));
            btn.addEventListener('mouseleave', () => document.body.classList.remove('cursor-on-gold'));
        });
    }

    // --- 2.5 MOBILE GHOST CURSOR ---
    const isMobile = window.matchMedia("(max-width: 768px)").matches;

    if (isMobile && cursor && cursorBlur) {
        const moveCursor = (e) => {
            const touch = e.touches[0];
            cursor.style.transform = `translate(calc(${touch.clientX}px - 50%), calc(${touch.clientY}px - 50%))`;
            cursorBlur.style.transform = `translate(calc(${touch.clientX}px - 50%), calc(${touch.clientY}px - 50%))`;
        };

        document.addEventListener('touchstart', (e) => {
            document.body.classList.add('touching');
            moveCursor(e);
        });
        document.addEventListener('touchmove', (e) => { moveCursor(e); });
        document.addEventListener('touchend', () => {
            setTimeout(() => { document.body.classList.remove('touching'); }, 200);
        });
    }
    
    // --- 3. SCROLL SPY (updated for new sections) ---
    const sections = document.querySelectorAll('section, footer');
    const dots = document.querySelectorAll('.dot');
    const observerOptions = { threshold: 0.1 };
    const spyObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const index = Array.from(sections).indexOf(entry.target);
                dots.forEach(dot => dot.classList.remove('active'));
                if(dots[index]) dots[index].classList.add('active');
            }
        });
    }, observerOptions);
    sections.forEach(section => spyObserver.observe(section));

    // --- 3.5. CLICKABLE PROGRESS DOTS ---
    dots.forEach(dot => {
        dot.style.cursor = 'pointer';
        dot.style.pointerEvents = 'auto';
        dot.addEventListener('click', () => {
            const targetId = dot.getAttribute('data-target');
            const targetEl = document.getElementById(targetId);
            if (targetEl) {
                targetEl.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // ============================================
    // NEW: SCROLL-DRIVEN REVEAL SYSTEM
    // IntersectionObserver adds .is-visible to
    // .fade-in-up elements and .phase-img-inner
    // ============================================
    const revealElements = document.querySelectorAll('.fade-in-up, .phase-img-inner');

    if (!prefersReducedMotion && revealElements.length > 0) {
        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    revealObserver.unobserve(entry.target);
                }
            });
        // rootMargin: positive bottom = detect 100px BEFORE element enters viewport
        // threshold: 0.01 = trigger as soon as even 1% is visible
        // This fixes mobile where elements are stacked deep inside tall sections
        }, { threshold: 0.01, rootMargin: '0px 0px 100px 0px' });

        revealElements.forEach(el => revealObserver.observe(el));

        // IMMEDIATE CHECK: reveal anything already in the viewport on load
        // This fixes mobile where the manifesto content is visible before any scroll happens
        function forceRevealVisible() {
            const vh = window.innerHeight;
            revealElements.forEach(el => {
                if (!el.classList.contains('is-visible')) {
                    const rect = el.getBoundingClientRect();
                    if (rect.top < vh + 50) {
                        el.classList.add('is-visible');
                        revealObserver.unobserve(el);
                    }
                }
            });
        }

        // Run immediately
        forceRevealVisible();
        // Run again after loader lifts (1.8s matches the preloader timing)
        setTimeout(forceRevealVisible, 2000);
        // Run on first scroll too
        let revealCheckPending = false;
        window.addEventListener('scroll', () => {
            if (revealCheckPending) return;
            revealCheckPending = true;
            requestAnimationFrame(() => {
                forceRevealVisible();
                revealCheckPending = false;
            });
        }, { passive: true });
    } else {
        // Reduced motion: show everything immediately
        revealElements.forEach(el => el.classList.add('is-visible'));
    }

    // --- 3.7 NAV SCROLL STATE (handled inside main scroll listener below) ---
    const nav = document.querySelector('.nav-overlay');

    // --- 3.8 NAV LIGHT/DARK THEME DETECTION ---
    // Switches nav to dark-on-cream when scrolled over light-background sections.
    const lightThemeSections = document.querySelectorAll('[data-nav-theme="light"]');

    function updateNavTheme() {
        if (!nav || !lightThemeSections.length) return;
        const navBottom = nav.offsetHeight || 72;
        let overLight = false;
        lightThemeSections.forEach(section => {
            const rect = section.getBoundingClientRect();
            if (rect.top < navBottom && rect.bottom > 0) overLight = true;
        });
        nav.classList.toggle('nav-on-light', overLight);
    }

    // Run on initial load (handles page-load scroll position)
    updateNavTheme();

    // --- 3.9 BADGE POSITIONING — attached to the right edge of the image column ---
    // Uses offsetLeft/offsetTop (layout-relative, not viewport-relative) so the
    // calculation is correct regardless of scroll position at time of call.
    // Desktop: badge center on right edge of image, 65% down.
    // Mobile:  badge center on bottom edge of image, horizontally centred.
    function positionStampOnImage() {
        const stamp   = document.querySelector('.visual-stamp');
        const visual  = document.querySelector('.manifesto-visual');
        const section = document.getElementById('philosophy');
        if (!stamp || !visual || !section) return;

        const stampW = stamp.offsetWidth  || (isMobile ? 100 : 140);
        const stampH = stamp.offsetHeight || (isMobile ? 100 : 140);

        const visL = visual.offsetLeft;
        const visT = visual.offsetTop;
        const visW = visual.offsetWidth;
        const visH = visual.offsetHeight;

        let left, top;
        if (isMobile) {
            left = visL + visW / 2 - stampW / 2;
            top  = visT + visH     - stampH / 2;
        } else {
            left = visL + visW     - stampW / 2;
            top  = visT + visH * 0.65 - stampH / 2;
        }

        stamp.style.left      = left + 'px';
        stamp.style.top       = top  + 'px';
        stamp.style.transform = 'none';
    }

    window.addEventListener('load',   positionStampOnImage);
    window.addEventListener('resize', positionStampOnImage);

    // --- 4. UNIFIED SCROLL HANDLER ---
    const parallaxText = document.querySelectorAll('.parallax-text');
    const parallaxImgs = document.querySelectorAll('.parallax-img');

    window.addEventListener('scroll', () => {
        let scrollY = window.scrollY;

        // Nav compact state (always runs)
        if (nav) {
            if (scrollY > 100) { nav.classList.add('scrolled'); }
            else { nav.classList.remove('scrolled'); }
        }

        // Nav theme (light/dark) — always runs
        updateNavTheme();

        // Everything below is motion-gated
        if (prefersReducedMotion) return;
            const mobileDampener = isMobile ? 0.3 : 1;

            if (parallaxText.length > 0) {
                parallaxText.forEach(text => {
                    let speed = text.getAttribute('data-speed') * mobileDampener;
                    text.style.transform = `translateX(-50%) translateY(${scrollY * speed}px)`;
                });
            }
            if (parallaxImgs.length > 0) {
                parallaxImgs.forEach(img => {
                    let speed = img.getAttribute('data-speed') * mobileDampener;
                    img.style.transform = `translate3d(0, ${scrollY * speed}px, 0)`;
                });
            }

            // Hero zoom-on-scroll effect
            const heroImg = document.querySelector('#intro .hero-img');
            if (heroImg && scrollY < window.innerHeight) {
                const scale = 1 + scrollY * 0.0003;
                heroImg.style.transform = `translate3d(0, ${scrollY * 0.4}px, 0) scale(${scale})`;
            }

            // Hero content fade-on-scroll
            const heroContent = document.querySelector('#intro .content-layer');
            if (heroContent && scrollY < window.innerHeight) {
                heroContent.style.opacity = Math.max(0, 1 - scrollY / 600);
                heroContent.style.transform = `translateY(${scrollY * -0.08}px)`;
            }

            // Phase image scroll parallax — subtle vertical shift within each phase
            document.querySelectorAll('.phase-image').forEach(phaseImg => {
                const rect = phaseImg.getBoundingClientRect();
                const vh = window.innerHeight;
                // Only process when phase is near viewport
                if (rect.top < vh * 1.2 && rect.bottom > -vh * 0.2) {
                    const progress = (vh - rect.top) / (vh + rect.height);
                    const yShift = (progress - 0.5) * 30; // ±15px shift
                    const inner = phaseImg.querySelector('.phase-img-inner');
                    if (inner && inner.classList.contains('is-visible')) {
                        // Preserve the Ken Burns animation, just add a subtle Y offset
                        inner.style.marginTop = `${yShift}px`;
                    }
                }
            });

        }, { passive: true });

    // --- 5. FORM HANDLING ---
    const form = document.getElementById('signup-form');
    const formContainer = document.getElementById('form-container');
    const successMsg = document.getElementById('success-message');
    const btnText = document.querySelector('.btn-text');
    const btn = document.getElementById('submit-btn');

    if(form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            if(btnText) btnText.textContent = "Verifying...";
            if(btn) {
                btn.style.opacity = "0.7";
                btn.disabled = true;
            }

            const data = new FormData(form);

            fetch(form.action, {
                method: form.method,
                body: data,
                headers: { 'Accept': 'application/json' }
            }).then(response => {
                if (response.ok) {
                    setTimeout(() => {
                        if(formContainer) {
                            formContainer.style.transform = "rotateX(90deg)";
                            formContainer.style.opacity = '0';
                        }
                        setTimeout(() => {
                            if(formContainer) formContainer.style.display = 'none';
                            if(successMsg) {
                                successMsg.classList.remove('hidden');
                                void successMsg.offsetWidth; 
                                successMsg.style.opacity = '1';
                            }
                        }, 500);
                    }, 1000);
                } else {
                    alert("System busy. Please try again.");
                    if(btnText) btnText.textContent = "Apply for Access";
                    if(btn) { btn.disabled = false; btn.style.opacity = "1"; }
                }
            }).catch(error => {
                alert("Connection error. Please check your network.");
                if(btnText) btnText.textContent = "Apply for Access";
                if(btn) { btn.disabled = false; btn.style.opacity = "1"; }
            });
        });
    }

    // --- 6. MID-PAGE CAPTURE FORM ---
    const midForm = document.getElementById('mid-capture-form');
    if (midForm) {
        midForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = midForm.querySelector('.mid-capture-btn');
            const successEl = document.querySelector('.mid-capture-success');
            if (btn) { btn.textContent = 'Joining...'; btn.disabled = true; }
            fetch(midForm.action, {
                method: 'POST',
                body: new FormData(midForm),
                headers: { 'Accept': 'application/json' }
            }).then(r => {
                if (r.ok) {
                    midForm.style.display = 'none';
                    if (successEl) successEl.classList.remove('hidden');
                    sessionStorage.setItem('odc_signed_up', '1');
                } else {
                    if (btn) { btn.textContent = 'Join the Collective'; btn.disabled = false; }
                    alert('System busy. Please try again.');
                }
            }).catch(() => {
                if (btn) { btn.textContent = 'Join the Collective'; btn.disabled = false; }
                alert('Connection error. Please check your network.');
            });
        });
    }

    // --- 6.5 EXIT-INTENT POPUP ---
    const exitPopup = document.getElementById('exit-popup');
    const exitPopupClose = document.getElementById('exit-popup-close');
    const exitForm = document.getElementById('exit-popup-form');

    function openExitPopup() {
        if (!exitPopup) return;
        exitPopup.classList.add('is-open');
        exitPopup.setAttribute('aria-hidden', 'false');
        const input = exitPopup.querySelector('.exit-popup-input');
        if (input) input.focus();
    }

    function closeExitPopup() {
        if (!exitPopup) return;
        exitPopup.classList.remove('is-open');
        exitPopup.setAttribute('aria-hidden', 'true');
        sessionStorage.setItem('odc_exit_dismissed', '1');
    }

    if (exitPopup) {
        // Trigger: mouse leaves viewport toward the top
        let exitTriggered = false;
        const readyDelay = 12000; // wait 12s before allowing trigger
        let pageReadyForExit = false;
        setTimeout(() => { pageReadyForExit = true; }, readyDelay);

        document.addEventListener('mouseleave', (e) => {
            if (e.clientY > 20) return; // only trigger if heading toward browser chrome
            if (exitTriggered) return;
            if (!pageReadyForExit) return;
            if (sessionStorage.getItem('odc_exit_dismissed')) return;
            if (sessionStorage.getItem('odc_signed_up')) return;
            exitTriggered = true;
            openExitPopup();
        });

        // Close on overlay click
        exitPopup.querySelector('.exit-popup-overlay').addEventListener('click', closeExitPopup);

        // Close on X button
        if (exitPopupClose) exitPopupClose.addEventListener('click', closeExitPopup);

        // Close on Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && exitPopup.classList.contains('is-open')) closeExitPopup();
        });

        // Handle form submission
        if (exitForm) {
            exitForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const btn = exitForm.querySelector('.exit-popup-btn');
                const successEl = exitPopup.querySelector('.exit-popup-success');
                if (btn) { btn.textContent = 'Joining...'; btn.disabled = true; }
                fetch(exitForm.action, {
                    method: 'POST',
                    body: new FormData(exitForm),
                    headers: { 'Accept': 'application/json' }
                }).then(r => {
                    if (r.ok) {
                        exitForm.style.display = 'none';
                        exitPopup.querySelector('.exit-popup-note').style.display = 'none';
                        if (successEl) successEl.classList.remove('hidden');
                        sessionStorage.setItem('odc_signed_up', '1');
                        setTimeout(closeExitPopup, 2500);
                    } else {
                        if (btn) { btn.textContent = 'Join the Collective'; btn.disabled = false; }
                        alert('System busy. Please try again.');
                    }
                }).catch(() => {
                    if (btn) { btn.textContent = 'Join the Collective'; btn.disabled = false; }
                    alert('Connection error. Please check your network.');
                });
            });
        }
    }

    // --- 7. THE LANTERN EFFECT ---
    const card = document.querySelector('.access-card');

    if(card) {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            card.style.setProperty('--x', `${x}px`);
            card.style.setProperty('--y', `${y}px`);
        });
    }

    // --- 8. HEADLINE REVEAL ---
    // CSS handles the cinematic blur-in via .headline-reveal transition on body.loaded.
    // No JS needed — reduced motion is also handled purely in CSS.

    // ============================================
    // NEW: PRODUCT TRACK DRAG-TO-SCROLL
    // ============================================
    const track = document.getElementById('products-track');
    if (track) {
        let isDown = false;
        let startX;
        let scrollLeft;

        track.addEventListener('mousedown', (e) => {
            isDown = true;
            track.style.cursor = 'grabbing';
            startX = e.pageX - track.offsetLeft;
            scrollLeft = track.scrollLeft;
        });

        track.addEventListener('mouseleave', () => {
            isDown = false;
            track.style.cursor = 'grab';
        });

        track.addEventListener('mouseup', () => {
            isDown = false;
            track.style.cursor = 'grab';
        });

        track.addEventListener('mousemove', (e) => {
            if (!isDown) return;
            e.preventDefault();
            const x = e.pageX - track.offsetLeft;
            const walk = (x - startX) * 1.5;
            track.scrollLeft = scrollLeft - walk;
        });
    }
    // --- MAGNETIC BUTTON EFFECT ---
    // Pulls the button toward the cursor on hover for a tactile, premium feel.
    const magneticBtns = document.querySelectorAll('.gold-btn, .access-cta');

    magneticBtns.forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            if (prefersReducedMotion) return;
            const rect = btn.getBoundingClientRect();
            const cx = rect.left + rect.width / 2;
            const cy = rect.top + rect.height / 2;
            const dx = (e.clientX - cx) * 0.32;
            const dy = (e.clientY - cy) * 0.32;
            btn.style.transform = `translate(${dx}px, ${dy}px)`;
            btn.style.transition = 'transform 0.12s ease';
        });

        btn.addEventListener('mouseleave', () => {
            btn.style.transform = 'translate(0, 0)';
            btn.style.transition = 'transform 0.65s cubic-bezier(0.16, 1, 0.3, 1)';
        });
    });

    // --- PHASE IMAGE 3D TILT ON HOVER ---
    // Gives each phase image a parallax-tilt depth response on mouse movement.
    document.querySelectorAll('.phase-image').forEach(container => {
        container.addEventListener('mousemove', (e) => {
            if (prefersReducedMotion) return;
            const rect = container.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width  - 0.5;
            const y = (e.clientY - rect.top)  / rect.height - 0.5;
            const tiltX =  y * -7;
            const tiltY =  x *  7;
            container.style.transform = `perspective(1200px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale(1.015)`;
            container.style.transition = 'transform 0.08s ease';
        });

        container.addEventListener('mouseleave', () => {
            container.style.transform = 'perspective(1200px) rotateX(0) rotateY(0) scale(1)';
            container.style.transition = 'transform 0.85s cubic-bezier(0.16, 1, 0.3, 1)';
        });
    });

});  // end product track

// ============================================
// EVERYTHING BELOW RUNS AFTER DOMContentLoaded
// (moved inside scope for clean variable access)
// ============================================

document.addEventListener('DOMContentLoaded', () => {

// --- 9. SENSORY LAYER (AUDIO/VISUAL SYNTHESIS) ---
    const atmosphereBtn = document.getElementById('atmosphere-toggle');
    const ambientAudio = document.getElementById('ambient-audio');
    let isPlaying = false;
    
    let audioCtx, analyser, source, dataArray;
    let animationId;
    let visualizerActive = false;

    if (atmosphereBtn && ambientAudio) {
        ambientAudio.volume = 0;

        atmosphereBtn.addEventListener('click', () => {
            if (!isPlaying) {
                try {
                    if (!audioCtx) {
                        const AudioContext = window.AudioContext || window.webkitAudioContext;
                        audioCtx = new AudioContext();
                        analyser = audioCtx.createAnalyser();
                        
                        source = audioCtx.createMediaElementSource(ambientAudio);
                        source.connect(analyser);
                        analyser.connect(audioCtx.destination);
                        
                        analyser.fftSize = 256; // Higher resolution for multi-band cerebral analysis
                        dataArray = new Uint8Array(analyser.frequencyBinCount);
                        visualizerActive = true;
                    }

                    if (audioCtx.state === 'suspended') {
                        audioCtx.resume();
                    }
                } catch (error) {
                    console.warn("Visualizer blocked by browser security. Audio will still play.");
                    visualizerActive = false;
                }

                document.body.classList.add('atmosphere-on');
                
                let playPromise = ambientAudio.play();
                if (playPromise !== undefined) {
                    playPromise.then(() => {
                        fadeAudio(ambientAudio, 0.8, 2000);
                        isPlaying = true;
                        if (visualizerActive) renderVisuals();
                    }).catch(error => {
                        console.error("Audio play failed:", error);
                    });
                }
                
            } else {
                document.body.classList.remove('atmosphere-on');
                fadeAudio(ambientAudio, 0, 1500, () => {
                    ambientAudio.pause();
                    if (visualizerActive) cancelAnimationFrame(animationId);
                });
                isPlaying = false;
            }
        });

        // Floating off-switch: shows when atmosphere is on and user has scrolled past the nav
        const atmosphereFloat = document.getElementById('atmosphere-float');
        if (atmosphereFloat) {
            // Show/hide based on scroll position + atmosphere state
            window.addEventListener('scroll', () => {
                if (document.body.classList.contains('atmosphere-on') && window.scrollY > 200) {
                    atmosphereFloat.classList.add('visible');
                } else {
                    atmosphereFloat.classList.remove('visible');
                }
            }, { passive: true });

            // Clicking floating toggle turns atmosphere off
            atmosphereFloat.addEventListener('click', () => {
                // Simulate clicking the main toggle
                atmosphereBtn.click();
                atmosphereFloat.classList.remove('visible');
            });
        }

        function renderVisuals() {
            if (!isPlaying || !visualizerActive) return;
            animationId = requestAnimationFrame(renderVisuals);
            
            analyser.getByteFrequencyData(dataArray);
            
            // Multi-band analysis for cerebral effects
            let lowSum = 0, midSum = 0, highSum = 0;
            const lowEnd = 10, midEnd = 30, highEnd = 55;
            
            for (let i = 0; i < highEnd; i++) {
                if (i < lowEnd) lowSum += dataArray[i];
                else if (i < midEnd) midSum += dataArray[i];
                else highSum += dataArray[i];
            }
            
            const lowAvg = lowSum / (lowEnd * 255);      // 0-1: sub-bass, breathing
            const midAvg = midSum / ((midEnd - lowEnd) * 255); // 0-1: bowls, tones
            const highAvg = highSum / ((highEnd - midEnd) * 255); // 0-1: shimmer, air
            
            // Combined energy for backward compat
            let sum = 0;
            for (let i = 0; i < 30; i++) sum += dataArray[i];
            let average = sum / 30;
            
            const visualScale = 1 + (average / 255) * 0.15; 
            const visualGlow = (average / 255) * 1.2;

            document.body.style.setProperty('--audio-scale', visualScale);
            document.body.style.setProperty('--audio-glow', visualGlow);
            // New cerebral bands
            document.body.style.setProperty('--audio-low', lowAvg);
            document.body.style.setProperty('--audio-mid', midAvg);
            document.body.style.setProperty('--audio-high', highAvg);
        }
    }

    function fadeAudio(audio, targetVolume, duration, callback) {
        const startVolume = audio.volume;
        const change = targetVolume - startVolume;
        const increment = 20; 
        const steps = duration / increment;
        let currentStep = 0;

        const fadeInterval = setInterval(() => {
            currentStep++;
            let newVolume = startVolume + (change * (currentStep / steps));
            
            if (newVolume > 1) newVolume = 1;
            if (newVolume < 0) newVolume = 0;
            
            audio.volume = newVolume;

            if (currentStep >= steps) {
                clearInterval(fadeInterval);
                audio.volume = targetVolume;
                if (callback) callback();
            }
        }, increment);
    }

// --- 9.5 NAV TOGGLE SETUP ---
// Handles pages that don't define closeNav/openNav in their inline scripts
// (e.g. accessibility, philosophy, privacy, terms, 404).
// Guard prevents duplicate listeners on pages that already wire up the nav inline.
    (function setupNav() {
        // Skip pages that already wire up the nav via their own inline script
        // (those scripts define closeNav as a global function on window).
        if (typeof window.closeNav === 'function') return;
        var navToggle = document.getElementById('nav-toggle');
        var navMenu   = document.getElementById('nav-menu');
        if (!navToggle || !navMenu) return;

        function openNav() {
            navMenu.classList.add('is-open');
            navToggle.setAttribute('aria-expanded', 'true');
            navToggle.setAttribute('aria-label', 'Close menu');
        }
        function closeNavLocal() {
            navMenu.classList.remove('is-open');
            navToggle.setAttribute('aria-expanded', 'false');
            navToggle.setAttribute('aria-label', 'Open menu');
        }

        navToggle.addEventListener('click', function () {
            navMenu.classList.contains('is-open') ? closeNavLocal() : openNav();
        });
        navMenu.addEventListener('click', function (e) {
            if (e.target === navMenu) closeNavLocal();
        });
        var navMenuClose = document.getElementById('nav-menu-close');
        if (navMenuClose) navMenuClose.addEventListener('click', closeNavLocal);
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape') closeNavLocal();
        });
    }());

// --- 10. PAGE TRANSITION ROUTER ---
// Closes the nav menu, fades to black, then navigates normally.
// Full page loads ensure page-specific styles and scripts always run correctly.

    // closeNav: safe fallback for pages without inline nav script.
    // If a page's inline script already defined closeNav globally, this
    // local definition shadows it within this DOMContentLoaded scope —
    // both implementations are identical in behaviour.
    function closeNav() {
        var navMenu   = document.getElementById('nav-menu');
        var navToggle = document.getElementById('nav-toggle');
        if (!navMenu || !navToggle) return;
        navMenu.classList.remove('is-open');
        navToggle.setAttribute('aria-expanded', 'false');
        navToggle.setAttribute('aria-label', 'Open menu');
    }

    document.addEventListener('click', (e) => {
        const link = e.target.closest('a');
        if (!link || !link.href) return;
        if (!link.href.startsWith(window.location.origin)) return;
        if (link.target === '_blank' || link.hasAttribute('download')) return;
        // Same-page anchor links — close menu but don't intercept navigation
        if (link.href.split('#')[0] === window.location.href.split('#')[0]) {
            closeNav();
            return;
        }
        e.preventDefault();
        closeNav();
        const url = link.href;
        document.body.classList.add('is-transitioning');
        setTimeout(() => { window.location.href = url; }, 500);
    });

// --- 11. CEREBRAL PARTICLE FIELD ---
// Floating golden motes that respond to audio
// frequency data. Drift slowly when atmosphere
// is ambient, pulse outward on frequency peaks.
// Uses raw Canvas2D for zero-dependency perf.

    const particleCanvas = document.getElementById('atmosphere-particles');
    
    if (particleCanvas) {
        const ctx = particleCanvas.getContext('2d');
        let particles = [];
        let particleAnimId;
        let particlesActive = false;
        const PARTICLE_COUNT = 60;

        function resizeCanvas() {
            particleCanvas.width = window.innerWidth;
            particleCanvas.height = window.innerHeight;
        }
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        function createParticles() {
            particles = [];
            for (let i = 0; i < PARTICLE_COUNT; i++) {
                particles.push({
                    x: Math.random() * particleCanvas.width,
                    y: Math.random() * particleCanvas.height,
                    radius: Math.random() * 2 + 0.5,
                    baseRadius: Math.random() * 2 + 0.5,
                    vx: (Math.random() - 0.5) * 0.15,
                    vy: (Math.random() - 0.5) * 0.1 - 0.05, // gentle upward drift
                    alpha: Math.random() * 0.5 + 0.15,
                    baseAlpha: Math.random() * 0.5 + 0.15,
                    // Each particle responds to a different frequency band
                    freqBand: Math.floor(Math.random() * 40),
                    phase: Math.random() * Math.PI * 2, // breathing offset
                });
            }
        }

        function renderParticles() {
            if (!particlesActive) return;
            particleAnimId = requestAnimationFrame(renderParticles);

            ctx.clearRect(0, 0, particleCanvas.width, particleCanvas.height);

            // Get current audio data if available
            let freqData = null;
            let audioEnergy = 0;
            if (analyser && dataArray && isPlaying) {
                analyser.getByteFrequencyData(dataArray);
                freqData = dataArray;
                // Overall energy for global effects
                let sum = 0;
                for (let i = 0; i < 50; i++) sum += dataArray[i];
                audioEnergy = sum / (50 * 255); // 0 to 1
            }

            const time = Date.now() * 0.001;

            particles.forEach(p => {
                // Audio reactivity per-particle
                let freqInfluence = 0;
                if (freqData && freqData[p.freqBand] !== undefined) {
                    freqInfluence = freqData[p.freqBand] / 255;
                }

                // Breathing: slow sine oscillation + audio pulse
                const breathe = Math.sin(time * 0.5 + p.phase) * 0.3;
                p.radius = p.baseRadius + breathe + freqInfluence * 2.5;
                p.alpha = p.baseAlpha + breathe * 0.15 + freqInfluence * 0.4;
                p.alpha = Math.max(0, Math.min(1, p.alpha));

                // Movement: drift + audio-driven expansion
                const audioVx = (p.x - particleCanvas.width / 2) * audioEnergy * 0.002;
                const audioVy = (p.y - particleCanvas.height / 2) * audioEnergy * 0.002;
                
                p.x += p.vx + audioVx;
                p.y += p.vy + audioVy;

                // Wrap around edges
                if (p.x < -10) p.x = particleCanvas.width + 10;
                if (p.x > particleCanvas.width + 10) p.x = -10;
                if (p.y < -10) p.y = particleCanvas.height + 10;
                if (p.y > particleCanvas.height + 10) p.y = -10;

                // Draw with golden glow — BRIGHT
                const glowSize = p.radius * (4 + freqInfluence * 5);
                
                // Outer glow
                const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, glowSize);
                gradient.addColorStop(0, `rgba(245, 215, 100, ${p.alpha * 0.8})`);
                gradient.addColorStop(0.3, `rgba(229, 193, 85, ${p.alpha * 0.3})`);
                gradient.addColorStop(1, 'rgba(229, 193, 85, 0)');
                
                ctx.beginPath();
                ctx.arc(p.x, p.y, glowSize, 0, Math.PI * 2);
                ctx.fillStyle = gradient;
                ctx.fill();

                // Core point — bright white-gold
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(255, 240, 180, ${p.alpha * 1.2})`;
                ctx.fill();
            });

            // Occasional connection lines between close particles (neural network feel)
            if (audioEnergy > 0.12) {
                ctx.strokeStyle = `rgba(229, 193, 85, ${audioEnergy * 0.15})`;
                ctx.lineWidth = 0.6;
                for (let i = 0; i < particles.length; i++) {
                    for (let j = i + 1; j < particles.length; j++) {
                        const dx = particles[i].x - particles[j].x;
                        const dy = particles[i].y - particles[j].y;
                        const dist = Math.sqrt(dx * dx + dy * dy);
                        if (dist < 120) {
                            ctx.beginPath();
                            ctx.moveTo(particles[i].x, particles[i].y);
                            ctx.lineTo(particles[j].x, particles[j].y);
                            ctx.stroke();
                        }
                    }
                }
            }
        }

        // Hook into atmosphere toggle
        const origToggle = atmosphereBtn;
        if (origToggle) {
            origToggle.addEventListener('click', () => {
                // Small delay to let audio start
                setTimeout(() => {
                    if (document.body.classList.contains('atmosphere-on')) {
                        if (!particlesActive) {
                            createParticles();
                            particlesActive = true;
                            renderParticles();
                        }
                    } else {
                        particlesActive = false;
                        if (particleAnimId) cancelAnimationFrame(particleAnimId);
                        ctx.clearRect(0, 0, particleCanvas.width, particleCanvas.height);
                    }
                }, 200);
            });
        }
    }

}); // end second DOMContentLoaded
