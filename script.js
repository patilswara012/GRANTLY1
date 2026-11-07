// GRANTLY - Frontend demo application

const scholarships = [
    {
        id: 1,
        name: "National Merit Scholarship",
        amount: 50000,
        category: "Government",
        level: "Undergraduate",
        description: "A sample merit-based opportunity for students pursuing higher education.",
        deadline: "2027-03-31",
        marks: 75,
        income: 800000,
        icon: "🏆",
        link: "https://scholarships.gov.in"
    },
    {
        id: 2,
        name: "Post Matric Scholarship",
        amount: 30000,
        category: "Government",
        level: "Undergraduate",
        description: "A sample scholarship record for eligible students continuing their education.",
        deadline: "2027-02-28",
        marks: 50,
        income: 250000,
        icon: "🎓",
        link: "https://scholarships.gov.in"
    },
    {
        id: 3,
        name: "Women in Technology Scholarship",
        amount: 60000,
        category: "Private",
        level: "Undergraduate",
        description: "A sample opportunity designed to encourage women pursuing technology education.",
        deadline: "2027-04-15",
        marks: 70,
        income: 600000,
        icon: "💻",
        link: "https://www.buddy4study.com"
    },
    {
        id: 4,
        name: "Excellence in Education Award",
        amount: 75000,
        category: "Merit",
        level: "Undergraduate",
        description: "A sample award for students demonstrating strong academic performance.",
        deadline: "2027-05-20",
        marks: 85,
        income: 1000000,
        icon: "⭐",
        link: "https://www.buddy4study.com"
    },
    {
        id: 5,
        name: "Education Support Grant",
        amount: 40000,
        category: "Need-based",
        level: "Undergraduate",
        description: "A sample financial support opportunity based on family income.",
        deadline: "2027-01-30",
        marks: 50,
        income: 300000,
        icon: "🌱",
        link: "https://scholarships.gov.in"
    },
    {
        id: 6,
        name: "Future Leaders Scholarship",
        amount: 100000,
        category: "Private",
        level: "Postgraduate",
        description: "A sample scholarship record for students planning postgraduate studies.",
        deadline: "2027-06-30",
        marks: 80,
        income: 900000,
        icon: "🚀",
        link: "https://www.buddy4study.com"
    }
];

function readStoredJSON(key, fallback) {
    try {
        const raw = localStorage.getItem(key);
        return raw ? JSON.parse(raw) : fallback;
    } catch (error) {
        console.warn(`GRANTLY could not read stored data for ${key}.`, error);
        return fallback;
    }
}

let saved = readStoredJSON("grantlySaved", []);
let applications = readStoredJSON("grantlyApplications", []);
let documents = readStoredJSON("grantlyDocuments", {});
let userName = localStorage.getItem("grantlyName") || "";

const documentNames = [
    "Aadhaar Card",
    "Previous Year Marksheet",
    "Income Certificate",
    "Caste Certificate (if applicable)",
    "Bank Account Details"
];

function safeStore(key, value) {
    try {
        localStorage.setItem(key, JSON.stringify(value));
        return true;
    } catch (error) {
        console.error(`GRANTLY could not save ${key}.`, error);
        showToast("Browser storage is unavailable. Your latest change may not be saved.");
        return false;
    }
}

function saveData() {
    safeStore("grantlySaved", saved);
    safeStore("grantlyApplications", applications);
    safeStore("grantlyDocuments", documents);
}

function showToast(message) {
    const toast = document.getElementById("toast");
    toast.textContent = message;
    toast.classList.add("show");

    clearTimeout(window.toastTimer);
    window.toastTimer = setTimeout(() => {
        toast.classList.remove("show");
    }, 2500);
}

// Page navigation
function showPage(pageId) {
    document.querySelectorAll(".page").forEach(page => {
        page.classList.remove("active");
    });

    const page = document.getElementById(pageId);

    if (!page || !page.classList.contains("page")) {
        document.getElementById("home")?.classList.add("active");
        showToast("That page could not be opened. Returning to Home.");
        return;
    }

    page.classList.add("active");
    window.scrollTo({ top: 0, behavior: "smooth" });

    if (pageId === "explore") renderScholarships();
    if (pageId === "saved") renderSaved();
    if (pageId === "dashboard") renderDashboard();
    if (pageId === "tracker") renderApplications();
    if (pageId === "admin") renderAdmin();
}

