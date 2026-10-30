// =====================================================
// POP-UP EXPERIENCE GALLERY
// =====================================================
let currentImageIndex = 0;
let mediaList = [];

function initExperienceGallery() {
  const cards = Array.from(document.querySelectorAll(".experience-linkedin-card"));
  const images = document.querySelectorAll(".experience-media-preview img");
  mediaList = [];
  images.forEach((img, index) => {
    const card = img.closest(".experience-linkedin-card");
    mediaList.push({
      src: img.getAttribute("src"),
      caption: img.getAttribute("alt") || "Work preview",
      description: img.getAttribute("data-description") || "",
      group: cards.indexOf(card) // penanda foto ini milik experience yang mana
    });
    img.setAttribute("data-index", index);
  });
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initExperienceGallery);
} else {
  initExperienceGallery();
}

// Daftar index foto yang satu experience dengan foto yang sedang dibuka
function getGroupIndexes() {
  const group = mediaList[currentImageIndex].group;
  return mediaList
    .map((item, i) => (item.group === group ? i : -1))
    .filter(i => i !== -1);
}

function openModal(element) {
  if (mediaList.length === 0) initExperienceGallery();

  currentImageIndex = parseInt(element.getAttribute("data-index"), 10) || 0;
  const modal = document.getElementById("galleryModal");
  if (!modal) return;

  updateModalContent();
  modal.classList.add("show");
  document.body.style.overflow = "hidden";
}

function updateModalContent() {
  const modalImg = document.getElementById("modalImage");
  const modalCap = document.getElementById("modalCaption");
  const modalDesc = document.getElementById("modalDesc");
  const item = mediaList[currentImageIndex];
  if (!modalImg || !item) return;

  modalImg.src = item.src;
  modalImg.alt = item.caption;
  if (modalCap) modalCap.textContent = item.caption;
  if (modalDesc) modalDesc.textContent = item.description;

  // Sembunyikan tombol prev/next kalau experience ini cuma punya 1 foto
  const showNav = getGroupIndexes().length > 1;
  document.querySelectorAll("#galleryModal .nav-btn").forEach(btn => {
    btn.style.display = showNav ? "" : "none";
  });
}

function changeImage(direction, event) {
  if (event) event.stopPropagation();

  // Geser hanya di antara foto dalam experience yang sama
  const indexes = getGroupIndexes();
  const pos = indexes.indexOf(currentImageIndex);
  const nextPos = (pos + direction + indexes.length) % indexes.length;
  currentImageIndex = indexes[nextPos];
  updateModalContent();
}

function closeModal() {
  const modal = document.getElementById("galleryModal");
  if (modal) modal.classList.remove("show");
  document.body.style.overflow = "";
}

// Klik area gelap (di luar foto dan tombol) untuk menutup
document.addEventListener("click", event => {
  const modal = document.getElementById("galleryModal");
  if (modal && event.target === modal) closeModal();
});

// Keyboard: Esc, panah kiri/kanan
document.addEventListener("keydown", event => {
  const modal = document.getElementById("galleryModal");
  if (!modal || !modal.classList.contains("show")) return;

  if (event.key === "Escape") closeModal();
  else if (event.key === "ArrowRight") changeImage(1);
  else if (event.key === "ArrowLeft") changeImage(-1);
});

// =====================================================
// PROJECT CARD - CURSOR GLOW ANIMATION
// =====================================================

document.querySelectorAll("#project .project-card").forEach(card => {

    card.addEventListener("mousemove", event => {
        const rect = card.getBoundingClientRect();

        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        card.style.setProperty("--mouse-x", `${x}px`);
        card.style.setProperty("--mouse-y", `${y}px`);
    });

    card.addEventListener("mouseleave", () => {
        card.style.setProperty("--mouse-x", "50%");
        card.style.setProperty("--mouse-y", "50%");
    });

});