// -------------------------------------------------------
// Firebase / Firestore configuration
// -------------------------------------------------------
const PROJECT_ID = "lens-co";
const CONFIG_DOC_PATH = "config/appConfig";

const FIRESTORE_GET =
  `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents/${CONFIG_DOC_PATH}`;

const FIRESTORE_PATCH =
  `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents/${CONFIG_DOC_PATH}?updateMask.fieldPaths=agreementCount`;

// -------------------------------------------------------
// DOM elements
// -------------------------------------------------------
const summarySpan = document.getElementById("summaryText");
const updatedDateSpan = document.getElementById("updatedDateBadge");
const learnMoreBtn = document.getElementById("learnMoreBtn");
const expandableSection = document.getElementById("expandableSection");

// -------------------------------------------------------
let currentFullPolicy = "";

// -------------------------------------------------------
function showToast(message, isError = false) {
  const toast = document.getElementById("toastMessage");
  toast.innerText = message;
  toast.style.background = isError ? "#b91c1c" : "#1e6f5c";
  toast.style.opacity = "1";

  setTimeout(() => {
    toast.style.opacity = "0";
  }, 2800);
}

// -------------------------------------------------------
// Fetch policy from Firestore
// -------------------------------------------------------
async function fetchFullConfig(updateUI = true, isLearnMoreFetch = false) {

  try {
    const res = await fetch(FIRESTORE_GET);
    const data = await res.json();

    if (!data.fields) {
      summarySpan.innerText = "⚠️ Privacy policy not configured.";
      return null;
    }

    const fields = data.fields;

    const summary =
      fields.summary?.stringValue ||
      "We value your privacy. This extension collects only minimal interaction data.";

    const fullPolicy =
      fields.fullPolicy?.stringValue ||
      "Full policy not available.";

    const updated =
      fields.updatedDate?.stringValue ||
      "Not specified";

    currentFullPolicy = fullPolicy;

    if (updateUI && !isLearnMoreFetch) {
      summarySpan.innerText = summary;
      updatedDateSpan.innerText = `📅 Last updated: ${updated}`;
    }

    if (isLearnMoreFetch && updateUI) {
      fullPolicyDiv.innerText = fullPolicy;
      updatedDateSpan.innerText = `📅 Last updated: ${updated}`;
    }

    return fields;

  } catch (err) {
    console.error("Fetch error:", err);
    summarySpan.innerText = "⚠️ Failed to load privacy policy.";
    return null;
  }
}

// -------------------------------------------------------

// -------------------------------------------------------
async function onLearnMoreClick() {

  await fetchFullConfig(true, true);

  expandableSection.classList.remove("hidden");

  expandableSection.scrollIntoView({
    behavior: "smooth",
    block: "nearest"
  });

}

// -------------------------------------------------------


// -------------------------------------------------------

// -------------------------------------------------------
function bindEvents() {

  learnMoreBtn.addEventListener("click", onLearnMoreClick);

}
