
const propertyList = document.querySelector('.property-list');

const sampleProperties = [
    {
        name: '래미안 원베일리',
        location: '서울시 서초구 반포동',
        price: '30억',
        type: '아파트',
        dealType: '매매',
        image: 'images/apartment-1.jpg',
    },
    {
        name: '아크로 리버파크',
        location: '서울시 서초구 반포동',
        price: '32억',
        type: '아파트',
        dealType: '매매',
        image: 'images/apartment-2.jpg',
    },
    {
        name: '트리마제',
        location: '서울시 성동구 성수동',
        price: '25억',
        type: '아파트',
        dealType: '매매',
        image: 'images/apartment-3.jpg',
    },
    {
        name: '갤러리아 포레',
        location: '서울시 성동구 성수동',
        price: '28억',
        type: '아파트',
        dealType: '매매',
        image: 'images/apartment-2.jpg',
    },
];

function renderProperties(properties) {
    if (!propertyList) return;
    propertyList.innerHTML = '';
    for (const property of properties) {
        const card = document.createElement('div');
        card.classList.add('property-card');

        const image = document.createElement('img');
        image.src = property.image;
        image.alt = `${property.name} 부동산 이미지`;
        card.appendChild(image);

        const info = document.createElement('div');
        info.classList.add('property-card-info');
        card.appendChild(info);

        const name = document.createElement('h3');
        name.textContent = property.name;
        info.appendChild(name);

        const location = document.createElement('p');
        location.textContent = property.location;
        info.appendChild(location);

        const price = document.createElement('p');
        price.textContent = `${property.dealType} ${property.price}`;
        info.appendChild(price);

        propertyList.appendChild(card);
    }
}

function initAgeGate() {
    const overlay = document.querySelector('.age-gate');
    if (!overlay) return;
    const redirectTo = overlay.getAttribute('data-redirect');
    const storageKey = overlay.getAttribute('data-storage-key') || 'ageGateConfirmed';
    const hasConfirmed = window.localStorage.getItem(storageKey) === 'true';
    if (hasConfirmed && redirectTo) {
        window.location.href = redirectTo;
        return;
    }

    overlay.classList.add('is-active');
    document.body.classList.add('gate-active');

    const confirmButton = overlay.querySelector('[data-age-confirm]');
    const exitLink = overlay.querySelector('[data-age-exit]');
    if (confirmButton) {
        confirmButton.focus();
        confirmButton.addEventListener('click', () => {
            window.localStorage.setItem(storageKey, 'true');
            if (redirectTo) {
                window.location.href = redirectTo;
                return;
            }
            overlay.classList.remove('is-active');
            document.body.classList.remove('gate-active');
        });
    }
    if (exitLink) {
        exitLink.addEventListener('click', () => {
            overlay.classList.remove('is-active');
            document.body.classList.remove('gate-active');
        });
    }
}

function initReveal() {
    const elements = document.querySelectorAll('[data-reveal]');
    if (!('IntersectionObserver' in window) || elements.length === 0) {
        elements.forEach((el) => el.classList.add('is-visible'));
        return;
    }
    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.18 }
    );
    elements.forEach((el) => observer.observe(el));
}

renderProperties(sampleProperties);
initAgeGate();
initReveal();
