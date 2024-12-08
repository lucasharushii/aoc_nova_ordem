// List itens active
const searchItems = document.querySelectorAll('.main-search-item');
searchItems.forEach((item) => {
    item.addEventListener('click', () => {
        searchItems.forEach((el) => el.classList.remove('active'));
        item.classList.add('active');
    });
});

// Form Tabs
const tabBoxes = document.querySelectorAll('.main-tab-box');

tabBoxes.forEach((box) => {
    box.addEventListener('click', () => {
        const isActive = box.classList.contains('active');

        tabBoxes.forEach((item) => item.classList.remove('active'));
        document.querySelectorAll('fieldset').forEach((fieldset) => {
            fieldset.classList.remove('active');
        });

        if (!isActive) {
            box.classList.add('active');
            const fieldset = box.querySelector('fieldset');
            if (fieldset) {
                fieldset.classList.add('active');
            }
        }
    });
});
