let lockBodyLastPosition = null;

export function scrollbarWidth() {
    if (typeof document === 'undefined') {
        return 0;
    }

    const div = document.createElement('div');

    div.style.position = 'fixed';
    div.style.left = 0;
    div.style.visibility = 'hidden';
    div.style.overflowY = 'scroll';

    document.body.appendChild(div);
    const width = div.getBoundingClientRect().right;
    document.body.removeChild(div);

    return width;
}

export function lockBody(isFixed, timeout = 0) {
    lockBodyLastPosition = window?.scrollY;
    const lock = () => {
        document.documentElement.style.height = 'auto';
        document.documentElement.style.overflow = 'hidden';
        document.body.style.height = '100%';
        document.body.style.overflow = 'hidden';
        if (isFixed) {
            document.body.style.position = 'fixed';
        }
        document.body.style.paddingRight = `${scrollbarWidth()}px`;
    };

    if (timeout) {
        setTimeout(lock, timeout);
    } else {
        lock();
    }
}

export function unlockBody(timeout = 0) {
    const unlock = () => {
        document.documentElement.style.height = '';
        document.documentElement.style.overflow = '';
        document.body.style.height = '';
        document.body.style.overflow = '';
        document.body.style.paddingRight = '';
        document.body.style.position = '';

        if (lockBodyLastPosition && window) {
            window.scrollTo(0, lockBodyLastPosition);
        }
    };

    if (timeout) {
        setTimeout(unlock, timeout);
    } else {
        unlock();
    }
}
