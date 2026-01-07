document.querySelectorAll(".goodreads-book").forEach(book => {
  let popover;

  book.addEventListener("mouseenter", () => {
    const rating = parseFloat(book.dataset.rating || "0");
    const stars =
      "★".repeat(Math.round(rating)) +
      "☆".repeat(5 - Math.round(rating));

    popover = document.createElement("div");
    popover.className = "goodreads-popover";
    popover.innerHTML = `
      <h4>${book.dataset.title}</h4>
      <div class="author">${book.dataset.author}</div>
      <div class="stars">${stars}</div>
      <div class="date">Read: ${book.dataset.date}</div>
      <div class="review">${book.dataset.review}</div>
    `;

    book.appendChild(popover);
  });

  book.addEventListener("mouseleave", () => {
    if (popover) popover.remove();
  });
});
