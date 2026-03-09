console.log("Form JS loaded");

document.addEventListener('DOMContentLoaded', () => {
    console.log("DOM fully loaded");
    const form = document.querySelector('.new-form');
    if (!form) {
        console.log("No form found!");
        return;
    }
    console.log("Form found:", form);

    // Select each input safely
    const title = document.querySelector('#title');
    const img = document.querySelector('#img');
    const price = document.querySelector('#price');
    const location = document.querySelector('#location');
    const country = document.querySelector('#country');

    const titleErr = document.querySelector('.title-err');
    const imgErr = document.querySelector('.img-err');
    const priceErr = document.querySelector('.price-err');
    const locErr = document.querySelector('.loc-err');
    const counErr = document.querySelector('.coun-err');

    form.addEventListener('submit', (event) => {
        let isValid = true;

        // TITLE validation
        if (title && titleErr) {
            if (title.value.trim() === '') {
                event.preventDefault();
                titleErr.classList.remove('no-display');
                isValid = false;
            } else {
                titleErr.classList.add('no-display');
            }
        }

        // IMAGE validation
        if (img && imgErr) {
            if (img.value.trim() === '') {
                event.preventDefault();
                imgErr.classList.remove('no-display');
                isValid = false;
            } else {
                imgErr.classList.add('no-display');
            }
        }

        // PRICE validation
        if (price && priceErr) {
            if (price.value.trim() === '' || Number(price.value) <= 0) {
                event.preventDefault();
                priceErr.classList.remove('no-display');
                isValid = false;
            } else {
                priceErr.classList.add('no-display');
            }
        }

        // LOCATION validation
        if (location && locErr) {
            if (location.value.trim() === '') {
                event.preventDefault();
                locErr.classList.remove('no-display');
                isValid = false;
            } else {
                locErr.classList.add('no-display');
            }
        }

        // COUNTRY validation
        if (country && counErr) {
            if (country.value.trim() === '') {
                event.preventDefault();
                counErr.classList.remove('no-display');
                isValid = false;
            } else {
                counErr.classList.add('no-display');
            }
        }

        if (!isValid) {
            event.stopPropagation();
        }
    });
});