document.addEventListener('DOMContentLoaded', function() {
    const navLinks = document.querySelectorAll('header nav ul li a');
    const header = document.querySelector('header');
    let headerHeight = header ? header.offsetHeight : 75; // Altura fallback

    function updateHeaderHeight() {
        if (window.getComputedStyle(header).position === 'fixed') {
            headerHeight = header.offsetHeight;
        } else {
            headerHeight = 0;
        }
    }
    updateHeaderHeight();

    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                updateHeaderHeight();
                let targetPosition = targetElement.offsetTop - headerHeight;

                if (targetId === '#inicio') {
                    targetPosition = 0;
                }

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });

                navLinks.forEach(l => l.classList.remove('active'));
                this.classList.add('active');
            }
        });
    });

    const sections = document.querySelectorAll('main section');

    function activateLinkOnScroll() {
        updateHeaderHeight();
        let currentSectionId = '';
        let scrollPosition = window.pageYOffset;

        sections.forEach(section => {
            const sectionTop = section.offsetTop - headerHeight - 50;
            const sectionBottom = sectionTop + section.offsetHeight;

            if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
                currentSectionId = '#' + section.getAttribute('id');
            }
        });
        
        if (currentSectionId === '' && scrollPosition < (sections[0].offsetTop + sections[0].offsetHeight / 2 - headerHeight)) {
            currentSectionId = '#inicio';
        }

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === currentSectionId) {
                link.classList.add('active');
            }
        });

        if ((window.innerHeight + window.pageYOffset) >= document.body.offsetHeight - 2) {
             const lastSectionId = '#' + sections[sections.length - 1].getAttribute('id');
             navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === lastSectionId) {
                    link.classList.add('active');
                }
            });
        } else if (currentSectionId === '' && scrollPosition < sections[0].offsetTop ) {
            const inicioLink = document.querySelector('header nav ul li a[href="#inicio"]');
            if(inicioLink) {
                 navLinks.forEach(l => l.classList.remove('active')); // Limpa outros antes de ativar inicio
                 inicioLink.classList.add('active');
            }
        }
    }

    window.addEventListener('scroll', activateLinkOnScroll);
    window.addEventListener('resize', () => {
        updateHeaderHeight();
        activateLinkOnScroll();
    });

    function setInitialActiveLink() {
        updateHeaderHeight();
        const currentHash = window.location.hash;
        let activeSet = false;
        if (currentHash) {
            const activeLinkFromHash = document.querySelector(`header nav ul li a[href="${currentHash}"]`);
            if (activeLinkFromHash) {
                navLinks.forEach(l => l.classList.remove('active'));
                activeLinkFromHash.classList.add('active');
                activeSet = true;
                 // Adicionado para rolar para a seção se houver hash na URL ao carregar
                const targetElement = document.querySelector(currentHash);
                if (targetElement) {
                    let targetPosition = targetElement.offsetTop - headerHeight;
                    if (currentHash === '#inicio') targetPosition = 0;
                    window.scrollTo({ top: targetPosition, behavior: 'auto' }); // 'auto' para ir direto
                }
            }
        }
        
        if (!activeSet) {
            activateLinkOnScroll();
        } else {
             // Garante que o scrollspy rode mesmo se o hash foi encontrado para ajustar a posição inicial exata
            setTimeout(activateLinkOnScroll, 100);
        }
    }
    setInitialActiveLink();

    const anoAtualSpan = document.getElementById('ano-atual');
    if (anoAtualSpan) {
        anoAtualSpan.textContent = new Date().getFullYear();
    }
});