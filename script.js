/**
 * QuickCalcPro Central Script Hub
 * Implements core site functions: navigation, mobile menu, responsive dropdowns,
 * global calculator search, service worker registration, and related tool generators.
 */

// Centralized Index of Calculators
const CALCULATORS_INDEX = [
    {
        name: "EMI Calculator",
        url: "/emi-calculator",
        category: "financial",
        description: "Calculate your Equated Monthly Installments for home, car, or personal loans.",
        keywords: ["loan", "emi", "mortgage", "installments", "monthly payment"]
    },
    {
        name: "Loan Calculator",
        url: "/loan-calculator",
        category: "financial",
        description: "Determine total interest, principal breakdown, and schedule for any loan.",
        keywords: ["loan", "finance", "debt", "repayment", "interest"]
    },
    {
        name: "GST Calculator",
        url: "/gst-calculator",
        category: "financial",
        description: "Calculate gross price, net price, and tax amounts for Goods and Services Tax.",
        keywords: ["gst", "tax", "vat", "gross", "net", "sales tax"]
    },
    {
        name: "BMI Calculator",
        url: "/bmi-calculator",
        category: "health",
        description: "Determine your Body Mass Index and health category relative to ideal weights.",
        keywords: ["bmi", "body mass index", "health", "diet", "weight", "obesity"]
    },
    {
        name: "BMR Calculator",
        url: "/bmr-calculator",
        category: "health",
        description: "Calculate your Basal Metabolic Rate to understand daily baseline calorie burn.",
        keywords: ["bmr", "metabolic rate", "calories", "metabolism", "burn"]
    },
    {
        name: "Calorie Calculator",
        url: "/calorie-calculator",
        category: "health",
        description: "Estimate daily calories required based on physical activity levels and goals.",
        keywords: ["calorie", "diet", "tdee", "activity", "weight loss", "gain"]
    },
    {
        name: "Percentage Calculator",
        url: "/percentage-calculator",
        category: "math",
        description: "Solve basic percentage equations, increases, discounts, and fractions.",
        keywords: ["percentage", "math", "discount", "increase", "decrease", "ratio"]
    },
    {
        name: "Scientific Calculator",
        url: "/scientific-calculator",
        category: "math",
        description: "Complete algebraic and trigonometric calculations directly in your browser.",
        keywords: ["scientific", "math", "trig", "algebra", "sin", "cos", "tan", "log"]
    },
    {
        name: "Currency Converter",
        url: "/currency-converter",
        category: "converters",
        description: "Convert 11 major global currencies instantly using dynamic up-to-date live rates.",
        keywords: ["currency", "money", "forex", "usd", "pkr", "eur", "gbp", "exchange rate"]
    },
    {
        name: "Unit Converter",
        url: "/unit-converter",
        category: "converters",
        description: "Convert between various physical measurements including length, weight, and temp.",
        keywords: ["unit", "length", "weight", "temperature", "metric", "imperial"]
    }
];

document.addEventListener("DOMContentLoaded", () => {
    initNavigation();
    initGlobalSearch();
    registerServiceWorker();
});

