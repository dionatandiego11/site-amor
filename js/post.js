// Reading progress
    window.addEventListener('scroll', () => {
      const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
      const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrolled = (winScroll / height) * 100;
      document.querySelector('.reading-progress').style.width = scrolled + '%';
    });

    // Share functions
    function shareToTwitter() {
      const url = encodeURIComponent(window.location.href);
      const text = encodeURIComponent('Quando Kafka Previu Nosso Pesadelo Moderno: A Metamorfose e a Uberização em 1915');
      window.open(`https://twitter.com/intent/tweet?url=${url}&text=${text}`, '_blank');
    }

    function shareToLinkedIn() {
      const url = encodeURIComponent(window.location.href);
      window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}`, '_blank');
    }

    function shareToWhatsApp() {
      const url = encodeURIComponent(window.location.href);
      const text = encodeURIComponent('Leia este artigo fascinante sobre Kafka e a uberização:');
      window.open(`https://wa.me/?text=${text} ${url}`, '_blank');
    }

    function copyToClipboard() {
      navigator.clipboard.writeText(window.location.href).then(() => {
        // Show temporary success message
        const btn = event.target.closest('.share-btn');
        const originalText = btn.textContent;
        btn.textContent = '✓ Copiado!';
        btn.style.background = '#10b981';
        btn.style.color = 'white';
        btn.style.borderColor = '#10b981';

        setTimeout(() => {
          btn.textContent = originalText;
          btn.style.background = 'white';
          btn.style.color = '#5a556e';
          btn.style.borderColor = '#e7e2f5';
        }, 2000);
      });
    }

    // Newsletter subscription
    function subscribeNewsletter(e) {
      e.preventDefault();
      const button = e.target.querySelector('button');
      const input = e.target.querySelector('input');
      const originalText = button.textContent;

      button.textContent = 'Inscrevendo...';
      button.disabled = true;

      // Simulate API call
      setTimeout(() => {
        button.textContent = '✓ Inscrito!';
        button.style.background = '#10b981';
        input.value = '';

        setTimeout(() => {
          button.textContent = originalText;
          button.style.background = '';
          button.disabled = false;
        }, 3000);
      }, 1500);
    }

    // Reading time estimation
    function estimateReadingTime() {
      const text = document.querySelector('.content-wrapper').textContent;
      const wpm = 200; // words per minute
      const words = text.trim().split(/\s+/).length;
      const time = Math.ceil(words / wpm);

      // Add reading time to header if desired
      const readingTime = document.createElement('span');
      readingTime.textContent = ` • ${time} min de leitura`;
      readingTime.style.color = '#d8cfee';
      readingTime.style.fontSize = '14px';

      const postDate = document.querySelector('.post-date');
      if (postDate) {
        postDate.appendChild(readingTime);
      }
    }

    // Initialize reading time on load
    window.addEventListener('load', estimateReadingTime);

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

    // Observe elements for animation
    document.querySelectorAll('.related-card, .highlight-box, .social-share').forEach(el => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(30px)';
      el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
      observer.observe(el);
    });

    // Print button functionality
    function printArticle() {
      window.print();
    }

    // Add print button to share options
    window.addEventListener('load', () => {
      const shareButtons = document.querySelector('.share-buttons');
      const printBtn = document.createElement('a');
      printBtn.href = '#';
      printBtn.className = 'share-btn';
      printBtn.innerHTML = '🖨️ Imprimir';
      printBtn.onclick = (e) => {
        e.preventDefault();
        printArticle();
      };
      shareButtons.appendChild(printBtn);
    });
