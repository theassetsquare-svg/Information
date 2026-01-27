
const propertyList = document.querySelector('.property-list');

const sampleProperties = [
    {
        name: '래미안 원베일리',
        location: '서울시 서초구 반포동',
        price: '30억',
        type: '아파트',
        dealType: '매매',
        image: 'https://via.placeholder.com/280x200',
    },
    {
        name: '아크로 리버파크',
        location: '서울시 서초구 반포동',
        price: '32억',
        type: '아파트',
        dealType: '매매',
        image: 'https://via.placeholder.com/280x200',
    },
    {
        name: '트리마제',
        location: '서울시 성동구 성수동',
        price: '25억',
        type: '아파트',
        dealType: '매매',
        image: 'https://via.placeholder.com/280x200',
    },
    {
        name: '갤러리아 포레',
        location: '서울시 성동구 성수동',
        price: '28억',
        type: '아파트',
        dealType: '매매',
        image: 'https://via.placeholder.com/280x200',
    },
];

function renderProperties(properties) {
    propertyList.innerHTML = '';
    for (const property of properties) {
        const card = document.createElement('div');
        card.classList.add('property-card');

        const image = document.createElement('img');
        image.src = property.image;
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

renderProperties(sampleProperties);
