document.addEventListener('DOMContentLoaded', () => {
    const isMobile = window.innerWidth <= 900;

    initPageIntro();
    initScrollAnimations();
    initThemeToggle();
    initSmoothScroll();
    initMobileMenu();
    initHeaderScroll();

    if (!isMobile) {
        initParallax();
    }

    initRevealOnScroll();
});

function initPageIntro() {
    const intro = document.getElementById('page-intro');
    const loader = document.getElementById('intro-loader');
    const reveal = document.getElementById('intro-reveal');
    if (!intro) return;

    document.body.classList.add('intro-active');

    const startTime = Date.now();
    const MIN_LOADER_TIME = 800;
    const REVEAL_DURATION = 1500;

    const startRevealPhase = () => {
        if (loader) loader.classList.add('fade-out');

        setTimeout(() => {
            if (reveal) reveal.classList.add('active');

            setTimeout(() => {
                intro.classList.add('exit');
                document.body.classList.remove('intro-active');

                intro.addEventListener('transitionend', (e) => {
                    if (e.target === intro) {
                        intro.remove();
                        window.dispatchEvent(new Event('introFinished'));
                    }
                }, { once: true });
            }, REVEAL_DURATION);
        }, 300);
    };

    window.addEventListener('load', () => {
        const elapsedTime = Date.now() - startTime;
        const timeToWait = Math.max(0, MIN_LOADER_TIME - elapsedTime);
        
        setTimeout(startRevealPhase, timeToWait);
    });
}

function initScrollAnimations() {
    const isMobile = window.innerWidth <= 900;

    const observerOptions = {
        root: null,
        rootMargin: isMobile ? '0px 0px -20px 0px' : '0px 0px -50px 0px',
        threshold: isMobile ? 0.05 : 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const animatedElements = document.querySelectorAll('.fade-in, .fade-left, .fade-right, .fade-scale');
    animatedElements.forEach(el => observer.observe(el));
}

function initRevealOnScroll() {
    const isMobile = window.innerWidth <= 900;

    if (isMobile) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            rootMargin: '0px',
            threshold: 0.1
        });

        const revealElements = document.querySelectorAll('.service-card, .benefit-card, .contact-row');
        revealElements.forEach(el => observer.observe(el));
        return;
    }

    const revealElements = document.querySelectorAll('.service-card, .benefit-card, .contact-row');

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, index * 80); 
                revealObserver.unobserve(entry.target);
            }
        });
    }, {
        rootMargin: '0px 0px -10% 0px',
        threshold: 0.1
    });

    revealElements.forEach(el => revealObserver.observe(el));
}

function initParallax() {
    let ticking = false;

    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                ticking = false;
            });
            ticking = true;
        }
    });
}

function initThemeToggle() {
    const toggleDesktop = document.getElementById('themeToggle');
    const toggleMobile = document.getElementById('themeToggleMobile');
    const html = document.documentElement;

    const sunIcon = '<svg viewBox="0 0 24 24"><path d="M12 7c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zM2 13h2c.55 0 1-.45 1-1s-.45-1-1-1H2c-.55 0-1 .45-1 1s.45 1 1 1zm18 0h2c.55 0 1-.45 1-1s-.45-1-1-1h-2c-.55 0-1 .45-1 1s.45 1 1 1zM11 2v2c0 .55.45 1 1 1s1-.45 1-1V2c0-.55-.45-1-1-1s-1 .45-1 1zm0 18v2c0 .55.45 1 1 1s1-.45 1-1v-2c0-.55-.45-1-1-1s-1 .45-1 1zM5.99 4.58c-.39-.39-1.03-.39-1.41 0-.39.39-.39 1.03 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0s.39-1.03 0-1.41L5.99 4.58zm12.37 12.37c-.39-.39-1.03-.39-1.41 0-.39.39-.39 1.03 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0 .39-.39.39-1.03 0-1.41l-1.06-1.06zm1.06-10.96c.39-.39.39-1.03 0-1.41-.39-.39-1.03-.39-1.41 0l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06zM7.05 18.36c.39-.39.39-1.03 0-1.41-.39-.39-1.03-.39-1.41 0l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06z"/></svg>';
    const moonIcon = '<svg viewBox="0 0 24 24"><path d="M12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9 9-4.03 9-9c0-.46-.04-.92-.1-1.36-.98 1.37-2.58 2.26-4.4 2.26-2.98 0-5.4-2.42-5.4-5.4 0-1.81.89-3.42 2.26-4.4-.44-.06-.9-.1-1.36-.1z"/></svg>';

    function setIcons(icon) {
        if (toggleDesktop) toggleDesktop.innerHTML = icon;
        if (toggleMobile) toggleMobile.innerHTML = icon;
    }

    function applyTheme(dark) {
        if (dark) {
            html.setAttribute('data-theme', 'dark');
            setIcons(moonIcon);
        } else {
            html.removeAttribute('data-theme');
            setIcons(sunIcon);
        }
    }

    applyTheme(true);

    function onToggleClick() {
        const isDark = html.getAttribute('data-theme') === 'dark';
        applyTheme(!isDark);
    }

    if (toggleDesktop) toggleDesktop.addEventListener('click', onToggleClick);
    if (toggleMobile) toggleMobile.addEventListener('click', onToggleClick);
}

function initSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');
    const isMobile = window.innerWidth <= 900;

    links.forEach(link => {
        link.addEventListener('click', (e) => {
            const targetId = link.getAttribute('href');
            if (!targetId || targetId === '#') return;

            const targetSection = document.querySelector(targetId);
            if (!targetSection) return;

            e.preventDefault();

            const headerHeight = document.querySelector('header')?.offsetHeight || 70;
            const targetY = targetSection.getBoundingClientRect().top + window.pageYOffset - headerHeight;

            const duration = isMobile ? 180 : 250;
            smoothScrollTo(targetY, duration);

            document.getElementById('navMenu')?.classList.remove('active');
            document.getElementById('navToggle')?.classList.remove('active');
        });
    });
}

function smoothScrollTo(targetY, duration) {
    const startY = window.pageYOffset;
    const distance = targetY - startY;
    const startTime = performance.now();

    function easeInOutCubic(t) {
        return t < 0.5
            ? 4 * t * t * t
            : 1 - Math.pow(-2 * t + 2, 3) / 2;
    }

    function step(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const ease = easeInOutCubic(progress);

        window.scrollTo(0, startY + distance * ease);

        if (progress < 1) {
            requestAnimationFrame(step);
        }
    }

    requestAnimationFrame(step);
}

function initMobileMenu() {
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    const navOverlay = document.getElementById('navOverlay');
    const navLinks = navMenu.querySelectorAll('.nav-link');

    function openMenu() {
        navMenu.classList.add('active');
        navToggle.classList.add('active');
        if (navOverlay) {
            navOverlay.style.display = 'block';
            requestAnimationFrame(() => navOverlay.classList.add('active'));
        }
        document.body.style.overflow = 'hidden';
    }

    function closeMenu() {
        navMenu.classList.remove('active');
        navToggle.classList.remove('active');
        if (navOverlay) {
            navOverlay.classList.remove('active');
            navOverlay.addEventListener('transitionend', () => {
                navOverlay.style.display = 'none';
            }, { once: true });
        }
        document.body.style.overflow = '';
    }

    navToggle.addEventListener('click', () => {
        navMenu.classList.contains('active') ? closeMenu() : openMenu();
    });

    if (navOverlay) navOverlay.addEventListener('click', closeMenu);

    navLinks.forEach(link => {
        link.addEventListener('click', closeMenu);
    });
}

function initHeaderScroll() {
    const header = document.querySelector('header');
    const isMobile = window.innerWidth <= 900;
    let ticking = false;

    window.addEventListener('scroll', () => {
        if (ticking) return;
        ticking = true;

        requestAnimationFrame(() => {
            const scrolled = window.scrollY;

            if (scrolled > 50) {
                header.style.boxShadow = '0 4px 30px rgba(0, 0, 0, 0.15)';
            } else {
                header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.08)';
            }

            if (isMobile && scrolled > 50) {
                header.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
            }

            ticking = false;
        });
    }, { passive: true });
}