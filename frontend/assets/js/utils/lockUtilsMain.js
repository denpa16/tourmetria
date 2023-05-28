export function getScrollbarWidth() {
    // Creating invisible container
    const outer = document.createElement('div');
    outer.style.visibility = 'hidden';
    // forcing scrollbar to appear
    outer.style.overflow = 'scroll';
    // needed for WinJS apps
    outer.style.msOverflowStyle = 'scrollbar';
    document.body.appendChild(outer);
    
    // Creating inner element and placing it in the container
    const inner = document.createElement('div');
    outer.appendChild(inner);
    
    // Calculating difference between container's full width and the child width
    const scrollbarWidth = outer.offsetWidth - inner.offsetWidth;
    
    // Removing temporary elements from the DOM
    outer.parentNode.removeChild(outer);
    
    return scrollbarWidth;
}
    
export function lockBody() {
    const scrollWidth = getScrollbarWidth();
    document.body.setAttribute('style', 'padding-right: ' + scrollWidth + 'px;');
    document.body.dataset.scrollY = `${getBodyScrollTop()}`;
    window.offsetScroll = getBodyScrollTop();
    document.body.style.top = `-${document.body.dataset.scrollY}px`;
    document.body.classList.add('scroll-lock');
}
    
export function unlockBody() {
    document.body.style.paddingRight = '';
    document.body.style.top = '';
    document.body.classList.remove('scroll-lock');
    
    if (document.body.dataset.scrollY !== '') {
    window.scroll({top: document.body.dataset.scrollY, behavior: 'instant'});
    document.body.dataset.scrollY = '';
    }
}

export function getBodyScrollTop() {
    return window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
}

export function isLockBody() {
    return Boolean(document.body.dataset.scrollY);
}

