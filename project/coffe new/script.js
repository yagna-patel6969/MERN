/* ============================================================
   Brew & Bean – 3D Animation Script
   Libraries: Three.js r134 + GSAP 3 + ScrollTrigger
   ============================================================ */

'use strict';

/* ──────────────────────────────────────────
   0.  GSAP PLUGIN REGISTRATION
────────────────────────────────────────── */
gsap.registerPlugin(ScrollTrigger);

/* ──────────────────────────────────────────
   1.  LOADER
────────────────────────────────────────── */
window.addEventListener('load', () => {
    const loader = document.getElementById('loader');
    gsap.to(loader, {
        opacity: 0,
        duration: 0.8,
        delay: 2,
        ease: 'power2.inOut',
        onComplete: () => {
            loader.style.display = 'none';
            initHeroAnimations();
        }
    });
});

/* ──────────────────────────────────────────
   2.  THREE.JS HERO SCENE
────────────────────────────────────────── */
(function initThreeJS() {
    const canvas = document.getElementById('hero-canvas');
    const scene  = new THREE.Scene();

    /* Camera */
    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.set(0, 0, 18);

    /* Renderer */
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);

    /* Lights */
    const ambient = new THREE.AmbientLight(0xfff0e0, 0.6);
    scene.add(ambient);

    const pointLight1 = new THREE.PointLight(0xd4a574, 3, 40);
    pointLight1.position.set(0, 10, 10);
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0x8b4513, 2, 30);
    pointLight2.position.set(-10, -8, 5);
    scene.add(pointLight2);

    /* ── Coffee Beans (Torus-derived shapes) ── */
    const beanGroup = new THREE.Group();
    scene.add(beanGroup);

    const beanMat = new THREE.MeshStandardMaterial({
        color: 0xd4a574,
        metalness: 0.7,
        roughness: 0.2,
        emissive: 0x3a1a08,
        emissiveIntensity: 0.3
    });

    const beanGeo = new THREE.TorusGeometry(0.4, 0.18, 10, 24);
    const beanCount = 80;
    const beans = [];

    for (let i = 0; i < beanCount; i++) {
        const mesh = new THREE.Mesh(beanGeo, beanMat.clone());

        // Random spread in 3D space
        const spread = 26;
        mesh.position.set(
            (Math.random() - 0.5) * spread,
            (Math.random() - 0.5) * spread * 0.8,
            (Math.random() - 0.5) * spread * 0.5 - 5
        );

        mesh.rotation.set(
            Math.random() * Math.PI * 2,
            Math.random() * Math.PI * 2,
            Math.random() * Math.PI * 2
        );

        const s = 0.4 + Math.random() * 1.0;
        mesh.scale.setScalar(s);

        // Varying gold hue
        const h = 0.08 + Math.random() * 0.05;
        mesh.material.color.setHSL(h, 0.7, 0.4 + Math.random() * 0.25);

        // Store rotation speed
        beans.push({
            mesh,
            rotSpeed: new THREE.Vector3(
                (Math.random() - 0.5) * 0.01,
                (Math.random() - 0.5) * 0.015,
                (Math.random() - 0.5) * 0.008
            ),
            floatOffset: Math.random() * Math.PI * 2,
            floatSpeed: 0.003 + Math.random() * 0.005
        });

        beanGroup.add(mesh);
    }

    /* ── Steam Particles ── */
    const particleCount = 250;
    const positions = new Float32Array(particleCount * 3);
    const pSpeeds   = new Float32Array(particleCount);
    const pOffsets  = new Float32Array(particleCount);

    function resetParticle(i) {
        positions[i * 3]     = (Math.random() - 0.5) * 10;
        positions[i * 3 + 1] = -12 + Math.random() * 2;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 4 - 3;
        pSpeeds[i]  = 0.02 + Math.random() * 0.04;
        pOffsets[i] = Math.random() * Math.PI * 2;
    }

    for (let i = 0; i < particleCount; i++) {
        resetParticle(i);
        positions[i * 3 + 1] = (Math.random() - 0.5) * 24; // spread initial Y
    }

    const partGeo = new THREE.BufferGeometry();
    partGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const partMat = new THREE.PointsMaterial({
        color: 0xd4a574,
        size: 0.12,
        transparent: true,
        opacity: 0.55,
        sizeAttenuation: true
    });

    const particles = new THREE.Points(partGeo, partMat);
    scene.add(particles);

    /* ── Clock & Mouse ── */
    const clock   = new THREE.Clock();
    const mouse3D = { x: 0, y: 0 };

    document.addEventListener('mousemove', (e) => {
        mouse3D.x = (e.clientX / window.innerWidth  - 0.5) * 2;
        mouse3D.y = (e.clientY / window.innerHeight - 0.5) * 2;
    });

    /* ── Resize ── */
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });

    /* ── Animation Loop ── */
    function animate() {
        requestAnimationFrame(animate);
        const elapsed = clock.getElapsedTime();

        // Camera drift following mouse (subtle)
        camera.position.x += (mouse3D.x * 2  - camera.position.x) * 0.02;
        camera.position.y += (-mouse3D.y * 1.5 - camera.position.y) * 0.02;
        camera.lookAt(0, 0, 0);

        // Rotate bean group slowly
        beanGroup.rotation.y = elapsed * 0.04;

        // Individual bean rotations + float
        beans.forEach(({ mesh, rotSpeed, floatOffset, floatSpeed }) => {
            mesh.rotation.x += rotSpeed.x;
            mesh.rotation.y += rotSpeed.y;
            mesh.rotation.z += rotSpeed.z;
            mesh.position.y += Math.sin(elapsed * floatSpeed + floatOffset) * 0.002;
        });

        // Animate steam particles — rise upward
        const pos = particles.geometry.attributes.position;
        for (let i = 0; i < particleCount; i++) {
            pos.array[i * 3 + 1] += pSpeeds[i];
            pos.array[i * 3]     += Math.sin(elapsed + pOffsets[i]) * 0.005; // drift sideways

            // Fade/reset when reaching top
            if (pos.array[i * 3 + 1] > 14) resetParticle(i);
        }
        pos.needsUpdate = true;

        renderer.render(scene, camera);
    }

    animate();
})();