// Scholarship cards
function scholarshipCard(item) {
    const isSaved = saved.includes(item.id);

    return `
        <article class="scholarship-card">
            <div class="scholarship-top">
                <div class="scholarship-icon">${item.icon}</div>
                <span class="pill">${escapeHTML(item.category)}</span>
            </div>

            <h3>${escapeHTML(item.name)}</h3>
            <p>${escapeHTML(item.description)}</p>

            <div class="amount">${formatAmount(item.amount)}</div>

            <div class="card-meta">
                <span>🎓 ${escapeHTML(item.level)}</span>
                <span>📅 ${formatDate(item.deadline)}</span>
            </div>

            <div class="card-actions">
                <button class="btn btn-primary"
                    onclick="viewDetails(${item.id})">
                    View Details
                </button>

                <button class="save-btn"
                    onclick="toggleSave(${item.id})">
                    ${isSaved ? "♥ Saved" : "♡ Save"}
                </button>
            </div>
        </article>
    `;
}

function formatAmount(amount) {
    return "₹" + Number(amount).toLocaleString("en-IN");
}

function formatDate(date) {
    return new Date(date + "T00:00:00").toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric"
    });
}

function escapeHTML(value) {
    return String(value).replace(/[&<>"']/g, character => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;"
    })[character]);
}

// Only allow secure external links. This prevents javascript: and other unsafe schemes.
function safeExternalURL(value) {
    try {
        const url = new URL(String(value), window.location.origin);
        return url.protocol === "https:" ? url.href : "";
    } catch {
        return "";
    }
}

function renderFeatured() {
    const container = document.getElementById("featuredScholarships");

    container.innerHTML = scholarships
        .slice(0, 3)
        .map(scholarshipCard)
        .join("");
}

function renderScholarships() {
    const search = document.getElementById("searchInput").value.toLowerCase();
    const category = document.getElementById("categoryFilter").value;
    const level = document.getElementById("levelFilter").value;
    const sort = document.getElementById("sortFilter").value;

    let results = scholarships.filter(item => {
        const matchesSearch =
            item.name.toLowerCase().includes(search) ||
            item.description.toLowerCase().includes(search) ||
            item.category.toLowerCase().includes(search);

        const matchesCategory = !category || item.category === category;
        const matchesLevel = !level || item.level === level;

        return matchesSearch && matchesCategory && matchesLevel;
    });

    if (sort === "amount") {
        results.sort((a, b) => b.amount - a.amount);
    }

    if (sort === "name") {
        results.sort((a, b) => a.name.localeCompare(b.name));
    }

    document.getElementById("resultCount").textContent =
        `${results.length} scholarship(s) found`;

    document.getElementById("scholarshipList").innerHTML =
        results.length
            ? results.map(scholarshipCard).join("")
            : `<div class="empty-state">No scholarships found. Try another search.</div>`;
}

function toggleSave(id) {
    if (saved.includes(id)) {
        saved = saved.filter(item => item !== id);
        showToast("Removed from saved scholarships");
    } else {
        saved.push(id);
        showToast("Scholarship saved successfully!");
    }

    saveData();
    renderFeatured();
    renderScholarships();
    renderSaved();
    renderDashboard();
}

function renderSaved() {
    const list = scholarships.filter(item => saved.includes(item.id));

    document.getElementById("savedScholarships").innerHTML =
        list.length
            ? list.map(scholarshipCard).join("")
            : `<div class="empty-state">♡<h3>No saved scholarships yet</h3><p>Explore opportunities and save your favourites.</p></div>`;
}

