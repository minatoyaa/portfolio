'use strict';



// element toggle function
const elementToggleFunc = function (elem) { elem.classList.toggle("active"); }



// sidebar variables
const sidebar = document.querySelector("[data-sidebar]");
const sidebarBtn = document.querySelector("[data-sidebar-btn]");

// sidebar toggle functionality for mobile
sidebarBtn.addEventListener("click", function () { elementToggleFunc(sidebar); });



// email modal variables
const emailItem = document.querySelector("[data-email-item]");
const emailModalContainer = document.querySelector("[data-email-modal-container]");
const emailOverlay = document.querySelector("[data-email-overlay]");
const emailModalCloseBtn = document.querySelector("[data-email-modal-close-btn]");

// toggle function for email modal
const emailModalFunc = function () {
  emailModalContainer.classList.toggle("active");
  emailOverlay.classList.toggle("active");
};

// open modal when clicking the email item
if (emailItem) {
  emailItem.addEventListener("click", function () {
    emailModalFunc();
  });
}

// close modal when clicking close btn or overlay
emailModalCloseBtn.addEventListener("click", emailModalFunc);
emailOverlay.addEventListener("click", emailModalFunc);


// icons swaps
const icons = document.querySelectorAll("#tech-icons i");
let current = 0;

// Show the first icon initially
icons[current].classList.add("active");

setInterval(() => {
  // Hide current icon
  icons[current].classList.remove("active");
  
  // Move to next (loop back at end)
  current = (current + 1) % icons.length;
  
  // Show new icon
  icons[current].classList.add("active");
}, 1000); // 1seconds






// testimonials variables
const testimonialsItem = document.querySelectorAll("[data-testimonials-item]");
const modalContainer = document.querySelector("[data-modal-container]");
const modalCloseBtn = document.querySelector("[data-modal-close-btn]");
const overlay = document.querySelector("[data-overlay]");

// modal variable
const modalImg = document.querySelector("[data-modal-img]");
const modalTitle = document.querySelector("[data-modal-title]");
const modalText = document.querySelector("[data-modal-text]");

// modal toggle function
const testimonialsModalFunc = function () {
  modalContainer.classList.toggle("active");
  overlay.classList.toggle("active");
}

// add click event to all modal items
for (let i = 0; i < testimonialsItem.length; i++) {

  testimonialsItem[i].addEventListener("click", function () {

    modalImg.src = this.querySelector("[data-testimonials-avatar]").src;
    modalImg.alt = this.querySelector("[data-testimonials-avatar]").alt;
    modalTitle.innerHTML = this.querySelector("[data-testimonials-title]").innerHTML;
    modalText.innerHTML = this.querySelector("[data-testimonials-text]").innerHTML;

    testimonialsModalFunc();

  });

}

// add click event to modal close button
modalCloseBtn.addEventListener("click", testimonialsModalFunc);
overlay.addEventListener("click", testimonialsModalFunc);



// custom select variables
const select = document.querySelector("[data-select]");
const selectItems = document.querySelectorAll("[data-select-item]");
const selectValue = document.querySelector("[data-selecct-value]");
const filterBtn = document.querySelectorAll("[data-filter-btn]");

select.addEventListener("click", function () { elementToggleFunc(this); });

// add event in all select items
for (let i = 0; i < selectItems.length; i++) {
  selectItems[i].addEventListener("click", function () {

    let selectedValue = this.innerText.toLowerCase();
    selectValue.innerText = this.innerText;
    elementToggleFunc(select);
    filterFunc(selectedValue);

  });
}

// filter variables
const filterItems = document.querySelectorAll("[data-filter-item]");

const filterFunc = function (selectedValue) {

  for (let i = 0; i < filterItems.length; i++) {

    if (selectedValue === "all") {
      filterItems[i].classList.add("active");
    } else if (selectedValue === filterItems[i].dataset.category) {
      filterItems[i].classList.add("active");
    } else {
      filterItems[i].classList.remove("active");
    }

  }

}

// add event in all filter button items for large screen
let lastClickedBtn = filterBtn[0];

for (let i = 0; i < filterBtn.length; i++) {

  filterBtn[i].addEventListener("click", function () {

    let selectedValue = this.innerText.toLowerCase();
    selectValue.innerText = this.innerText;
    filterFunc(selectedValue);

    lastClickedBtn.classList.remove("active");
    this.classList.add("active");
    lastClickedBtn = this;

  });

}



// contact form variables
const form = document.querySelector("[data-form]");
const formInputs = document.querySelectorAll("[data-form-input]");
const formBtn = document.querySelector("[data-form-btn]");

// add event to all form input field
for (let i = 0; i < formInputs.length; i++) {
  formInputs[i].addEventListener("input", function () {

    // check form validation
    if (form.checkValidity()) {
      formBtn.removeAttribute("disabled");
    } else {
      formBtn.setAttribute("disabled", "");
    }

  });
}



// page navigation variables
const navigationLinks = document.querySelectorAll("[data-nav-link]");
const pages = document.querySelectorAll("[data-page]");

// Function to activate a page by name
function activatePage(pageName) {
  for (let i = 0; i < pages.length; i++) {
    if (pageName === pages[i].dataset.page) {
      pages[i].classList.add("active");
      navigationLinks[i].classList.add("active");
      window.scrollTo(0, 0);
    } else {
      pages[i].classList.remove("active");
      navigationLinks[i].classList.remove("active");
    }
  }
}

// Load last visited page from localStorage
const lastPage = localStorage.getItem("lastPage");
if (lastPage) {
  activatePage(lastPage);
} else {
  // if no saved page, default to "about" (or the first page)
  activatePage("about");
}

// Add event to all nav links
for (let i = 0; i < navigationLinks.length; i++) {
  navigationLinks[i].addEventListener("click", function () {
    let pageName = this.innerHTML.toLowerCase();

    // Save to localStorage
    localStorage.setItem("lastPage", pageName);

    // Activate the clicked page
    activatePage(pageName);
  });
}


function sendMail(){
  let parms = {
    fullname : document.getElementById("fullname").value,
    email : document.getElementById("email").value,
    subject: "Portfolio Message",  // fixed subject
    message : document.getElementById("message").value
  }
  emailjs.send("service_kwijoysa" , "template_c4272cs", parms)
  .then(() => {
      alert("Message Sent Successfully!");
      document.getElementById("contact-form").reset();
    }, (error) => {
      alert("Failed to send message: " + error.text);
    });
}





