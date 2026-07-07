const toast = document.querySelector(".toast");
const copyEmailButton = document.querySelector("[data-copy-email]");
const revealItems = document.querySelectorAll(".reveal");
const linksConfig = window.FAKEZIN_LINKS || {};

let toastTimer;

function showToast(message) {
  if (!toast) return;

  toast.textContent = message;
  toast.classList.add("is-visible");
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => {
    toast.classList.remove("is-visible");
  }, 2200);
}

function applyConfiguredLinks() {
  document.querySelectorAll("[data-link]").forEach((link) => {
    const key = link.dataset.link;
    const href = linksConfig[key];

    if (!href) return;

    link.href = href;

    if (href !== "#") {
      link.target = "_blank";
      link.rel = "noopener noreferrer";
    }
  });

  if (linksConfig.email && copyEmailButton) {
    const emailText = document.querySelector("[data-email-text]");
    copyEmailButton.dataset.copyEmail = linksConfig.email;
    copyEmailButton.setAttribute("aria-label", "Copiar email " + linksConfig.email);

    if (emailText) {
      emailText.textContent = linksConfig.email;
    }
  }
}

async function copyToClipboard(text) {
  if (navigator.clipboard && window.isSecureContext) {
    await navigator.clipboard.writeText(text);
    return;
  }

  const textArea = document.createElement("textarea");
  textArea.value = text;
  textArea.setAttribute("readonly", "");
  textArea.style.position = "fixed";
  textArea.style.opacity = "0";
  textArea.style.userSelect = "text";
  textArea.style.webkitUserSelect = "text";
  document.body.appendChild(textArea);
  textArea.select();
  document.execCommand("copy");
  textArea.remove();
}

copyEmailButton?.addEventListener("click", async () => {
  const email = copyEmailButton.dataset.copyEmail;

  try {
    await copyToClipboard(email);
    showToast("Email copiado!");
  } catch {
    showToast("Copie o email: " + email);
  }
});

applyConfiguredLinks();

document.querySelectorAll('a[href="#"]').forEach((link) => {
  link.addEventListener("click", (event) => {
    event.preventDefault();
    showToast("Link em breve.");
  });
});

document.addEventListener("dragstart", (event) => {
  event.preventDefault();
});

const revealObserver = "IntersectionObserver" in window
  ? new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.16 }
    )
  : null;

revealItems.forEach((item, index) => {
  item.style.transitionDelay = `${Math.min(index * 70, 280)}ms`;

  if (revealObserver) {
    revealObserver.observe(item);
  } else {
    item.classList.add("is-visible");
  }
});
