document.addEventListener('DOMContentLoaded', function() {
    // navLinks will be an empty NodeList if the header HTML is removed/commented.
    const navLinks = document.querySelectorAll('header nav ul li a');
    // headerElement will be null if the header HTML is removed/commented.
    const headerElement = document.querySelector('header');
    
    // Since there's no fixed header at the top anymore, its effective height for scrolling offset is 0.
    let headerHeight = 0;

    // This function would normally calculate the header's height if it were present and fixed.
    // Since it's removed or not fixed at the top, we assume 0 for scroll calculations.
    function updateHeaderHeight() {
        if (headerElement && window.getComputedStyle(headerElement).position === 'fixed') {
            headerHeight = headerElement.offsetHeight;
        } else {
            headerHeight = 0; // Default to 0 if no header or not fixed
        }
    }
    updateHeaderHeight(); // Initial call

    // This loop won't iterate if navLinks is empty.
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                updateHeaderHeight(); // Recalculate just in case, though likely 0
                let targetPosition = targetElement.offsetTop - headerHeight;

                // Special case for #inicio, always scroll to the very top.
                if (targetId === '#inicio') {
                    targetPosition = 0; 
                }

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });

                // Remove 'active' class from all links and add to the clicked one.
                // This part won't have a visible effect if navLinks is empty.
                navLinks.forEach(l => l.classList.remove('active'));
                this.classList.add('active');
            }
        });
    });

    const sections = document.querySelectorAll('main section');

    function activateLinkOnScroll() {
        updateHeaderHeight(); // Ensures headerHeight is current (0 in this case)
        let currentSectionId = '';
        let scrollPosition = window.pageYOffset;

        sections.forEach(section => {
            // Adjust sectionTop calculation by headerHeight and a small buffer (50px)
            const sectionTop = section.offsetTop - headerHeight - 50; 
            const sectionBottom = sectionTop + section.offsetHeight;

            if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
                currentSectionId = '#' + section.getAttribute('id');
            }
        });
        
        // If no section is actively "current" but we are near the top, default to #inicio
        // This ensures #inicio link (if present) is active when scrolled to the top.
        if (currentSectionId === '' && sections.length > 0 && scrollPosition < (sections[0].offsetTop + sections[0].offsetHeight / 2 - headerHeight)) {
            currentSectionId = '#inicio';
        }

        // Update 'active' class on navigation links.
        // This part won't have a visible effect if navLinks is empty.
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === currentSectionId) {
                link.classList.add('active');
            }
        });

        // Special handling for the last section when scrolled to the very bottom of the page.
        if (sections.length > 0 && (window.innerHeight + window.pageYOffset) >= document.body.offsetHeight - 2) {
            const lastSectionId = '#' + sections[sections.length - 1].getAttribute('id');
            navLinks.forEach(link => { // Won't iterate if navLinks is empty
                link.classList.remove('active');
                if (link.getAttribute('href') === lastSectionId) {
                    link.classList.add('active');
                }
            });
        // If above all sections, make #inicio active (if link exists)
        } else if (currentSectionId === '' && sections.length > 0 && scrollPosition < sections[0].offsetTop ) {
            const inicioLink = document.querySelector('header nav ul li a[href="#inicio"]'); // This will be null
            if(inicioLink) { // This condition will be false
                navLinks.forEach(l => l.classList.remove('active')); // Won't iterate if navLinks is empty
                inicioLink.classList.add('active');
            }
        }
    }

    window.addEventListener('scroll', activateLinkOnScroll);
    window.addEventListener('resize', () => {
        updateHeaderHeight(); // Recalculate on resize
        activateLinkOnScroll(); // Re-check active section
    });

    function setInitialActiveLink() {
        updateHeaderHeight(); // Set initial headerHeight (0)
        const currentHash = window.location.hash;
        let activeSet = false;
        
        if (currentHash) {
            const activeLinkFromHash = document.querySelector(`header nav ul li a[href="${currentHash}"]`); // Will be null
            if (activeLinkFromHash) { // This condition will be false
                navLinks.forEach(l => l.classList.remove('active')); // Won't iterate
                activeLinkFromHash.classList.add('active');
                activeSet = true;
                
                const targetElement = document.querySelector(currentHash);
                if (targetElement) {
                    let targetPosition = targetElement.offsetTop - headerHeight; // headerHeight is 0
                    if (currentHash === '#inicio') targetPosition = 0;
                    // Use 'auto' for initial load scroll, not 'smooth'
                    window.scrollTo({ top: targetPosition, behavior: 'auto' }); 
                }
            }
        }
        
        // If no hash or link for hash not found, run scroll spy to set based on position
        if (!activeSet) {
            activateLinkOnScroll();
        } else {
            // If hash was found, still run scroll spy after a short delay to ensure correct position
            setTimeout(activateLinkOnScroll, 100);
        }
    }
    setInitialActiveLink(); // Set active link on page load

    const anoAtualSpan = document.getElementById('ano-atual');
    if (anoAtualSpan) {
        anoAtualSpan.textContent = new Date().getFullYear();
    }
});
