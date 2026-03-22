const dropDownMenuLabel = document.getElementById("dropdown-menu-label");
const dropDownMenuCheckBox = document.getElementById("dropdown-menu-checkbox");

export const windowResize = {
    init() {
        let resizeTimer;
        window.addEventListener('resize', () => {
            document.body.classList.add('no-transition');
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => {
                document.body.classList.remove('no-transition');
            }, 200);

            if (getComputedStyle(dropDownMenuLabel).display === 'none') {
                dropDownMenuCheckBox.checked = false;
            }
        });
    }
};

export const renderProjects = {
    init() {
        console.log("RENDER PROJECTS");
    }
}