function viewDetails(id) {
    const item = scholarships.find(s => s.id === id);

    if (!item) return;

    const alreadyApplied = applications.some(app => app.id === id);

    document.getElementById("scholarshipDetails").innerHTML = `
        <div class="detail-card">
            <div class="scholarship-icon">${item.icon}</div>
            <span class="pill">${escapeHTML(item.category)}</span>

            <h1>${escapeHTML(item.name)}</h1>
            <div class="amount">${formatAmount(item.amount)}</div>

            <p>${escapeHTML(item.description)}</p>

            <p><strong>Education level:</strong> ${escapeHTML(item.level)}</p>
            <p><strong>Minimum marks in sample criteria:</strong> ${item.marks}%</p>
            <p><strong>Income limit in sample criteria:</strong> ${formatAmount(item.income)}</p>
            <p><strong>Deadline:</strong> ${formatDate(item.deadline)}</p>

            <p class="demo-note">
                Demo scholarship record. Its criteria, amount and deadline
                are illustrative and must be checked on the official website.
            </p>

            <div class="card-actions">
                <button class="btn btn-primary"
                    onclick="addApplication(${item.id})"
                    ${alreadyApplied ? "disabled" : ""}>
                    ${alreadyApplied ? "Added to Tracker" : "Add to Application Tracker"}
                </button>

                <button class="btn btn-outline"
                    onclick="toggleSave(${item.id})">
                    ${saved.includes(item.id) ? "♥ Saved" : "♡ Save"}
                </button>
            </div>

            <p style="margin-top:20px">
                <a class="btn btn-primary" href="${escapeHTML(safeExternalURL(item.link) || "https://scholarships.gov.in")}"
                    target="_blank" rel="noopener noreferrer">
                    Visit Scholarship Portal ↗
                </a>
            </p>
        </div>
    `;

    showPage("details");
}

// Application tracker
function addApplication(id) {
    if (applications.some(app => app.id === id)) {
        showToast("Already added to your tracker");
        return;
    }

    applications.push({
        id,
        status: "Planning"
    });

    saveData();
    showToast("Added to application tracker!");
    viewDetails(id);
}

function updateApplication(id, status) {
    const app = applications.find(item => item.id === id);

    if (app) {
        app.status = status;
        saveData();
        renderApplications();
        renderDashboard();
        showToast("Application status updated");
    }
}

function removeApplication(id) {
    applications = applications.filter(app => app.id !== id);
    saveData();
    renderApplications();
    renderDashboard();
    showToast("Application removed");
}

function renderApplications() {
    const container = document.getElementById("applicationList");

    if (!applications.length) {
        container.innerHTML =
            `<div class="empty-state">No applications yet. Add a scholarship from Explore.</div>`;
        return;
    }

    container.innerHTML = applications.map(app => {
        const item = scholarships.find(s => s.id === app.id);
        if (!item) return "";

        return `
            <div class="application-row">
                <div>
                    <strong>${escapeHTML(item.name)}</strong>
                    <p class="muted">${formatAmount(item.amount)}</p>
                </div>

                <select class="status-select"
                    onchange="updateApplication(${item.id}, this.value)">
                    ${["Planning", "Documents Ready", "Applied", "Under Review", "Approved", "Rejected"]
                        .map(status => `
                            <option value="${status}" ${app.status === status ? "selected" : ""}>
                                ${status}
                            </option>
                        `).join("")}
                </select>

                <button class="save-btn"
                    onclick="removeApplication(${item.id})">
                    Remove
                </button>
            </div>
        `;
    }).join("");
}

// Document checklist
function renderDocuments() {
    const container = document.getElementById("documentChecklist");

    container.innerHTML = documentNames.map((name, index) => `
        <label class="check-row">
            <span>${escapeHTML(name)}</span>
            <input type="checkbox"
                ${documents[index] ? "checked" : ""}
                onchange="updateDocument(${index}, this.checked)">
        </label>
    `).join("");
}

function updateDocument(index, checked) {
    documents[index] = checked;
    saveData();
    renderDashboard();
}

function renderDashboard() {
    const savedItems = scholarships.filter(item => saved.includes(item.id));
    const heading = document.querySelector(".dashboard-header h1");
    if (heading) heading.textContent = userName ? `Welcome, ${userName}` : "Student Dashboard";

    document.getElementById("savedCount").textContent = saved.length;
    document.getElementById("applicationCount").textContent = applications.length;

    const completed = documentNames.filter((name, index) => documents[index]).length;
    document.getElementById("documentCount").textContent =
        `${completed}/${documentNames.length}`;

    document.getElementById("dashboardSaved").innerHTML =
        savedItems.length
            ? savedItems.map(item => `
                <div class="saved-row">
                    <span>${item.icon} ${escapeHTML(item.name)}</span>
                    <button class="text-button" onclick="viewDetails(${item.id})">View →</button>
                </div>
            `).join("")
            : `<p class="muted">Your saved scholarships will appear here.</p>`;

    document.getElementById("dashboardApplications").innerHTML =
        applications.length
            ? applications.map(app => {
                const item = scholarships.find(s => s.id === app.id);
                return item ? `
                    <div class="saved-row">
                        <span>${escapeHTML(item.name)}</span>
                        <span class="pill">${escapeHTML(app.status)}</span>
                    </div>
                ` : "";
            }).join("")
            : `<p class="muted">Your application progress will appear here.</p>`;

    renderDocuments();
}

