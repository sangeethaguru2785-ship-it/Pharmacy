/* ========================================
   Stackly Pharmacy - JavaScript & GSAP
   Failsafe: content is ALWAYS visible by default.
   Animations only enhance, never hide.
   ======================================== */

(function () {
    'use strict';

    // ========================================
    // Shared cart (window.name + localStorage) API
    // Used by every page + the cart page.
    // Durable across pages AND reliable when pages
    // are opened directly from file:// (where some
    // browsers isolate localStorage per file).
    // ========================================
    var CartStore = {
        DEFAULTS: [],
        get: function () {
            var cart;
            var raw = this.rawGet();
            if (raw === null) {
                this.save([]);
                return [];
            }
            try { cart = JSON.parse(raw); } catch (e) { cart = []; }
            return Array.isArray(cart) ? cart : [];
        },
        save: function (cart) {
            this.rawSet(JSON.stringify(cart));
        },
        rawGet: function () {
            // Most recent in-tab value wins (window.name), then persistent storage.
            try {
                var n = window.name;
                if (n.indexOf(this.KEY + '=') === 0) {
                    return n.slice(this.KEY.length + 1).replace(/\|$/, '');
                }
            } catch (e) { /* ignore */ }
            try { return localStorage.getItem(this.KEY); } catch (e) { return null; }
        },
        rawSet: function (value) {
            try { window.name = this.KEY + '=' + value + '|'; } catch (e) { /* ignore */ }
            try { localStorage.setItem(this.KEY, value); } catch (e) { /* ignore */ }
        },
        KEY: 'hp_cart',
        count: function (cart) {
            var list = cart || this.get();
            var n = 0;
            list.forEach(function (i) { n += (i.qty || 0); });
            return n;
        },
        updateBadge: function () {
            var count = this.count();
            document.querySelectorAll('.badge-count').forEach(function (badge) {
                badge.textContent = String(count);
                badge.classList.toggle('is-empty', count < 1);
            });
        },
        productFromCard: function (card) {
            var img = card.querySelector('.product-media img');
            var nameEl = card.querySelector('.product-name');
            var priceEl = card.querySelector('.price-current');
            var name = nameEl ? nameEl.textContent.trim() : 'Product';
            var price = 0;
            if (priceEl) {
                price = parseFloat(priceEl.textContent.replace(/[^0-9.]/g, '')) || 0;
            }
            return {
                id: name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''),
                name: name,
                price: price,
                image: img ? img.getAttribute('src') : 'images/cat-medicines.webp',
                qty: 1
            };
        },
        add: function (item) {
            var cart = this.get();
            var found = false;
            cart.forEach(function (ci) {
                if (ci.id === item.id) { ci.qty += 1; found = true; }
            });
            if (!found) { cart.push(item); }
            this.save(cart);
            this.updateBadge();
            return cart;
        }
    };
    window.StacklyCart = CartStore;
    // Keep badges in sync between open tabs.
    if (window.addEventListener) {
        window.addEventListener('storage', function (e) {
            if (e.key === CartStore.KEY) { CartStore.updateBadge(); }
        });
    }

    // Guard flag. Declared (and initialized) BEFORE any early call path
    // so initBasicUI() can safely run even when GSAP is unavailable.
    var basicUIRan = false;

    // ========================================
    // GSAP availability
    // ========================================
    if (typeof gsap === 'undefined') {
        // No GSAP => everything stays visible naturally; only run basic UI JS.
        initBasicUI();
        return;
    }

    // Ensure ScrollTrigger plugin is loaded (some CDNs split it).
    let ScrollTriggerOK = true;
    try {
        gsap.registerPlugin(ScrollTrigger);
    } catch (e) {
        ScrollTriggerOK = false;
    }

    // ========================================
    // Basic UI (runs regardless of GSAP)
    // ========================================
    function initBasicUI() {
        if (basicUIRan) return;
        basicUIRan = true;

        // Cart badge reflects shared cart state
        if (window.StacklyCart) {
            window.StacklyCart.updateBadge();
        }

        // Rotating hero headlines
        initHeroRotator();

        // Scroll progress bar
        const progressBar = document.getElementById('scrollProgress');
        if (progressBar) {
            window.addEventListener('scroll', function () {
                const scrolled = window.scrollY;
                const total = document.documentElement.scrollHeight - window.innerHeight;
                progressBar.style.width = (total > 0 ? (scrolled / total) * 100 : 0) + '%';
            }, { passive: true });
        }

        // Navbar scrolled state + active link
        const navbar = document.getElementById('mainNav');
        const navLinks = document.querySelectorAll('.nav-link');
        const sections = document.querySelectorAll('section[id]');

        // Keep the header solid whenever the mobile menu is open
        const navbarCollapse = navbar ? navbar.querySelector('.navbar-collapse') : null;
        if (navbarCollapse) {
            navbarCollapse.addEventListener('show.bs.collapse', function () {
                navbar.classList.add('nav-expanded');
            });
            navbarCollapse.addEventListener('hide.bs.collapse', function () {
                navbar.classList.remove('nav-expanded');
            });
        }

        function syncNavState() {
            if (!navbar) return;
            // Solid black header with a subtle shadow once the user scrolls.
            navbar.classList.toggle('scrolled', window.scrollY > 60);
            // No body padding: heroes extend up beneath the fixed header.
        }

        window.addEventListener('scroll', function () {
            syncNavState();

            let current = '';
            sections.forEach(function (sec) {
                if (window.scrollY >= sec.offsetTop - 180) current = sec.id;
            });
            navLinks.forEach(function (link) {
                const href = link.getAttribute('href') || '';
                if (href.charAt(0) !== '#') return; // page links keep their HTML active state
                link.classList.toggle('active', href === '#' + current);
            });
        }, { passive: true });

        // Set the initial header state and re-check once images/layout settle.
        syncNavState();
        window.addEventListener('load', syncNavState);
        window.addEventListener('resize', syncNavState);

        // Back to top
        const backToTop = document.getElementById('backToTop');
        if (backToTop) {
            window.addEventListener('scroll', function () {
                backToTop.classList.toggle('visible', window.scrollY > 500);
            }, { passive: true });
            backToTop.addEventListener('click', function () {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            });
        }

        // Smooth scroll for in-page anchors
        document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
            anchor.addEventListener('click', function (e) {
                const id = this.getAttribute('href');
                if (id.length < 2) return;
                const target = document.querySelector(id);
                if (!target) return;
                e.preventDefault();
                window.scrollTo({ top: target.offsetTop - 85, behavior: 'smooth' });
                const collapse = document.querySelector('.navbar-collapse.show');
                if (collapse) {
                    const inst = bootstrap && bootstrap.Collapse && bootstrap.Collapse.getInstance(collapse);
                    if (inst) inst.hide();
                }
            });
        });

        // Product filter
        const filterBtns = document.querySelectorAll('.filter-btn');
        const productItems = document.querySelectorAll('.product-item');
        filterBtns.forEach(function (btn) {
            btn.addEventListener('click', function () {
                filterBtns.forEach(function (b) { b.classList.remove('active'); });
                btn.classList.add('active');
                const filter = btn.getAttribute('data-filter');
                productItems.forEach(function (item) {
                    const match = filter === 'all' || item.getAttribute('data-category') === filter;
                    item.style.display = match ? '' : 'none';
                });
            });
        });

        // Add to cart (stores into shared cart + updates header badge)
        document.querySelectorAll('.btn-add-cart').forEach(function (btn) {
            btn.addEventListener('click', function (e) {
                e.preventDefault();
                var card = btn.closest('.product-card');
                if (!card || !window.StacklyCart) return;
                var item = window.StacklyCart.productFromCard(card);
                window.StacklyCart.add(item);
                window.StacklyCart.updateBadge();
                const original = btn.innerHTML;
                btn.classList.add('added');
                btn.innerHTML = '<i class="bi bi-check-circle"></i> Added to Cart';
                setTimeout(function () {
                    btn.classList.remove('added');
                    btn.innerHTML = original;
                }, 2000);
            });
        });

        // Wishlist toggle
        document.querySelectorAll('.wishlist-btn').forEach(function (btn) {
            btn.addEventListener('click', function (e) {
                e.preventDefault();
                btn.classList.toggle('liked');
                const icon = btn.querySelector('i');
                icon.classList.toggle('bi-heart');
                icon.classList.toggle('bi-heart-fill');
            });
        });

        // Newsletter submit
        document.querySelectorAll('.newsletter-form').forEach(function (form) {
            // Success message shown directly below the form.
            const successMsg = document.createElement('div');
            successMsg.className = 'newsletter-success';
            successMsg.setAttribute('role', 'status');
            successMsg.setAttribute('aria-live', 'polite');
            successMsg.style.display = 'none';
            form.insertAdjacentElement('afterend', successMsg);

            let successTimer = null;
            function showSuccess() {
                if (successTimer) window.clearTimeout(successTimer);
                successMsg.textContent = 'Subscribed Successfully!';
                successMsg.style.display = 'flex';
                successMsg.style.opacity = '0';
                successMsg.style.transform = 'translateY(-6px)';
                requestAnimationFrame(function () {
                    successMsg.style.opacity = '1';
                    successMsg.style.transform = 'translateY(0)';
                });
                successTimer = window.setTimeout(function () {
                    successMsg.style.opacity = '0';
                    successMsg.style.transform = 'translateY(-6px)';
                    window.setTimeout(function () { successMsg.style.display = 'none'; }, 450);
                }, 3500);
            }
            function hideSuccess() {
                if (successTimer) window.clearTimeout(successTimer);
                successMsg.style.opacity = '0';
                successMsg.style.transform = 'translateY(-6px)';
                window.setTimeout(function () { successMsg.style.display = 'none'; }, 450);
            }

            const input = form.querySelector('input[type="email"]');
            if (input) input.addEventListener('input', hideSuccess);

            form.addEventListener('submit', function (e) {
                e.preventDefault();
                if (input) {
                    const err = emailErrorFor(input.value.trim());
                    if (err) { setEmailError(input, err); hideSuccess(); return; }
                    setEmailError(input, '');
                }
                const btn = form.querySelector('.btn-newsletter');
                const original = btn.innerHTML;
                btn.innerHTML = '<i class="bi bi-check-circle"></i> Subscribed!';
                btn.style.background = 'var(--success)';
                if (input) input.value = '';
                showSuccess();
                setTimeout(function () {
                    btn.innerHTML = original;
                    btn.style.background = '';
                }, 3000);
            });
        });

        // ========================================
        // Strict email validation (shared rule)
        // ========================================
        function isValidEmail(value) {
            return emailErrorFor(value) === '';
        }

        function emailErrorFor(value) {
            if (!value) return 'Please enter your email address.';
            if (/\s/.test(value)) return 'Email address cannot contain spaces.';
            if (!/^[A-Za-z0-9.@]+$/.test(value)) return 'Only letters, numbers, dots (.) and @ are allowed in an email address.';
            if (!/^[A-Za-z0-9]+(?:\.[A-Za-z0-9]+)*@[A-Za-z0-9]+(?:\.[A-Za-z0-9]+)+$/.test(value)) return 'Please enter a valid email address, like user123@gmail.com.';
            return '';
        }

        function setEmailError(input, msg) {
            input.classList.toggle('field-invalid', !!msg);
            const el = input._emailMsg;
            if (!el) return;
            el.textContent = msg || '';
            el.classList.toggle('show', !!msg);
        }

        window.StacklyEmail = {
            isValid: isValidEmail,
            errorFor: emailErrorFor,
            showError: setEmailError
        };

        document.querySelectorAll('input[type="email"]').forEach(function (input) {
            var host = input.closest('.input-group');
            if (!host && input.parentElement && /hw-newsletter-form/.test(input.parentElement.className)) {
                host = input.parentElement;
            }
            var msg = document.createElement('small');
            msg.className = 'field-error-msg';
            msg.setAttribute('aria-live', 'polite');
            if (host) { host.insertAdjacentElement('afterend', msg); }
            else { input.insertAdjacentElement('afterend', msg); }
            input._emailMsg = msg;

            input.addEventListener('input', function () {
                var clean = input.value.replace(/[^A-Za-z0-9.@]/g, '');
                if (clean !== input.value) {
                    input.value = clean;
                    setEmailError(input, 'Only letters, numbers, dots (.) and @ are allowed in an email address.');
                } else {
                    setEmailError(input, '');
                }
            });

            input.addEventListener('blur', function () {
                var v = input.value.trim();
                if (!v) { setEmailError(input, input.required ? 'Please enter your email address.' : ''); return; }
                setEmailError(input, emailErrorFor(v));
            });
        });

        // ========================================
        // Name & phone field validation (site-wide)
        // Name  : letters (A-Z, a-z) + single spaces between words
        // Phone : digits (0-9) only
        // Invalid characters are stripped on entry and blocked on submit.
        // ========================================
        var NAME_ONLY_RE = /^[A-Za-z]+(?:\s[A-Za-z]+)*$/;
        var PHONE_ONLY_RE = /^[0-9]+$/;

        function cleanNameField(value) {
            return String(value).replace(/[^A-Za-z\s]/g, '').replace(/\s{2,}/g, ' ').replace(/^\s+|\s+$/g, '');
        }
        function cleanPhoneField(value) {
            return String(value).replace(/[^0-9]/g, '');
        }
        function nameFieldError(value) {
            var v = String(value || '').trim();
            if (!v) { return ''; }
            return NAME_ONLY_RE.test(v) ? '' : 'Name must contain letters only.';
        }
        function phoneFieldError(value) {
            var v = String(value || '').replace(/\s+/g, '');
            if (!v) { return ''; }
            return PHONE_ONLY_RE.test(v) ? '' : 'Phone number must contain numbers only.';
        }
        function setFieldFilterError(input, msg) {
            var el = input._namePhoneMsg;
            if (!el) { return; }
            input.classList.toggle('field-invalid', !!msg);
            el.textContent = msg || '';
            el.classList.toggle('show', !!msg);
        }
        function attachNamePhoneFilter(input, isName) {
            var msg = document.createElement('small');
            msg.className = 'field-error-msg';
            msg.setAttribute('aria-live', 'polite');
            input.insertAdjacentElement('afterend', msg);
            input._namePhoneMsg = msg;

            var clean = isName ? cleanNameField : cleanPhoneField;
            var getError = isName ? nameFieldError : phoneFieldError;

            input.addEventListener('input', function () {
                var cleaned = clean(input.value);
                if (cleaned !== input.value) {
                    input.value = cleaned;
                    setFieldFilterError(input, getError(input.value));
                } else {
                    setFieldFilterError(input, '');
                }
            });
            input.addEventListener('blur', function () {
                setFieldFilterError(input, getError(input.value));
            });

            var cleaned = clean(input.value);
            if (cleaned !== input.value) { input.value = cleaned; }
        }

        document.querySelectorAll('input[id$="Name"]').forEach(function (input) { attachNamePhoneFilter(input, true); });
        document.querySelectorAll('input[id$="Phone"]').forEach(function (input) { attachNamePhoneFilter(input, false); });

        document.addEventListener('submit', function (e) {
            var form = e.target;
            if (!form || typeof form.querySelectorAll !== 'function') { return; }
            var invalid = null;
            form.querySelectorAll('input[id$="Name"], input[id$="Phone"]').forEach(function (input) {
                var isName = /Name$/.test(input.id);
                var err = (isName ? nameFieldError : phoneFieldError)(input.value.trim());
                setFieldFilterError(input, err);
                if (err && !invalid) { invalid = input; }
            });
            if (invalid) {
                e.preventDefault();
                e.stopPropagation();
                invalid.focus();
            }
        }, true);

        // Contact form: guard, then forward valid submissions to the 404 page
        document.querySelectorAll('.contact-form').forEach(function (form) {
            form.addEventListener('submit', function (e) {
                e.preventDefault();
                var input = form.querySelector('input[type="email"]');
                if (input) {
                    var err = emailErrorFor(input.value.trim());
                    if (err) { setEmailError(input, err); return; }
                }
                window.location.href = '404.html';
            });
        });

        // Health & wellness newsletter form
        document.querySelectorAll('.hw-newsletter-form').forEach(function (form) {
            form.addEventListener('submit', function (e) {
                e.preventDefault();
                var input = form.querySelector('input[type="email"]');
                if (!input) return;
                var err = emailErrorFor(input.value.trim());
                if (err) { setEmailError(input, err); return; }
                input.value = '';
                alert('Thank you for subscribing!');
            });
        });

        initTilt();
        initMagnetic();
        // initTestimonials(); // Disabled – all 3 cards shown statically
        initObserverAnimations();
        initPrescriptionUpload();
        initFlashCountdown();
        initPromoCodes();
    }

    // ========================================
    // Flash sale countdown (rolling 24h deadline)
    // ========================================
    function initFlashCountdown() {
        const cd = document.getElementById('flashCountdown');
        if (!cd) return;

        let target = Date.now() + 24 * 60 * 60 * 1000;
        try {
            const stored = sessionStorage.getItem('flashSaleEnd');
            if (stored && parseInt(stored, 10) > Date.now()) {
                target = parseInt(stored, 10);
            } else {
                sessionStorage.setItem('flashSaleEnd', String(target));
            }
        } catch (err) { /* storage unavailable - rolling 24h still works */ }

        const els = {};
        cd.querySelectorAll('[data-unit]').forEach(function (el) {
            els[el.getAttribute('data-unit')] = el;
        });

        function pad(n) { return (n < 10 ? '0' : '') + n; }

        function tick() {
            let diff = target - Date.now();
            if (diff < 0) diff = 0;
            const days = Math.floor(diff / 86400000);
            const hours = Math.floor(diff / 3600000) % 24;
            const minutes = Math.floor(diff / 60000) % 60;
            const seconds = Math.floor(diff / 1000) % 60;
            if (els.days) els.days.textContent = pad(days);
            if (els.hours) els.hours.textContent = pad(hours);
            if (els.minutes) els.minutes.textContent = pad(minutes);
            if (els.seconds) els.seconds.textContent = pad(seconds);
        }

        tick();
        setInterval(tick, 1000);
    }

    // ========================================
    // Promo code copy buttons
    // ========================================
    function initPromoCodes() {
        document.querySelectorAll('.btn-copy').forEach(function (btn) {
            btn.addEventListener('click', function () {
                const code = btn.getAttribute('data-code') || '';
                if (code && navigator.clipboard && navigator.clipboard.writeText) {
                    navigator.clipboard.writeText(code);
                }
                btn.classList.add('copied');
                btn.innerHTML = '<i class="bi bi-check-circle"></i>Copied!';
                setTimeout(function () {
                    btn.classList.remove('copied');
                    btn.innerHTML = '<i class="bi bi-clipboard-check"></i>Copy Code';
                }, 2000);
            });
        });
    }

    // ========================================
    // IntersectionObserver scroll reveal fallback
    // ========================================
    function initObserverAnimations() {
        if (!('IntersectionObserver' in window)) {
            document.querySelectorAll('[data-animate]').forEach(function(el) {
                el.classList.add('in-view');
            });
            return;
        }

        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    const delay = parseFloat(entry.target.getAttribute('data-delay')) || 0;
                    setTimeout(function() {
                        entry.target.classList.add('in-view');
                    }, delay * 1000);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.12, rootMargin: '0px 0px -30px 0px' });

        document.querySelectorAll('[data-animate]').forEach(function(el) {
            observer.observe(el);
        });
    }

    // ========================================
    // Interactive Prescription Dropzone UI
    // ========================================
    function initPrescriptionUpload() {
        const dropzones = document.querySelectorAll('.rx-dropzone, .upload-box');
        dropzones.forEach(function(zone) {
            const input = zone.querySelector('input[type="file"]');
            if (!input) return;

            ['dragenter', 'dragover'].forEach(function(eventName) {
                zone.addEventListener(eventName, function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    zone.classList.add('drag-active');
                }, false);
            });

            ['dragleave', 'drop'].forEach(function(eventName) {
                zone.addEventListener(eventName, function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    zone.classList.remove('drag-active');
                }, false);
            });

            zone.addEventListener('drop', function(e) {
                const dt = e.dataTransfer;
                const files = dt.files;
                if (files.length) {
                    input.files = files;
                    updateFileLabel(zone, files[0].name);
                }
            });

            input.addEventListener('change', function() {
                if (input.files.length) {
                    updateFileLabel(zone, input.files[0].name);
                }
            });
        });

        function updateFileLabel(zone, filename) {
            const textEl = zone.querySelector('.rx-file-name, p, small');
            if (textEl) {
                textEl.innerHTML = '<i class="bi bi-file-earmark-check-fill text-success me-1"></i> Selected: <strong>' + filename + '</strong>';
            }
        }
    }

    // ========================================
    // Interactive card tilt (desktop, motion-safe)
    // ========================================
    function initTilt() {
        const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
        if (!finePointer.matches) return;
        const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        document.querySelectorAll('.product-card, .category-card, .why-card, .offer-card, .mv-card, .cat-card, .service-card').forEach(function (card) {
            card.addEventListener('mousemove', function (e) {
                if (reduced) return;
                const r = card.getBoundingClientRect();
                const px = (e.clientX - r.left) / r.width - 0.5;
                const py = (e.clientY - r.top) / r.height - 0.5;
                card.style.setProperty('--tilt-x', (px * 9).toFixed(2) + 'deg');
                card.style.setProperty('--tilt-y', (-py * 9).toFixed(2) + 'deg');
            });
            card.addEventListener('mouseleave', function () {
                card.style.setProperty('--tilt-x', '0deg');
                card.style.setProperty('--tilt-y', '0deg');
            });
        });
    }

    // ========================================
    // Magnetic buttons
    // ========================================
    function initMagnetic() {
        const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
        if (!finePointer.matches) return;
        const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        document.querySelectorAll('.btn-magnetic').forEach(function (btn) {
            btn.addEventListener('mousemove', function (e) {
                if (reduced) return;
                const r = btn.getBoundingClientRect();
                btn.style.setProperty('--mx', ((e.clientX - r.left - r.width / 2) * 0.28).toFixed(1) + 'px');
                btn.style.setProperty('--my', ((e.clientY - r.top - r.height / 2) * 0.28).toFixed(1) + 'px');
            });
            btn.addEventListener('mouseleave', function () {
                btn.style.setProperty('--mx', '0px');
                btn.style.setProperty('--my', '0px');
            });
        });
    }

    // ========================================
    // Testimonial slider (autoplay + controls)
    // ========================================
    function initTestimonials() {
        const track = document.getElementById('tTrack');
        if (!track) return;
        const slides = track.children;
        if (!slides.length) return;
        const dotsWrap = document.getElementById('tDots');
        const prev = document.getElementById('tPrev');
        const next = document.getElementById('tNext');
        let index = 0;
        let timer = null;

        function goTo(i) {
            index = (i + slides.length) % slides.length;
            track.style.transform = 'translateX(-' + (index * (100 / slides.length)) + '%)';
            if (dotsWrap) {
                Array.prototype.forEach.call(dotsWrap.children, function (dot, d) {
                    dot.classList.toggle('active', d === index);
                });
            }
        }

        if (dotsWrap) {
            for (let i = 0; i < slides.length; i++) {
                const dot = document.createElement('button');
                dot.type = 'button';
                dot.className = 't-dot' + (i === 0 ? ' active' : '');
                dot.setAttribute('aria-label', 'Go to testimonial ' + (i + 1));
                (function (i) {
                    dot.addEventListener('click', function () {
                        goTo(i);
                        restart();
                    });
                })(i);
                dotsWrap.appendChild(dot);
            }
        }
        if (prev) prev.addEventListener('click', function () { goTo(index - 1); restart(); });
        if (next) next.addEventListener('click', function () { goTo(index + 1); restart(); });

        const wrap = track.closest('.t-testimonials');
        function restart() {
            if (timer) clearInterval(timer);
            if (!wrap || wrap.matches(':hover')) return;
            timer = setInterval(function () { goTo(index + 1); }, 6000);
        }
        if (wrap) {
            wrap.addEventListener('mouseenter', function () { if (timer) clearInterval(timer); });
            wrap.addEventListener('mouseleave', restart);
        }
        restart();
    }

    // ========================================
    // GSAP-driven animations
    // ========================================
    let gsapRan = false;
    function initGSAPAnimations() {
        if (gsapRan) return;
        gsapRan = true;

        // Instant refresh so trigger positions match final layout.
        if (ScrollTriggerOK) ScrollTrigger.refresh();

        // ---- Hero timeline (plays once on load; skipped for reduced motion) ----
        const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (!prefersReduced) {
            const heroTl = gsap.timeline({ delay: 0.2, defaults: { ease: 'power3.out' } });
            const clearHero = 'opacity,transform,filter';
            heroTl
                .fromTo('.hero-badge',           { y: 26, opacity: 0, filter: 'blur(7px)' },   { y: 0, opacity: 1, filter: 'blur(0px)', duration: 0.65, clearProps: clearHero })
                .fromTo('.hero-title',           { y: 48, opacity: 0, filter: 'blur(10px)' },  { y: 0, opacity: 1, filter: 'blur(0px)', duration: 0.95, clearProps: clearHero }, '-=0.42')
                .fromTo('.hero-subtitle',        { y: 30, opacity: 0, filter: 'blur(8px)' },   { y: 0, opacity: 1, filter: 'blur(0px)', duration: 0.8, clearProps: clearHero }, '-=0.55')
                .fromTo('.hero-features > span', { y: 24, opacity: 0, filter: 'blur(6px)' },   { y: 0, opacity: 1, filter: 'blur(0px)', duration: 0.6, stagger: 0.11, clearProps: clearHero }, '-=0.5')
                .fromTo('.hero-cta > .btn',      { y: 28, opacity: 0, filter: 'blur(6px)' },   { y: 0, opacity: 1, filter: 'blur(0px)', duration: 0.7, stagger: 0.15, clearProps: clearHero }, '-=0.5')
                .fromTo('.hero-rating',          { y: 18, opacity: 0, filter: 'blur(6px)' },   { y: 0, opacity: 1, filter: 'blur(0px)', duration: 0.6, clearProps: clearHero }, '-=0.45');
        }

        // Continuous float for hero cards / blobs
        gsap.to('.hero-blob-1', { y: -40, duration: 7, yoyo: true, repeat: -1, ease: 'sine.inOut' });
        gsap.to('.hero-blob-2', { y: 40, duration: 8, yoyo: true, repeat: -1, ease: 'sine.inOut' });

        // ---- Scroll-reveal helper (visible until trigger fires) ----
        function reveal(selector, trigger, start, extra) {
            if (!ScrollTriggerOK) return; // Leave content fully visible
            gsap.fromTo(selector,
                { y: 40, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    duration: 0.8,
                    stagger: extra && extra.stagger || 0.08,
                    delay: extra && extra.delay || 0,
                    ease: 'power3.out',
                    clearProps: 'opacity,transform',
                    immediateRender: false,
                    scrollTrigger: {
                        trigger: trigger || selector,
                        start: start || 'top 88%',
                        once: true,
                        invalidateOnRefresh: true
                    }
                }
            );
        }

        // Data-animate elements (section headers, footers, etc.)
        if (ScrollTriggerOK) {
            document.querySelectorAll('[data-animate]').forEach(function (el) {
                el.dataset.animated = 'prepared';
            });
            gsap.utils.toArray('[data-animate]').forEach(function (el) {
                const delay = parseFloat(el.getAttribute('data-delay')) || 0;
                reveal(el, el, 'top 88%', { delay: delay, stagger: 0 });
            });
        }

        // Category cards
        reveal('.category-card', '.categories-section .row', 'top 88%');

        // Service cards
        reveal('.service-card', '.services-section .row', 'top 88%');

        // Product cards
        reveal('.product-card', '.products-section .row', 'top 82%');

        // Offer banners
        reveal('.offer-banner', '.offers-section .row', 'top 88%');

        // Why us cards + stats
        reveal('.why-card', '.why-us-section .row', 'top 88%');
        reveal('.why-stats', '.why-stats', 'top 92%');

        // Footer
        reveal('.footer-newsletter', '.footer', 'top 92%');
        reveal('.footer-main', '.footer-main', 'top 90%');

        // ---- Counters ----
        if (ScrollTriggerOK) {
            document.querySelectorAll('[data-count]').forEach(function (counter) {
                const target = parseInt(counter.getAttribute('data-count'), 10) || 0;
                gsap.fromTo(counter,
                    { textContent: 0 },
                    {
                        textContent: target,
                        duration: 2,
                        snap: { textContent: 1 },
                        ease: 'power2.out',
                        immediateRender: false,
                        scrollTrigger: {
                            trigger: counter,
                            start: 'top 90%',
                            once: true,
                            invalidateOnRefresh: true
                        }
                    }
                );
            });
        }

        // ---- Industry-standard stagger rein (safe re-animate after refresh) ----
        if (ScrollTriggerOK) {
            window.addEventListener('load', safeRefresh);
            setTimeout(safeRefresh, 1500);
        }
    }

    function safeRefresh() {
        if (typeof ScrollTrigger !== 'undefined' && ScrollTrigger.refresh) {
            ScrollTrigger.refresh();
        }
    }

    // ========================================
    // Rotating hero headlines (home page)
    // ========================================
    function initHeroRotator() {
        const lines = document.querySelectorAll('.hero-title-line[data-rotate]');
        if (!lines.length) { return; }

        function prefersReduced() {
            return window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        }

        let current = 0;

        function syncAria() {
            for (let i = 0; i < lines.length; i++) {
                lines[i].setAttribute('aria-hidden', i === current ? 'false' : 'true');
            }
        }

        syncAria();
        if (prefersReduced() || lines.length < 2) { return; }

        setInterval(function () {
            const prev = current;
            const old = lines[prev];
            current = (prev + 1) % lines.length;
            old.classList.add('is-leaving');
            setTimeout(function () {
                old.classList.remove('active', 'is-leaving');
                lines[current].classList.add('active');
                syncAria();
            }, 420);
        }, 4200);
    }

    // ========================================
    // Boot sequence
    // ========================================
    document.addEventListener('DOMContentLoaded', function () {
        initBasicUI();
        // Slight defer so fonts/images/layout settle before measuring triggers.
        setTimeout(initGSAPAnimations, 100);
    });

    // If DOM already parsed (fast script), boot immediately.
    if (document.readyState === 'interactive' || document.readyState === 'complete') {
        setTimeout(function () {
            initBasicUI();
            setTimeout(initGSAPAnimations, 100);
        }, 0);
    }

    // HARD SAFETY NET: guarantee no GSAP-hidden element stays invisible.
    // 4s after load, force everything visible, just in case ScrollTrigger
    // could not fire in this environment.
    setTimeout(function () {
        if (typeof gsap !== 'undefined') {
            gsap.utils.toArray('*').forEach(function (el) {
                const st = el.style;
                if (st && (st.opacity === '0' || st.visibility === 'hidden')) {
                    gsap.set(el, { opacity: '', visibility: '', transform: 'none', y: 0, x: 0 });
                }
            });
        }
    }, 4000);

})();