/* ──────────────────────────────────────────
   3.  HERO TEXT GSAP ANIMATIONS
────────────────────────────────────────── */
function initHeroAnimations() {
    const tl = gsap.timeline({ delay: 0.2 });

    tl.to('.hero-badge', {
        opacity: 1,
        y: 0,
        duration: 0.7,
        ease: 'power3.out'
    })
    .to('#hero-title', {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: 'power3.out'
    }, '-=0.3')
    .to('#hero-subtitle', {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power3.out'
    }, '-=0.6')
    .to('#cta-btn', {
        opacity: 1,
        duration: 0.7,
        ease: 'power2.out'
    }, '-=0.4')
    .to('.scroll-hint', {
        opacity: 1,
        duration: 0.8,
        ease: 'power2.out'
    }, '-=0.2')
    .from('.float-label', {
        opacity: 0,
        y: 20,
        duration: 0.6,
        stagger: 0.2,
        ease: 'power2.out'
    }, '-=0.5');
}

/* ──────────────────────────────────────────
   4.  NAVBAR SCROLL EFFECT
────────────────────────────────────────── */
const navbar = document.getElementById('navbar');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const current = window.scrollY;
    if (current > 80) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
    lastScroll = current;
});

/* ──────────────────────────────────────────
   5.  GSAP SCROLL TRIGGER SECTION REVEALS
────────────────────────────────────────── */
function setupScrollAnimations() {

    /* Generic up reveals */
    gsap.utils.toArray('.reveal-up').forEach((el, i) => {
        gsap.to(el, {
            opacity: 1,
            y: 0,
            duration: 0.9,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: el,
                start: 'top 88%',
                toggleActions: 'play none none none'
            },
            delay: i * 0.05
        });
    });

    /* Left reveals */
    gsap.utils.toArray('.reveal-left').forEach(el => {
        gsap.to(el, {
            opacity: 1,
            x: 0,
            duration: 1,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: el,
                start: 'top 85%',
                toggleActions: 'play none none none'
            }
        });
    });

    /* Right reveals */
    gsap.utils.toArray('.reveal-right').forEach(el => {
        gsap.to(el, {
            opacity: 1,
            x: 0,
            duration: 1,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: el,
                start: 'top 85%',
                toggleActions: 'play none none none'
            }
        });
    });

    /* Scale reveals (gallery) */
    gsap.utils.toArray('.reveal-scale').forEach((el, i) => {
        gsap.to(el, {
            opacity: 1,
            scale: 1,
            duration: 0.7,
            ease: 'back.out(1.4)',
            scrollTrigger: {
                trigger: el,
                start: 'top 90%',
                toggleActions: 'play none none none'
            },
            delay: i * 0.08
        });
    });

    /* Menu categories staggered flip-in */
    gsap.utils.toArray('.menu-category').forEach((cat, i) => {
        gsap.from(cat, {
            rotateX: -30,
            opacity: 0,
            y: 80,
            duration: 0.9,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: cat,
                start: 'top 88%',
                toggleActions: 'play none none none'
            },
            delay: i * 0.15
        });
    });

    /* Review cards stagger */
    gsap.from('.review-card', {
        opacity: 0,
        y: 60,
        scale: 0.9,
        duration: 0.8,
        stagger: 0.15,
        ease: 'back.out(1.2)',
        scrollTrigger: {
            trigger: '.reviews-grid',
            start: 'top 85%',
            toggleActions: 'play none none none'
        }
    });

    /* Section bg text parallax */
    gsap.utils.toArray('.section-bg-text').forEach(el => {
        gsap.to(el, {
            y: -60,
            ease: 'none',
            scrollTrigger: {
                trigger: el.parentElement,
                start: 'top bottom',
                end: 'bottom top',
                scrub: true
            }
        });
    });
}