// Eligibility checker
document.getElementById("eligibilityForm").addEventListener("submit", function(event) {
    event.preventDefault();

    const level = document.getElementById("educationLevel").value;
    const course = document.getElementById("course").value;
    const marks = Number(document.getElementById("marks").value);
    const income = Number(document.getElementById("income").value);
    const category = document.getElementById("studentCategory").value;

    if (!level || !course.trim() || !category ||
        !Number.isFinite(marks) || marks < 0 || marks > 100 ||
        !Number.isFinite(income) || income < 0) {
        showToast("Please enter valid details. Marks must be 0–100 and income cannot be negative.");
        return;
    }

    if (!window.GrantlyEligibility || typeof window.GrantlyEligibility.calculate !== "function") {
        showToast("Eligibility checker is temporarily unavailable. Please refresh the page.");
        return;
    }

    const results = window.GrantlyEligibility.calculate(
        { level, course, marks, income, category },
        scholarships
    );

    const container = document.getElementById("eligibilityResults");

    container.innerHTML = `
        <h3 style="margin-top:25px">Your sample match results</h3>
        <p class="muted">Course: ${escapeHTML(course)} | Category: ${escapeHTML(category)}</p>

        ${results.map(item => `
            <div class="match-result">
                <strong>${item.score}% profile match</strong>
                <p>${escapeHTML(item.name)}</p>
                <p class="muted">
                    Education level: ${item.levelPoints}/40 · Marks: ${item.marksPoints}/35 · Income: ${item.incomePoints}/25
                </p>
                <p class="muted">
                    ${item.score === 100
                        ? "Meets all three sample checks shown above."
                        : item.score >= 50
                            ? "Meets some sample checks. Review the missing criteria."
                            : "Does not meet most of the sample checks."}
                </p>
                <button class="text-button" onclick="viewDetails(${item.id})">
                    View details →
                </button>
            </div>
        `).join("")}

        <p class="demo-note">
            This is an indicative demo score, not an official eligibility decision.
            Category-specific rules and other conditions may apply.
        </p>
    `;
});

// Demo registration
document.getElementById("registerForm").addEventListener("submit", function(event) {
    event.preventDefault();

    const name = document.getElementById("registerName").value.trim();
    const email = document.getElementById("registerEmail").value.trim();

    const password = document.getElementById("registerPassword").value;

    if (name.length < 2 || !/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(email) || password.length < 6) {
        showToast("Enter a valid name, email and password of at least 6 characters.");
        return;
    }

    userName = name;
    try {
        localStorage.setItem("grantlyName", name);
        localStorage.setItem("grantlyEmail", email);
    } catch (error) {
        showToast("Browser storage is unavailable. Profile could not be saved.");
        return;
    }

    this.reset();
    showToast("Demo profile created in this browser.");
    showPage("dashboard");
});

// Demo login
document.getElementById("loginForm").addEventListener("submit", function(event) {
    event.preventDefault();

    const email = document.getElementById("loginEmail").value.trim();
    const password = document.getElementById("loginPassword").value;

    if (!/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(email) || !password) {
        showToast("Enter a valid email address and password to continue.");
        return;
    }

    // This is intentionally a demo gate, not real authentication.
    // Passwords are never stored or compared by this frontend-only version.
    userName = localStorage.getItem("grantlyName") || "Student";
    this.reset();
    showToast("Demo access opened. This is not a verified account login.");
    showPage("dashboard");
});

