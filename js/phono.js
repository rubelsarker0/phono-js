// initial values
const searchBtn = document.querySelector('#search-btn');
const phoneContainer = document.querySelector('#phone-container');
const phoneDetailContainer = document.querySelector('#phone-detail-container');
const errorMessage = document.querySelector('#error-message');
const searchField = document.querySelector('#search-input');
const spinner = document.getElementById('spinner');
const showMoreBtn = document.getElementById('show-more-btn');
const resultFound = document.getElementById('result-found');

let allPhones = [];

// show and hide spinner functions
const showSpinner = () => {
	spinner.classList.remove('d-none');
};

const hideSpinner = () => {
	spinner.classList.add('d-none');
};

// displaying all the phone searching by user functionss
const loadUserPhones = async () => {
	try {
		const userSearchText = searchField.value.toLocaleLowerCase();
		if (userSearchText === '' || !isNaN(userSearchText)) {
			phoneContainer.textContent = '';
			errorMessage.textContent = `Please provide your phone name`;
			errorMessage.classList.remove('d-none');
			showMoreBtn.classList.add('d-none');
			resultFound.classList.add('d-none');
		} else {
			showSpinner();
			errorMessage.classList.add('d-none');
			const phoneUrl = `https://openapi.programming-hero.com/api/phones?search=${userSearchText}`;
			const response = await fetch(phoneUrl);
			const data = await response.json();
			displayUserPhone(data.data);
			allPhones = data.data;
			searchField.value = '';
			if (data.data.length !== 0) {
				showMoreBtn.classList.remove('d-none');
				resultFound.classList.remove('d-none');
			} else {
				resultFound.classList.add('d-none');
			}
			hideSpinner();
			resultFound.textContent = `Result Found: ${data.data.length}`;
		}
	} catch (error) {
		console.log(error);
	}
};

const displayUserPhone = (phoneData) => {
	if (phoneData.length === 0) {
		phoneContainer.textContent = '';
		errorMessage.textContent = `Result not found!! try again..`;
		errorMessage.classList.remove('d-none');
		showMoreBtn.classList.add('d-none');
		resultFound.classList.add('d-none');
	} else {
		phoneContainer.textContent = '';
		phoneDetailContainer.textContent = '';
		errorMessage.classList.add('d-none');
		phoneData.slice(0, 20).forEach((phone) => {
			generatePhoneHTML(phone);
		});
	}
};

const generatePhoneHTML = ({ brand, image, phone_name, slug }) => {
	const div = document.createElement('div');
	div.classList.add('col');
	div.innerHTML = `
            <div class="card border-success border-bottom border-3 border-0 rounded">
            <div class="d-flex justify-content-center">
                <img src="${image}" class="card-img-top w-50 p-3" alt="phone image" />
            </div>
            <div class="card-body">
                <h5 class="card-title text-success">${phone_name}</h5>
                <ul class="list-group list-group-flush">
                    <li class="list-group-item"></li>
                    <li class="list-group-item">Brand: ${brand}</li>
                    <li class="list-group-item">Slug: ${slug}</li>
                    <li class="list-group-item"></li>
                </ul>
                <div class="d-flex align-items-center justify-content-center">
                    <a onclick="loadPhoneDetail('${slug}')" class="btn btn-success text-uppercase px-4">Details</a>
                </div>
            </div>
        </div>`;
	phoneContainer.appendChild(div);
};

// calling phone details api end point function
const loadPhoneDetail = async (id) => {
	try {
		showSpinner();
		const phoneDetailUrl = `https://openapi.programming-hero.com/api/phone/${id}`;
		const response = await fetch(phoneDetailUrl);
		const data = await response.json();
		displayPhoneDetails(data.data);
		hideSpinner();
		document.documentElement.scrollTop = 0;
		document.body.scrollTop = 0;
	} catch (error) {
		console.log(error);
	}
};

// Displaying phone details in the UI
const displayPhoneDetails = (phoneInfo) => {
	const { brand, image, name, releaseDate } = phoneInfo;
	const { displaySize, storage, sensors } = phoneInfo.mainFeatures;
	const { Bluetooth, NFC } = phoneInfo.others || {};

	phoneDetailContainer.textContent = '';
	const div = document.createElement('div');
	div.classList.add('col');
	div.innerHTML = `
    <div class="card border-success border-end border-3 border-0 rounded">
    <div class="row g-0">
        <div class="col-md-4 d-flex justify-content-center">
            <img src="${image}" alt="..." class="card-img img-fluid p-3">
        </div>
        <div class="col-md-8">
            <div class="card-body">
                <h5 class="card-title text-success fs-4">${name}e</h5>
                <p class="card-text"><small class="text-muted">Release Date: ${
									releaseDate ? releaseDate : 'no release date found!'
								}</small>
                <ul class="list-group list-group-flush">
                    <li class="list-group-item"></li>
                    <li class="list-group-item">Brand: ${brand}</li>
                    <li class="list-group-item">Display: ${displaySize}</li>
                    <li class="list-group-item">Storage: ${storage}</li>
                    <li class="list-group-item">Bluetooth: ${
											Bluetooth ? Bluetooth : 'not found!'
										}</li>
                    <li class="list-group-item">NFC: ${
											NFC ? NFC : 'not found!'
										}</li>
                    <li class="list-group-item">Sensors: ${sensors}</li>
                    <li class="list-group-item"></li>
                </ul>
            </div>
        </div>
    </div>
</div>
    `;
	phoneDetailContainer.appendChild(div);
};

searchBtn.addEventListener('click', loadUserPhones);
searchField.addEventListener('keyup', (event) => {
	if (event.key === 'Enter') {
		loadUserPhones();
	}
});

// show more btn functionalities
showMoreBtn.addEventListener('click', () => {
	allPhones.slice(20).forEach((phone) => {
		generatePhoneHTML(phone);
	});
});