/* Run scroll animations after a short delay so loader doesn't interfere */
setTimeout(setupScrollAnimations, 2200);

/* ──────────────────────────────────────────
   6.  COUNT-UP ANIMATION
────────────────────────────────────────── */
function setupCounters() {
    document.querySelectorAll('.count-up').forEach(el => {
        const target = parseInt(el.dataset.target, 10);
        const isLarge = target >= 1000;

        ScrollTrigger.create({
            trigger: el,
            start: 'top 85%',
            onEnter: () => {
                gsap.fromTo({ val: 0 },
                    { val: 0 },
                    {
                        val: target,
                        duration: 2,
                        ease: 'power2.out',
                        onUpdate: function () {
                            const v = Math.round(this.targets()[0].val);
                            if (isLarge) {
                                el.textContent = (v >= 1000)
                                    ? Math.round(v / 1000) + 'K+'
                                    : v + '';
                            } else {
                                el.textContent = v + '+';
                            }
                        }
                    }
                );
            },
            once: true
        });
    });
}

setTimeout(setupCounters, 2200);

/* ──────────────────────────────────────────
   7.  3D TILT EFFECT (mouse hover on cards)
────────────────────────────────────────── */
(function setupTilt() {
    const MAX_TILT = 12; // degrees

    document.querySelectorAll('.tilt-card').forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect   = card.getBoundingClientRect();
            const cx     = rect.left + rect.width  / 2;
            const cy     = rect.top  + rect.height / 2;
            const dx     = (e.clientX - cx) / (rect.width  / 2);
            const dy     = (e.clientY - cy) / (rect.height / 2);
            const rotY   =  dx * MAX_TILT;
            const rotX   = -dy * MAX_TILT;

            gsap.to(card, {
                rotateX: rotX,
                rotateY: rotY,
                transformPerspective: 800,
                duration: 0.3,
                ease: 'power2.out'
            });
        });

        card.addEventListener('mouseleave', () => {
            gsap.to(card, {
                rotateX: 0,
                rotateY: 0,
                duration: 0.6,
                ease: 'elastic.out(1, 0.5)'
            });
        });
    });
})();

