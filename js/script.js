document.addEventListener('DOMContentLoaded', () => {
    const carousel = document.querySelector('.carousel');
    const carouselContainer = document.querySelector('.carousel-container');
    const arrowLeft = document.querySelector('.arrow-left');
    const arrowRight = document.querySelector('.arrow-right');
    const items = carousel.querySelectorAll('.portfolio-item');

    let currentIndex = 0;
    let isDragging = false;
    let startX = 0;
    let scrollLeft = 0;
    let currentTranslate = 0;
    let prevTranslate = 0;
    let animationID = 0;
    let isHorizontalScroll = false;
    
    const ITEM_WIDTH = 400;
    const DESKTOP_GAP = 30;

    function getItemsPerView() {
        return window.innerWidth <= 700 ? 1 : 2;
    }

    function getItemWidth() {
        return window.innerWidth <= 700 ? ITEM_WIDTH : ITEM_WIDTH + DESKTOP_GAP;
    }

    function getMaxIndex() {
        const itemsPerView = getItemsPerView();
        return Math.max(0, items.length - itemsPerView);
    }

    function setPositionByIndex(animate = true) {
        if (!animate) carousel.style.transition = 'none';
        else carousel.style.transition = 'transform 0.3s ease-out';

        const itemWidth = getItemWidth();
        currentTranslate = -(currentIndex * itemWidth);
        prevTranslate = currentTranslate;
        setSliderPosition();

        if (!animate) {
            setTimeout(() => carousel.style.transition = 'transform 0.3s ease-out', 10);
        }

        updateArrowVisibility();
    }

    function updateArrowVisibility() {
        const maxIndex = getMaxIndex();
        arrowLeft.style.opacity = currentIndex === 0 ? '0.5' : '1';
        arrowLeft.style.pointerEvents = currentIndex === 0 ? 'none' : 'auto';
        
        arrowRight.style.opacity = currentIndex === maxIndex ? '0.5' : '1';
        arrowRight.style.pointerEvents = currentIndex === maxIndex ? 'none' : 'auto';
    }

    function setSliderPosition() {
        carousel.style.transform = `translateX(${currentTranslate}px)`;
    }

    // Wheel event handler for trackpad
    function handleWheel(e) {
        // Check if it's primarily a horizontal scroll
        const isHorizontal = Math.abs(e.deltaX) > Math.abs(e.deltaY);
        
        if (isHorizontal) {
            e.preventDefault();
            
            const delta = e.deltaX;
            if (Math.abs(delta) < 5) return; // Ignore tiny movements

            scrollLeft += delta;
            const threshold = getItemWidth() / 3;

            if (Math.abs(scrollLeft) > threshold) {
                if (scrollLeft > 0 && currentIndex < getMaxIndex()) {
                    currentIndex++;
                    scrollLeft = 0;
                } else if (scrollLeft < 0 && currentIndex > 0) {
                    currentIndex--;
                    scrollLeft = 0;
                }
                setPositionByIndex();
            }
        }
        // If it's vertical scroll, let it pass through naturally
    }

    function handleStart(e) {
        isDragging = true;
        startX = e.type.includes('mouse') ? e.pageX : e.touches[0].clientX;
        prevTranslate = currentTranslate;
        
        cancelAnimationFrame(animationID);
        carousel.style.cursor = 'grabbing';
        carousel.style.transition = 'none';
    }

    function handleMove(e) {
        if (!isDragging) return;

        const currentX = e.type.includes('mouse') ? e.pageX : e.touches[0].clientX;
        const diff = currentX - startX;

        // Only prevent default if there's significant horizontal movement
        if (Math.abs(diff) > 5) {
            e.preventDefault();
            isHorizontalScroll = true;
        }

        currentTranslate = prevTranslate + diff;

        // Add resistance at edges
        const maxIndex = getMaxIndex();
        const itemWidth = getItemWidth();
        const minTranslate = -maxIndex * itemWidth;
        
        if (currentTranslate > 0) {
            currentTranslate = currentTranslate * 0.3;
        } else if (currentTranslate < minTranslate) {
            const overScroll = currentTranslate - minTranslate;
            currentTranslate = minTranslate + (overScroll * 0.3);
        }

        setSliderPosition();
    }

    function handleEnd() {
        if (!isDragging) return;
        
        isDragging = false;
        isHorizontalScroll = false;
        const itemWidth = getItemWidth();
        const movedBy = currentTranslate - prevTranslate;
        
        // Determine direction and movement threshold
        const threshold = itemWidth / 3;
        if (Math.abs(movedBy) > threshold) {
            if (movedBy < 0 && currentIndex < getMaxIndex()) {
                currentIndex++;
            } else if (movedBy > 0 && currentIndex > 0) {
                currentIndex--;
            }
        }

        carousel.style.cursor = 'grab';
        setPositionByIndex();
    }

    // Event Listeners
    arrowLeft.addEventListener('click', () => {
        if (currentIndex > 0) {
            currentIndex--;
            setPositionByIndex();
        }
    });

    arrowRight.addEventListener('click', () => {
        if (currentIndex < getMaxIndex()) {
            currentIndex++;
            setPositionByIndex();
        }
    });

    // Wheel/trackpad events
    carousel.addEventListener('wheel', handleWheel, { passive: false });

    // Touch events
    carousel.addEventListener('touchstart', handleStart, { passive: true });
    carousel.addEventListener('touchmove', handleMove, { passive: false });
    carousel.addEventListener('touchend', handleEnd);

    // Mouse events
    carousel.addEventListener('mousedown', handleStart);
    window.addEventListener('mousemove', handleMove);
    window.addEventListener('mouseup', handleEnd);
    window.addEventListener('mouseleave', handleEnd);

    // Prevent context menu
    carousel.addEventListener('contextmenu', e => e.preventDefault());

    // Handle resize
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            currentIndex = Math.min(currentIndex, getMaxIndex());
            setPositionByIndex(false);
        }, 250);
    });

    // `Initialize
    setPositionByIndex(false);
});

const target = document.querySelector('.portfolio-row')

/** 
fetch gets data from URL. and this will always be asynchronous 
**/
fetch('information.json')

    /** this then is chained to the fetch before with the . and what it does is
    catches asynchronous data (object) from the thing it's chained to (fetch)
    .json is to turn the json format recieved from the fetch (amongst the collection of data in the in fetch) into 
    a JS object that we can use synchronously and the fat arrow
    is another way of 'returning' so we can use this object in another then if necessary
    **/
    .then((response) => response.json())

    /*
    this then, is chained to the one before with the . and outlines a parameter 
    called data which stores the value object returned from t eh previous then
    */
    .then(data => {// data represents the object got from the first then
        console.log(data)
        data.projects.forEach((portfolioItem) => {

            let list = document.createElement('div');
            list.innerHTML = `
                <div class="portfolio-item">
                        <img src="img/example2.jpg" alt="amazing-project" width="100%">
                        <div class="profile-blurb">
                            <h3>${portfolioItem.title}</h2>
                            <p>
                                It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English.
                            </p>

                            <div class="techs">
                                <span>CSS</span>
                                <span>HTML</span>
                                <span>JavaScript</span>
                                <span>VS Code</span>
                            </div>
                        </div>

                        <div class="links">
                            <a href="#">Live Project</a>
                            <a href="#">Git Repo</a>
                        </div> 
                    </div>
            `;
            target.appendChild(list)
        });

    });