// Ano atual
    document.getElementById('year').textContent = new Date().getFullYear();

    // Header scroll effect
    window.addEventListener('scroll', () => {
      const header = document.getElementById('header');
      const scrolled = window.scrollY > 20;
      header.classList.toggle('scrolled', scrolled);

      // Scroll indicator
      const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
      const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrolled_percent = (winScroll / height) * 100;
      document.querySelector('.scroll-indicator').style.width = scrolled_percent + '%';
    });

    // Newsletter subscription
    function subscribe(e) {
      e.preventDefault();
      const email = document.getElementById('email').value.trim();
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!emailRegex.test(email)) {
        alert('Por favor, digite um e-mail válido.');
        return;
      }

      // Simulate API call
      const button = e.target.querySelector('button');
      const originalText = button.textContent;

      button.textContent = 'Inscrevendo...';
      button.disabled = true;

      setTimeout(() => {
        e.target.reset();
        document.getElementById('success').style.display = 'block';
        button.textContent = originalText;
        button.disabled = false;

        // Hide success message after 5 seconds
        setTimeout(() => {
          document.getElementById('success').style.display = 'none';
        }, 5000);
      }, 1500);
    }

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
          target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      });
    });

    // Intersection Observer for animations
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
        }
      });
    }, observerOptions);

    // Observe cards for animation
    document.querySelectorAll('.card').forEach(card => {
      card.style.opacity = '0';
      card.style.transform = 'translateY(30px)';
      card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
      observer.observe(card);
    });

    // Mobile menu functionality (basic)
    document.querySelector('.mobile-menu-btn').addEventListener('click', function() {
      const nav = document.querySelector('nav ul');
      nav.style.display = nav.style.display === 'flex' ? 'none' : 'flex';
    });

    // Form validation enhancement
    document.querySelectorAll('input[type="email"]').forEach(input => {
      input.addEventListener('blur', function() {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (this.value && !emailRegex.test(this.value)) {
          this.style.borderColor = '#ef4444';
          this.style.boxShadow = '0 0 0 3px rgba(239, 68, 68, 0.1)';
        } else {
          this.style.borderColor = '#e7e2f5';
          this.style.boxShadow = 'none';
        }
      });
    });

    // Keyboard navigation enhancement
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        // Close any open mobile menus
        const nav = document.querySelector('nav ul');
        if (nav.style.display === 'flex') {
          nav.style.display = 'none';
        }
      }
    });

    // Performance: Lazy load images and animations
    if ('IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src;
            img.classList.remove('lazy');
            imageObserver.unobserve(img);
          }
        });
      });

      document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
      });
    }