// Demo chatbot
document.getElementById("chatForm").addEventListener("submit", function(event) {
    event.preventDefault();

    const input = document.getElementById("chatInput");
    const question = input.value.trim();

    if (!question) return;

    addChatMessage(question, "user");
    input.value = "";

    setTimeout(() => {
        addChatMessage(getBotReply(question), "bot");
    }, 500);
});

function addChatMessage(message, sender) {
    const container = document.getElementById("chatMessages");
    const bubble = document.createElement("div");

    bubble.className = `chat-bubble ${sender}`;
    bubble.textContent = message;

    container.appendChild(bubble);
    container.scrollTop = container.scrollHeight;
}

function getBotReply(question) {
    const text = question.toLowerCase();

    if (text.includes("eligib") || text.includes("qualify")) {
        return "Use the Eligibility Checker to compare your academic details with the sample scholarship criteria. Always confirm the final conditions on the official portal.";
    }

    if (text.includes("document")) {
        return "Commonly requested documents can include identity proof, marksheets, income certificate, category certificate if applicable, and bank details. Requirements differ by scholarship.";
    }

    if (text.includes("deadline") || text.includes("last date")) {
        return "Check the deadline shown on each scholarship's official application portal. Dates in this GRANTLY demo are illustrative.";
    }

    if (text.includes("apply")) {
        return "Open a scholarship's details, add it to your application tracker, prepare the required documents and follow the official application link.";
    }

    if (text.includes("hello") || text.includes("hi")) {
        return "Hello! Welcome to GRANTLY. I can guide you through scholarship discovery, eligibility and application preparation.";
    }

    return "I can help with scholarship discovery, eligibility checks, application steps and document preparation. Please check official scholarship sources before applying.";
}

// Demo admin: add and delete sample records
document.getElementById("adminForm").addEventListener("submit", function(event) {
    event.preventDefault();

    const newItem = {
        id: Date.now(),
        name: document.getElementById("adminName").value.trim(),
        amount: Number(document.getElementById("adminAmount").value.replace(/[^\d]/g, "")),
        category: document.getElementById("adminCategory").value.trim(),
        level: document.getElementById("adminLevel").value.trim(),
        deadline: document.getElementById("adminDeadline").value,
        link: document.getElementById("adminLink").value,
        description: "Added through the GRANTLY demo admin panel.",
        marks: 50,
        income: 1000000,
        icon: "🎓"
    };

    const validatedLink = safeExternalURL(newItem.link);

    if (!newItem.name || !Number.isFinite(newItem.amount) || newItem.amount <= 0 ||
        !newItem.deadline || !validatedLink) {
        showToast("Enter a name, valid amount, deadline and secure HTTPS scholarship link.");
        return;
    }

    newItem.link = validatedLink;
    scholarships.push(newItem);
    saveAdminScholarships();

    this.reset();
    renderAdmin();
    renderFeatured();
    showToast("Scholarship added!");
});

function saveAdminScholarships() {
    safeStore("grantlyAdminScholarships", scholarships);
}

function renderAdmin() {
    const container = document.getElementById("adminScholarshipList");

    container.innerHTML = scholarships.map(item => `
        <div class="saved-row">
            <span>${escapeHTML(item.name)}</span>
            <button class="save-btn" onclick="deleteScholarship(${item.id})">
                Delete
            </button>
        </div>
    `).join("");
}

function deleteScholarship(id) {
    const index = scholarships.findIndex(item => item.id === id);

    if (index === -1) return;

    scholarships.splice(index, 1);
    saved = saved.filter(item => item !== id);
    applications = applications.filter(item => item.id !== id);

    saveData();
    saveAdminScholarships();
    renderAdmin();
    renderFeatured();
    showToast("Scholarship deleted");
}

// Load admin-added records from localStorage
const adminRecords = readStoredJSON("grantlyAdminScholarships", []);

adminRecords.forEach(item => {
    if (!scholarships.some(existing => existing.id === item.id)) {
        scholarships.push(item);
    }
});

// Dark mode
function toggleTheme() {
    document.body.classList.toggle("dark");

    localStorage.setItem(
        "grantlyTheme",
        document.body.classList.contains("dark") ? "dark" : "light"
    );
}

if (localStorage.getItem("grantlyTheme") === "dark") {
    document.body.classList.add("dark");
}

// Initial rendering
renderFeatured();
renderScholarships();
renderSaved();
renderDashboard();