/* ──────────────────────────────────────────
   8.  MAGNETIC BUTTON EFFECT
────────────────────────────────────────── */
(function setupMagnetic() {
    document.querySelectorAll('.magnetic-btn').forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const cx   = rect.left + rect.width  / 2;
            const cy   = rect.top  + rect.height / 2;
            const dx   = (e.clientX - cx) * 0.28;
            const dy   = (e.clientY - cy) * 0.28;

            gsap.to(btn, {
                x: dx,
                y: dy,
                duration: 0.4,
                ease: 'power2.out'
            });
        });

        btn.addEventListener('mouseleave', () => {
            gsap.to(btn, {
                x: 0,
                y: 0,
                duration: 0.7,
                ease: 'elastic.out(1, 0.4)'
            });
        });
    });
})();

/* ──────────────────────────────────────────
   9.  HERO PARALLAX ON MOUSE MOVE
────────────────────────────────────────── */
(function setupHeroParallax() {
    const heroContent = document.getElementById('hero-content');
    if (!heroContent) return;

    document.addEventListener('mousemove', (e) => {
        const mx = (e.clientX / window.innerWidth  - 0.5);
        const my = (e.clientY / window.innerHeight - 0.5);

        gsap.to(heroContent, {
            x: mx * 20,
            y: my * 12,
            duration: 1.5,
            ease: 'power2.out'
        });
    });
})();

/* ──────────────────────────────────────────
   10. HAMBURGER MOBILE MENU
────────────────────────────────────────── */
(function setupMobileMenu() {
    const hamburger = document.getElementById('hamburger');
    const navMenu   = document.getElementById('nav-menu');

    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    navMenu.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });
})();

/* ──────────────────────────────────────────
   11. GALLERY ITEM HOVER DEPTH (subtle 3D)
────────────────────────────────────────── */
(function setupGalleryDepth() {
    document.querySelectorAll('.gallery-placeholder').forEach(item => {
        item.addEventListener('mousemove', (e) => {
            const rect = item.getBoundingClientRect();
            const dx   = ((e.clientX - rect.left) / rect.width  - 0.5) * 16;
            const dy   = ((e.clientY - rect.top)  / rect.height - 0.5) * 16;
            gsap.to(item, {
                rotateY: dx,
                rotateX: -dy,
                transformPerspective: 600,
                scale: 1.04,
                duration: 0.3,
                ease: 'power2.out'
            });
        });
        item.addEventListener('mouseleave', () => {
            gsap.to(item, {
                rotateX: 0,
                rotateY: 0,
                scale: 1,
                duration: 0.5,
                ease: 'elastic.out(1, 0.6)'
            });
        });
    });
})();

/* ──────────────────────────────────────────
   12. SECTION TITLE GLOW ON SCROLL ENTER
────────────────────────────────────────── */
document.querySelectorAll('.section-title').forEach(title => {
    ScrollTrigger.create({
        trigger: title,
        start: 'top 80%',
        onEnter: () => {
            gsap.fromTo(title,
                { textShadow: '0 0 0px rgba(212,165,116,0)' },
                {
                    textShadow: '0 0 40px rgba(212,165,116,0.5), 0 0 80px rgba(212,165,116,0.15)',
                    duration: 1.2,
                    ease: 'power2.out',
                    yoyo: true,
                    repeat: 1
                }
            );
        },
        once: true
    });
});
