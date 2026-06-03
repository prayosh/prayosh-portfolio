/*
  PRAYOSH CREATIONS - INTERACTIVE WEB ANIMATIONS ENGINE
  Author: Pratik (Web Designer from Ranchi)
  Est: 2026
*/

document.addEventListener("DOMContentLoaded", () => {
  // --- MOBILE NAVIGATION PANEL DRIVER ---
  const menuToggle = document.getElementById("menu-toggle");
  const closeNav = document.getElementById("close-nav");
  const mobileNav = document.getElementById("mobile-nav");
  const backdrop = document.getElementById("backdrop");

  if (menuToggle && mobileNav && backdrop) {
    const toggleMenu = () => {
      mobileNav.classList.toggle("open");
      if (mobileNav.classList.contains("open")) {
        backdrop.style.display = "block";
        gsap.fromTo(".mobile-nav-link", 
          { x: 50, opacity: 0 }, 
          { x: 0, opacity: 1, duration: 0.4, stagger: 0.1, ease: "back.out(1.5)", delay: 0.2 }
        );
      } else {
        backdrop.style.display = "none";
      }
    };

    menuToggle.addEventListener("click", toggleMenu);
    if (closeNav) closeNav.addEventListener("click", toggleMenu);
    backdrop.addEventListener("click", toggleMenu);
  }

  // --- LOOPING GLOWING COMIC TYPEWRITER ---
  const niches = [
    { text: "Restaurant Websites", color: "var(--neon-yellow)" },
    { text: "Clinic Websites", color: "var(--neon-cyan)" },
    { text: "Business Websites", color: "var(--neon-lime)" },
    { text: "Gym/Fitness Websites", color: "var(--neon-orange)" },
    { text: "Boutique Websites", color: "var(--neon-pink)" },
    { text: "Coaching Websites", color: "var(--neon-purple)" }
  ];

  let currentNicheIndex = 0;
  let currentCharIndex = 0;
  let isDeleting = false;
  let typingSpeed = 80;
  const typewriterNicheElement = document.getElementById("typewriter-niche");
  const speechBubbleElement = document.getElementById("speech-bubble");

  function typeEffect() {
    if (!typewriterNicheElement) return;

    const currentNiche = niches[currentNicheIndex];
    const fullText = currentNiche.text;

    if (isDeleting) {
      currentCharIndex--;
      typingSpeed = 30; // Delete faster
    } else {
      currentCharIndex++;
      typingSpeed = 80;
    }

    typewriterNicheElement.textContent = fullText.substring(0, currentCharIndex);
    
    // Dynamically shift glow and text themes matching the specific niche context while preserving the bold black cartoon shadow
    typewriterNicheElement.style.color = currentNiche.color;
    if (speechBubbleElement) {
      speechBubbleElement.style.boxShadow = `7px 7px 0px #000000, 12px 12px 0px ${currentNiche.color}`;
      speechBubbleElement.style.borderColor = '#000000';
    }

    if (!isDeleting && currentCharIndex === fullText.length) {
      // Pause at full word
      typingSpeed = 2200;
      isDeleting = true;
    } else if (isDeleting && currentCharIndex === 0) {
      isDeleting = false;
      currentNicheIndex = (currentNicheIndex + 1) % niches.length;
      typingSpeed = 500; // brief pause before next typing begins
    }

    setTimeout(typeEffect, typingSpeed);
  }

  // Helper utility to deal with raw theme variables nicely
  function varColorToRgb(colorVar) {
    if (colorVar.includes("lime")) return "#CBFB5E";
    if (colorVar.includes("purple")) return "#c084fc";
    if (colorVar.includes("cyan")) return "#00F0FF";
    if (colorVar.includes("orange")) return "#fb923c";
    if (colorVar.includes("yellow")) return "#CBFB5E";
    if (colorVar.includes("pink")) return "#f472b6";
    return "#CBFB5E";
  }

  if (typewriterNicheElement) {
    typeEffect();
  }

  // --- MOUSE PARALLAX & STICKER DRIFTS ---
  const visualArea = document.getElementById("hero-visual");
  if (visualArea && typeof gsap !== 'undefined') {
    visualArea.addEventListener("mousemove", (e) => {
      const rect = visualArea.getBoundingClientRect();
      const relativeX = e.clientX - rect.left - rect.width / 2;
      const relativeY = e.clientY - rect.top - rect.height / 2;

      // Parallax move vector sparkles and geometry shapes
      gsap.to(".floating-element", {
        x: relativeX * 0.08,
        y: relativeY * 0.08,
        duration: 0.6,
        ease: "power2.out",
        stagger: 0.02
      });

      // Perspective tilt retro mock window frame
      gsap.to(".retro-window", {
        rotateX: -relativeY * 0.03,
        rotateY: relativeX * 0.03,
        duration: 0.6,
        transformPerspective: 1000,
        ease: "power1.out"
      });
    });

    visualArea.addEventListener("mouseleave", () => {
      // Smoothly snap elements back to origin with comic elasticity
      gsap.to(".floating-element", {
        x: 0,
        y: 0,
        duration: 0.8,
        ease: "elastic.out(1.1, 0.5)"
      });

      gsap.to(".retro-window", {
        rotateX: 0,
        rotateY: 0,
        duration: 0.8,
        ease: "elastic.out(1.1, 0.5)"
      });
    });
  }

  // --- STICKERS MICRO-REACTIONS ---
  const stickers = document.querySelectorAll(".cartoon-sticker");
  stickers.forEach((sticker) => {
    // Record original rot values set in static style
    let originalRot = 0;
    if (sticker.classList.contains("sticker-delivery")) originalRot = -12;
    if (sticker.classList.contains("sticker-rating")) originalRot = 8;
    if (sticker.classList.contains("sticker-ranchi")) originalRot = 15;

    sticker.addEventListener("mouseenter", () => {
      gsap.to(sticker, {
        scale: 1.12,
        rotation: originalRot + (Math.random() * 8 - 4),
        duration: 0.25,
        ease: "back.out(1.8)"
      });
    });

    sticker.addEventListener("mouseleave", () => {
      gsap.to(sticker, {
        scale: 1,
        rotation: originalRot,
        duration: 0.5,
        ease: "elastic.out(1.2, 0.4)"
      });
    });

    // Tap to wiggle & scatter quick particles
    sticker.addEventListener("click", (e) => {
      gsap.fromTo(sticker, 
        { rotation: originalRot - 18 },
        { rotation: originalRot, duration: 0.6, ease: "elastic.out(1.5, 0.2)" }
      );
      createComicBurst(e.clientX, e.clientY);
    });
  });

  // --- GRAPHICAL VECTOR COMIC SPARKS ---
  function createComicBurst(x, y) {
    const burstCount = 8;
    for (let i = 0; i < burstCount; i++) {
      const ringNode = document.createElement("div");
      ringNode.classList.add("sparkle");
      document.body.appendChild(ringNode);

      // Positioning helper
      ringNode.style.left = `${x - 7.5}px`;
      ringNode.style.top = `${y - 7.5}px`;

      // Set random accent colors for burst sparkles
      const randThemes = ["var(--neon-lime)", "var(--neon-cyan)", "var(--neon-yellow)", "var(--neon-pink)", "var(--neon-orange)"];
      ringNode.style.backgroundColor = randThemes[Math.floor(Math.random() * randThemes.length)];

      const angle = (i / burstCount) * Math.PI * 2;
      const targetRadius = 40 + Math.random() * 32;
      const moveX = Math.cos(angle) * targetRadius;
      const moveY = Math.sin(angle) * targetRadius;

      gsap.set(ringNode, { scale: 0.5, opacity: 1 });
      
      gsap.to(ringNode, {
        x: moveX,
        y: moveY,
        scale: 1.2,
        rotation: Math.random() * 360,
        duration: 0.45,
        ease: "power2.out",
        onComplete: () => {
          gsap.to(ringNode, {
            opacity: 0,
            scale: 0,
            duration: 0.2,
            onComplete: () => ringNode.remove()
          });
        }
      });
    }
  }

  // --- LOADReveals & GSAP SEQUENCER ---
  if (typeof gsap !== 'undefined') {
    const timeline = gsap.timeline();

    // Staggered Navbar entry
    timeline.from(".navbar-anim", {
      y: -60,
      opacity: 0,
      duration: 0.8,
      ease: "back.out(1.4)",
    });

    // Location / Tag line slide bubble
    timeline.from(".hero-location-badge", {
      scale: 0.3,
      opacity: 0,
      rotation: -30,
      duration: 0.5,
      ease: "back.out(1.8)"
    }, "-=0.3");

    // Title reveal & slant line highlight
    timeline.from(".reveal-item", {
      y: 40,
      opacity: 0,
      duration: 0.7,
      ease: "power3.out",
      stagger: 0.15
    }, "-=0.3");

    // Bubble Typewriter box zoom pop
    timeline.from(".speech-bubble-container", {
      scale: 0.2,
      opacity: 0,
      duration: 0.6,
      ease: "back.out(1.5)"
    }, "-=0.2");

    // Primary CTA Action sets popping up
    timeline.from(".btn-anim", {
      y: 30,
      opacity: 0,
      duration: 0.5,
      ease: "back.out(1.4)",
      stagger: 0.12
    }, "-=0.3");

    // Right Mock Workspace Window Slide in & drop bounce
    timeline.from(".retro-window", {
      x: 100,
      opacity: 0,
      rotation: 10,
      duration: 0.8,
      ease: "back.out(1.3)"
    }, "-=0.5");

    // Staggered Stickers cascade
    timeline.from(".cartoon-sticker", {
      scale: 0,
      opacity: 0,
      duration: 0.5,
      stagger: 0.15,
      ease: "elastic.out(1.2, 0.4)"
    }, "-=0.3");

    // Floating comic symbols gentle slide
    timeline.from(".floating-element", {
      opacity: 0,
      scale: 0,
      duration: 0.6,
      stagger: 0.1,
      ease: "back.out(2)"
    }, "-=0.4");

    // Start gentle vertical loop floating pattern after load reveals
    timeline.add(() => {
      gsap.to(".el-1, .el-3, .sticker-delivery", {
        y: "-=12",
        duration: 3,
        yoyo: true,
        repeat: -1,
        ease: "power1.easeInOut"
      });
      gsap.to(".el-2, .el-4, .sticker-rating, .sticker-ranchi", {
        y: "+=12",
        duration: 3.5,
        yoyo: true,
        repeat: -1,
        ease: "power1.easeInOut"
      });
    });

    // --- GSAP SCROLL TRIGGER REVEALS PLACEHOLDER ---
    if (typeof ScrollTrigger !== 'undefined') {
      gsap.utils.toArray(".badge-card").forEach((card, i) => {
        gsap.from(card, {
          scrollTrigger: {
            trigger: card,
            start: "top 85%",
            toggleActions: "play none none none"
          },
          y: 60,
          opacity: 0,
          rotation: i % 2 === 0 ? -3 : 3,
          duration: 0.6,
          ease: "back.out(1.5)"
        });
      });

      // --- BENEFITS CARD REVEAL ANIMATIONS WITH GSAP ---
      const benefitCarousel = document.getElementById("benefit-carousel-card");
      if (benefitCarousel) {
        gsap.from(benefitCarousel, {
          scrollTrigger: {
            trigger: benefitCarousel,
            start: "top 88%",
            toggleActions: "play none none none"
          },
          y: 50,
          opacity: 0,
          scale: 0.95,
          duration: 0.7,
          ease: "back.out(1.2)"
        });
      }

      // --- PROCESS INFOGRAPHIC STEP ANIMATIONS ---
      // Clean, professional reveal animations without bouncy effects
      gsap.from("#process-step-1, #process-step-2, #process-step-3, #process-step-4", {
        scrollTrigger: {
          trigger: ".process-grid",
          start: "top 85%",
          toggleActions: "play none none none"
        },
        y: 40,
        opacity: 0,
        duration: 0.6,
        stagger: 0.15,
        ease: "power2.out"
      });

      // Smooth custom animation entries for the connecting arrows on desktop
      gsap.utils.toArray(".step-arrow").forEach((arrow, idx) => {
        gsap.from(arrow, {
          scrollTrigger: {
            trigger: arrow,
            start: "top 90%",
            toggleActions: "play none none none"
          },
          scale: 0.8,
          opacity: 0,
          duration: 0.5,
          ease: "power2.out",
          delay: 0.4 + (idx * 0.1)
        });
      });

      // --- STATS GRID POP-IN ANIMATIONS WITH GSAP ---
      gsap.to(".stat-item", {
        scrollTrigger: {
          trigger: ".stats-grid",
          start: "top 85%",
          toggleActions: "play none none none"
        },
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.65,
        stagger: 0.12,
        ease: "back.out(1.8)"
      });
    }

    // --- AUTOMATIC HORIZONTAL SCROLL FOR TRUST BADGES ---
    const badgeGrid = document.querySelector(".trust-badges-grid");
    if (badgeGrid) {
      let isHovered = false;
      badgeGrid.addEventListener("mouseenter", () => { isHovered = true; });
      badgeGrid.addEventListener("mouseleave", () => { isHovered = false; });
      badgeGrid.addEventListener("touchstart", () => { isHovered = true; });
      badgeGrid.addEventListener("touchend", () => { isHovered = false; });

      setInterval(() => {
        if (isHovered) return;
        
        const maxScrollLeft = badgeGrid.scrollWidth - badgeGrid.clientWidth;
        if (maxScrollLeft <= 0) return;

        // If near the end, reset scroll to the beginning
        if (Math.ceil(badgeGrid.scrollLeft) >= maxScrollLeft - 15) {
          badgeGrid.scrollTo({
            left: 0,
            behavior: "smooth"
          });
        } else {
          // scroll to the next card block
          const cards = badgeGrid.querySelectorAll(".badge-card");
          if (cards.length > 0) {
            const cardWidth = cards[0].offsetWidth + 24; // Card width + 1.5rem gap (24px)
            badgeGrid.scrollTo({
              left: badgeGrid.scrollLeft + cardWidth,
              behavior: "smooth"
            });
          }
        }
      }, 3500); // Transition/scroll every 3.5 seconds
    }

    // --- AUTOMATIC HORIZONTAL SCROLL FOR PROCESS STEPS (MOBILE ONLY) ---
    const processGrid = document.querySelector(".process-grid");
    if (processGrid) {
      let isProcessHovered = false;
      processGrid.addEventListener("mouseenter", () => { isProcessHovered = true; });
      processGrid.addEventListener("mouseleave", () => { isProcessHovered = false; });
      processGrid.addEventListener("touchstart", () => { isProcessHovered = true; });
      processGrid.addEventListener("touchend", () => { isProcessHovered = false; });

      setInterval(() => {
        if (isProcessHovered) return;
        
        // Only auto-scroll horizontally in mobile/tablet viewport sizes
        if (window.innerWidth >= 640) return;

        const maxScrollLeft = processGrid.scrollWidth - processGrid.clientWidth;
        if (maxScrollLeft <= 0) return;

        // If near the end, loop back smoothly
        if (Math.ceil(processGrid.scrollLeft) >= maxScrollLeft - 15) {
          processGrid.scrollTo({
            left: 0,
            behavior: "smooth"
          });
        } else {
          const cards = processGrid.querySelectorAll(".process-step-wrapper");
          if (cards.length > 0) {
            const cardWidth = cards[0].offsetWidth + 20; // card's own offset width plus gap
            processGrid.scrollTo({
              left: processGrid.scrollLeft + cardWidth,
              behavior: "smooth"
            });
          }
        }
      }, 4000); // Transition/scroll every 4 seconds
    }

    // --- BENEFITS CARD CAROUSEL (FADING DYNAMIC ENGINE) ---
    const benefitCard = document.getElementById("benefit-carousel-card");
    const slides = benefitCard ? Array.from(benefitCard.querySelectorAll(".benefit-slide")) : [];
    const indicators = benefitCard ? Array.from(benefitCard.querySelectorAll(".indicator")) : [];

    if (benefitCard && slides.length > 0) {
      let currentIdx = 0;
      let cycleInterval;

      const cardColors = [
        "var(--neon-lime)",
        "var(--neon-cyan)",
        "var(--neon-purple)",
        "var(--neon-pink)",
        "var(--neon-orange)",
        "var(--neon-yellow)"
      ];

      const showSlide = (nextIndex) => {
        if (nextIndex === currentIdx) return;

        const currentSlide = slides[currentIdx];
        const nextSlide = slides[nextIndex];

        // 1. Update card background color corresponding to the next slide
        benefitCard.style.backgroundColor = cardColors[nextIndex];

        // 2. Play transition: fade-out current slide gracefully
        currentSlide.classList.remove("active");
        currentSlide.classList.add("leaving");

        // Clean up leaving state after transition finishes
        setTimeout(() => {
          currentSlide.classList.remove("leaving");
        }, 300);

        // 3. Play transition: fade-in / slide-up next slide
        nextSlide.classList.add("active");

        // 4. Update indicators
        indicators.forEach((indicator, idx) => {
          if (idx === nextIndex) {
            indicator.classList.add("active");
          } else {
            indicator.classList.remove("active");
          }
        });

        currentIdx = nextIndex;
      };

      const startAutoCycle = () => {
        stopAutoCycle(); // Prevent duplicates
        cycleInterval = setInterval(() => {
          const nextIdx = (currentIdx + 1) % slides.length;
          showSlide(nextIdx);
        }, 5000); // Cycles every 5 seconds
      };

      const stopAutoCycle = () => {
        if (cycleInterval) clearInterval(cycleInterval);
      };

      // Start the cycle on load
      startAutoCycle();

      // Implement clicking indicators for lightweight interactivity
      indicators.forEach((indicator, idx) => {
        indicator.addEventListener("click", () => {
          showSlide(idx);
          startAutoCycle(); // Reset interval timer so it stays on the selected slide full duration
        });
      });

      // Pause cycle on hover (desktop friendly)
      benefitCard.addEventListener("mouseenter", stopAutoCycle);
      benefitCard.addEventListener("mouseleave", startAutoCycle);
    }

    // --- WEBSITE READINESS QUIZ SYSTEM ---
    const quizQuestions = [
      {
        text: "Does your business currently have a website?",
        pointsForYes: 0
      },
      {
        text: "Can customers find your business on Google by searching your business name?",
        pointsForYes: 0
      },
      {
        text: "Are your competitors showing up on Google and you're not?",
        pointsForYes: 1
      },
      {
        text: "Do customers ever ask you — \"Do you have a website?\" or \"Where can I see your work online?\"",
        pointsForYes: 1
      },
      {
        text: "Do you rely only on word-of-mouth or walk-in customers to grow your business?",
        pointsForYes: 1
      },
      {
        text: "Is your business listed on Google Maps with photos, timings & contact details?",
        pointsForYes: 0
      },
      {
        text: "Can customers contact you or enquire about your services at midnight — without calling you?",
        pointsForYes: 0
      },
      {
        text: "Do you find it hard to explain your services, pricing or work to new customers every time?",
        pointsForYes: 1
      },
      {
        text: "Have you ever lost a customer because they couldn't find information about your business online?",
        pointsForYes: 1
      },
      {
        text: "Do you want your business to grow beyond your local area and reach more customers?",
        pointsForYes: 1
      }
    ];

    let currentQuestionIdx = 0;
    let quizScore = 0;

    const startQuizBtn = document.getElementById("start-quiz-btn");
    const quizIntro = document.getElementById("quiz-intro");
    const quizPlay = document.getElementById("quiz-play");
    const quizResults = document.getElementById("quiz-results");
    
    const questionText = document.getElementById("question-text");
    const currentQNum = document.getElementById("current-q-num");
    const progressBarInner = document.getElementById("quiz-progress-bar-inner");
    
    const quizBtnYes = document.getElementById("quiz-btn-yes");
    const quizBtnNo = document.getElementById("quiz-btn-no");
    
    const resultsEmblem = document.getElementById("results-emblem");
    const resultsCategoryTitle = document.getElementById("results-category-title");
    const resultsTitleText = document.getElementById("results-title-text");
    const scoreNumber = document.getElementById("score-number");
    const resultsParagraph = document.getElementById("results-paragraph");
    const resultsActionBtn = document.getElementById("results-action-btn");
    const restartQuizBtn = document.getElementById("restart-quiz-btn");

    if (startQuizBtn && quizIntro && quizPlay && quizResults) {
      startQuizBtn.addEventListener("click", () => {
        quizIntro.classList.add("hidden");
        quizPlay.classList.remove("hidden");
        currentQuestionIdx = 0;
        quizScore = 0;
        showQuestion();
      });

      function showQuestion() {
        if (currentQuestionIdx >= quizQuestions.length) {
          showResults();
          return;
        }

        const currentQObj = quizQuestions[currentQuestionIdx];
        questionText.textContent = currentQObj.text;
        currentQNum.textContent = currentQuestionIdx + 1;
        
        // Update progress bar
        const progressPercent = ((currentQuestionIdx + 1) / quizQuestions.length) * 100;
        if (progressBarInner) {
          progressBarInner.style.width = `${progressPercent}%`;
        }

        // Bouncy entry animation on question card element
        const cardElem = document.getElementById("question-card");
        if (cardElem) {
          cardElem.style.transform = "scale(0.95)";
          setTimeout(() => {
            cardElem.style.transform = "scale(1)";
          }, 50);
        }
      }

      function handleAnswer(answeredYes) {
        if (answeredYes) {
          quizScore += 1;
        }

        currentQuestionIdx++;
        showQuestion();
      }

      if (quizBtnYes) {
        quizBtnYes.addEventListener("click", () => handleAnswer(true));
      }
      if (quizBtnNo) {
        quizBtnNo.addEventListener("click", () => handleAnswer(false));
      }

      function showResults() {
        quizPlay.classList.add("hidden");
        quizResults.classList.remove("hidden");
        
        if (scoreNumber) {
          scoreNumber.textContent = `${quizScore}/10`;
        }
        
        if (quizScore <= 3) {
          if (resultsEmblem) resultsEmblem.textContent = "👍";
          if (resultsCategoryTitle) {
            resultsCategoryTitle.textContent = "You're doing okay!";
            resultsCategoryTitle.style.color = "var(--neon-lime)";
          }
          if (resultsTitleText) resultsTitleText.textContent = "Not Bad — But You Could Do Better!";
          if (resultsParagraph) {
            resultsParagraph.textContent = "Your business has some online presence, but there's still a lot of opportunity you're missing out on. A professional website could take your business to the next level.";
          }
          if (resultsActionBtn) {
            resultsActionBtn.textContent = "See How I Can Help →";
            resultsActionBtn.className = "btn-cartoon btn-results-cta hover-pop thick-border font-space btn-green-style";
            resultsActionBtn.href = `https://wa.me/917479638555?text=Hello%20Pratik!%20I%20just%20completed%20the%20Website%20Readiness%20Quiz%20and%20got%20a%20score%20of%20${quizScore}/10.%20I%27d%20love%20to%20see%20how%20you%20can%20help!`;
          }
        } else if (quizScore <= 6) {
          if (resultsEmblem) resultsEmblem.textContent = "⚠️";
          if (resultsCategoryTitle) {
            resultsCategoryTitle.textContent = "Warning!";
            resultsCategoryTitle.style.color = "var(--neon-orange)";
          }
          if (resultsTitleText) resultsTitleText.textContent = "⚠️ Your Business Is At Risk!";
          if (resultsParagraph) {
            resultsParagraph.textContent = "Your competitors are online and actively attracting customers that could be yours. Without a website, you're invisible to hundreds of potential customers searching for your services daily.";
          }
          if (resultsActionBtn) {
            resultsActionBtn.textContent = "Fix This Now →";
            resultsActionBtn.className = "btn-cartoon btn-results-cta hover-pop thick-border font-space btn-orange-style";
            resultsActionBtn.href = `https://wa.me/917479638555?text=Hello%20Pratik!%20I%20just%20completed%20the%20Website%20Readiness%20Quiz%20and%20got%20a%20score%20of%20${quizScore}/10.%20I%20want%20to%20fix%20this%20asap!`;
          }
        } else {
          if (resultsEmblem) resultsEmblem.textContent = "🚨";
          if (resultsCategoryTitle) {
            resultsCategoryTitle.textContent = "Red Alert!";
            resultsCategoryTitle.style.color = "var(--neon-pink)";
          }
          if (resultsTitleText) resultsTitleText.textContent = "🚨 Your Business Needs A Website RIGHT NOW!";
          if (resultsParagraph) {
            resultsParagraph.textContent = "Every single day without a website is costing you real customers and real money. While you're reading this, someone just Googled your service — and found your competitor instead of you. Let's change that today.";
          }
          if (resultsActionBtn) {
            resultsActionBtn.textContent = "Fix This Now →";
            resultsActionBtn.className = "btn-cartoon btn-results-cta hover-pop thick-border font-space btn-pink-style";
            resultsActionBtn.href = `https://wa.me/917479638555?text=Hello%20Pratik!%20I%20just%20completed%20the%20Website%20Readiness%20Quiz%20and%20got%20a%20Red%20Alert%20score%20of%20${quizScore}/10.%20I%20need%20a%20website%20right%20now!`;
          }
        }
      }

      if (restartQuizBtn) {
        restartQuizBtn.addEventListener("click", () => {
          quizResults.classList.add("hidden");
          quizPlay.classList.remove("hidden");
          currentQuestionIdx = 0;
          quizScore = 0;
          showQuestion();
        });
      }
    }

    // --- TESTIMONIALS MARQUEE HORIZONTAL INFINITE SCROLL ---
    const testimonialsTrack = document.querySelector(".testimonials-track");
    if (testimonialsTrack) {
      gsap.to(testimonialsTrack, {
        xPercent: -50,
        ease: "none",
        duration: 35,
        repeat: -1
      });

      // Pause scroll on hover/touch
      testimonialsTrack.addEventListener("mouseenter", () => {
        gsap.getTweensOf(testimonialsTrack).forEach(t => t.pause());
      });
      testimonialsTrack.addEventListener("mouseleave", () => {
        gsap.getTweensOf(testimonialsTrack).forEach(t => t.resume());
      });
      testimonialsTrack.addEventListener("touchstart", () => {
        gsap.getTweensOf(testimonialsTrack).forEach(t => t.pause());
      });
      testimonialsTrack.addEventListener("touchend", () => {
        gsap.getTweensOf(testimonialsTrack).forEach(t => t.resume());
      });
    }



  }
});