// Mobile Navigation and Dropdowns
function initNavigation() {
    const mobileMenuButton = document.getElementById("mobile-menu-btn");
    const mobileMenu = document.getElementById("mobile-menu");
    const desktopDropdownBtn = document.getElementById("tools-dropdown-btn");
    const desktopDropdown = document.getElementById("tools-dropdown");

    // Toggle Mobile Menu
    if (mobileMenuButton && mobileMenu) {
        mobileMenuButton.addEventListener("click", () => {
            mobileMenu.classList.toggle("hidden");
            const isOpen = !mobileMenu.classList.contains("hidden");
            const icon = mobileMenuButton.querySelector("svg");
            if (icon) {
                if (isOpen) {
                    icon.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />';
                } else {
                    icon.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />';
                }
            }
        });
    }

    // Toggle Desktop Tools Dropdown on Hover/Click
    if (desktopDropdownBtn && desktopDropdown) {
        let timeoutId;
        
        const showDropdown = () => {
            clearTimeout(timeoutId);
            desktopDropdown.classList.remove("hidden");
            desktopDropdown.classList.add("fade-in");
        };

        const hideDropdown = () => {
            timeoutId = setTimeout(() => {
                desktopDropdown.classList.add("hidden");
                desktopDropdown.classList.remove("fade-in");
            }, 150);
        };

        desktopDropdownBtn.addEventListener("mouseenter", showDropdown);
        desktopDropdownBtn.addEventListener("mouseleave", hideDropdown);
        desktopDropdown.addEventListener("mouseenter", showDropdown);
        desktopDropdown.addEventListener("mouseleave", hideDropdown);

        desktopDropdownBtn.addEventListener("click", (e) => {
            e.preventDefault();
            desktopDropdown.classList.toggle("hidden");
        });
    }

    // Tools Category Dropdowns for Mobile
    const mobileDropdownBtn = document.getElementById("mobile-tools-btn");
    const mobileDropdown = document.getElementById("mobile-tools-dropdown");
    if (mobileDropdownBtn && mobileDropdown) {
        mobileDropdownBtn.addEventListener("click", (e) => {
            e.preventDefault();
            mobileDropdown.classList.toggle("hidden");
        });
    }
}

// Global Search bar logic
function initGlobalSearch() {
    const searchInputs = document.querySelectorAll(".global-search-input");
    
    searchInputs.forEach(input => {
        const container = input.parentElement;
        if (!container) return;

        // Create results container
        const searchResultsDiv = document.createElement("div");
        searchResultsDiv.className = "absolute left-0 right-0 top-full mt-2 bg-white rounded-lg shadow-xl border border-slate-100 z-50 max-h-80 overflow-y-auto hidden fade-in";
        container.appendChild(searchResultsDiv);

        input.addEventListener("input", (e) => {
            const query = e.target.value.toLowerCase().trim();
            if (query === "") {
                searchResultsDiv.classList.add("hidden");
                searchResultsDiv.innerHTML = "";
                return;
            }

            const hits = CALCULATORS_INDEX.filter(calc => {
                return calc.name.toLowerCase().includes(query) ||
                       calc.description.toLowerCase().includes(query) ||
                       calc.keywords.some(keyword => keyword.includes(query)) ||
                       calc.category.includes(query);
            });

            if (hits.length === 0) {
                searchResultsDiv.innerHTML = `
                    <div class="p-4 text-center text-slate-400 text-sm">
                        No calculators found matching "${e.target.value}"
                    </div>
                `;
            } else {
                let html = '<div class="py-2 border-b border-slate-50 px-3 text-xs font-semibold text-slate-400 tracking-wider">SEARCH RESULTS</div>';
                hits.forEach(hit => {
                    html += `
                        <a href="${hit.url}" class="flex flex-col px-4 py-3 hover:bg-slate-50 transition border-b border-slate-50 last:border-0 group">
                            <span class="text-sm font-semibold text-slate-900 group-hover:text-blue-600 transition flex items-center justify-between">
                                ${hit.name}
                                <span class="text-[10px] bg-slate-100 text-slate-500 rounded px-1.5 py-0.5 uppercase font-medium">${hit.category}</span>
                            </span>
                            <span class="text-xs text-slate-500 mt-0.5 mt-0.5 leading-snug">${hit.description}</span>
                        </a>
                    `;
                });
                searchResultsDiv.innerHTML = html;
            }
            searchResultsDiv.classList.remove("hidden");
        });

        // Close search list on clicking outside
        document.addEventListener("click", (e) => {
            if (!container.contains(e.target)) {
                searchResultsDiv.classList.add("hidden");
            }
        });
    });
}

// Service worker registration for offline availability (PWA)
function registerServiceWorker() {
    if ("serviceWorker" in navigator) {
        window.addEventListener("load", () => {
            navigator.serviceWorker.register("/service-worker.js")
                .then(registration => {
                    console.log("Service Worker registered with scope:", registration.scope);
                })
                .catch(error => {
                    console.log("Service Worker registration failed:", error);
                });
        });
    }
}
