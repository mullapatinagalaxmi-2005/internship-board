// ==========================================
// API CONFIGURATION
// ==========================================

const API_URL = "https://internship-board-kgql.onrender.com/api/internships";


// ==========================================
// DOM ELEMENTS
// ==========================================

const searchInput = document.getElementById("searchInput");
const domainFilter = document.getElementById("domainFilter");
const clearBtn = document.getElementById("clearBtn");

const internshipList = document.getElementById("internshipList");
const resultCount = document.getElementById("resultCount");

const emptyMessage = document.getElementById("emptyMessage");
const errorMessage = document.getElementById("errorMessage");


// ==========================================
// STATE
// ==========================================

let currentPage = 1;
const itemsPerPage = 6;

let totalPages = 1;
let totalResults = 0;


// ==========================================
// CREATE INTERNSHIP CARD
// ==========================================

function createInternshipCard(internship) {

    const article = document.createElement("article");

    article.className = "internship-card";

    article.innerHTML = `
        <h3>${escapeHTML(internship.title)}</h3>

        <p class="company">
            ${escapeHTML(internship.company)}
        </p>

        <span class="domain">
            ${escapeHTML(internship.domain)}
        </span>

        <ul class="details">
            <li>
                <strong>Location:</strong>
                ${escapeHTML(internship.location)}
            </li>

            <li>
                <strong>Type:</strong>
                ${escapeHTML(internship.type)}
            </li>

            <li>
                <strong>Duration:</strong>
                ${escapeHTML(internship.duration)}
            </li>

            <li>
                <strong>Stipend:</strong>
                ${escapeHTML(internship.stipend)}
            </li>
        </ul>

        <button
            class="apply-button"
            type="button"
        >
            View Internship
        </button>
    `;

    const button = article.querySelector(".apply-button");

    button.addEventListener("click", function () {

        alert(
            `You selected: ${internship.title}\n\n` +
            `Company: ${internship.company}\n` +
            `Location: ${internship.location}\n` +
            `Type: ${internship.type}`
        );

    });

    return article;
}


// ==========================================
// HTML SAFETY
// ==========================================

function escapeHTML(value) {

    if (value === null || value === undefined) {
        return "";
    }

    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}


// ==========================================
// LOADING STATE
// ==========================================

function showLoading() {

    internshipList.innerHTML = "";

    resultCount.textContent = "Loading internships...";

    emptyMessage.hidden = true;

    errorMessage.hidden = true;
}


// ==========================================
// DISPLAY INTERNSHIPS
// ==========================================

function renderInternships(list) {

    internshipList.innerHTML = "";

    resultCount.textContent =
        `${totalResults} internship${totalResults === 1 ? "" : "s"} found`;

    // Empty state
    if (!list || list.length === 0) {

        emptyMessage.hidden = false;

        return;
    }

    emptyMessage.hidden = true;

    const fragment =
        document.createDocumentFragment();

    list.forEach(function (internship) {

        const card =
            createInternshipCard(internship);

        fragment.appendChild(card);

    });

    internshipList.appendChild(fragment);
}


// ==========================================
// LOAD INTERNSHIPS FROM API
// ==========================================

async function loadInternships(page = 1) {

    showLoading();

    try {

        const searchTerm =
            searchInput.value.trim();

        const selectedDomain =
            domainFilter.value;

        const params =
            new URLSearchParams();

        params.append("page", page);
        params.append("limit", itemsPerPage);

        if (searchTerm) {
            params.append("search", searchTerm);
        }

        if (selectedDomain && selectedDomain !== "all") {
            params.append("domain", selectedDomain);
        }


        const response =
            await fetch(`${API_URL}?${params.toString()}`);


        if (!response.ok) {

            throw new Error(
                `Server returned ${response.status}`
            );
        }


        const result =
            await response.json();


        if (!result.success) {

            throw new Error(
                result.message || "Unable to load internships"
            );
        }


        // Update pagination state

        currentPage =
            result.pagination.page;

        totalPages =
            result.pagination.totalPages;

        totalResults =
            result.pagination.total;


        renderInternships(result.data);

        errorMessage.hidden = true;


        updatePagination();


    } catch (error) {

        console.error(
            "API Error:",
            error
        );


        internshipList.innerHTML = "";

        resultCount.textContent =
            "Unable to load internships";

        emptyMessage.hidden = true;

        errorMessage.textContent =
            "Unable to connect to the internship server. Please try again later.";

        errorMessage.hidden = false;

    }
}


// ==========================================
// PAGINATION
// ==========================================

function updatePagination() {

    let paginationContainer =
        document.getElementById("pagination");


    if (!paginationContainer) {

        paginationContainer =
            document.createElement("div");

        paginationContainer.id =
            "pagination";

        paginationContainer.setAttribute(
            "aria-label",
            "Internship pagination"
        );

        internshipList.parentNode.appendChild(
            paginationContainer
        );
    }


    paginationContainer.innerHTML = "";


    if (totalPages <= 1) {
        return;
    }


    // Previous button

    const previousButton =
        document.createElement("button");

    previousButton.type = "button";

    previousButton.textContent =
        "Previous";

    previousButton.disabled =
        currentPage === 1;

    previousButton.addEventListener(
        "click",
        function () {

            if (currentPage > 1) {

                loadInternships(
                    currentPage - 1
                );

            }

        }
    );


    // Page information

    const pageInfo =
        document.createElement("span");

    pageInfo.textContent =
        ` Page ${currentPage} of ${totalPages} `;

    pageInfo.setAttribute(
        "aria-live",
        "polite"
    );


    // Next button

    const nextButton =
        document.createElement("button");

    nextButton.type = "button";

    nextButton.textContent =
        "Next";

    nextButton.disabled =
        currentPage === totalPages;

    nextButton.addEventListener(
        "click",
        function () {

            if (currentPage < totalPages) {

                loadInternships(
                    currentPage + 1
                );

            }

        }
    );


    paginationContainer.appendChild(
        previousButton
    );

    paginationContainer.appendChild(
        pageInfo
    );

    paginationContainer.appendChild(
        nextButton
    );
}


// ==========================================
// FILTER INTERNSHIPS
// ==========================================

function filterInternships() {

    currentPage = 1;

    loadInternships(1);
}


// ==========================================
// CLEAR FILTERS
// ==========================================

function clearFilters() {

    searchInput.value = "";

    domainFilter.value = "all";

    currentPage = 1;

    loadInternships(1);

    searchInput.focus();
}


// ==========================================
// EVENT LISTENERS
// ==========================================

searchInput.addEventListener(
    "input",
    filterInternships
);


domainFilter.addEventListener(
    "change",
    filterInternships
);


clearBtn.addEventListener(
    "click",
    clearFilters
);


// ==========================================
// INITIAL LOAD
// ==========================================

loadInternships(1);
