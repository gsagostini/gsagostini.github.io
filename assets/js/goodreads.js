document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".goodreads-book").forEach(book => {
    let popup;

    book.addEventListener("mouseenter", () => {
      popup = document.createElement("div");
      popup.className = "goodreads-popup";

      popup.innerHTML = `
        <h3>${book.dataset.title}</h3>
        <div class="author">${book.dataset.author}</div>
        <div class="meta">
          ⭐ ${book.dataset.rating || "—"}<br>
          ${book.dataset.date || ""}
        </div>
        <div class="review">${book.dataset.review || ""}</div>
      `;

      book.appendChild(popup);

      // Flip popup if it overflows viewport
      const rect = popup.getBoundingClientRect();
      if (rect.right > window.innerWidth) {
        popup.classList.add("left");
      }
    });

    book.addEventListener("mouseleave", () => {
      if (popup) popup.remove();
    });
  });
});
