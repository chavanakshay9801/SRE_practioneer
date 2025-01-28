const apiBaseUrl = "http://localhost:8082/api/books";

// Fetch and display books
async function fetchBooks() {
    const response = await fetch(apiBaseUrl);
    const books = await response.json();

    const bookList = document.getElementById("book-list");
    bookList.innerHTML = books.map(book => `
        <tr>
            <td>${book.title}</td>
            <td>${book.author}</td>
            <td>${book.price.toFixed(2)}</td>
            <td>
                <button onclick="editBook(${book.id})">Edit</button>
                <button onclick="deleteBook(${book.id})">Delete</button>
            </td>
        </tr>
    `).join("");
}

// Add or update a book
document.getElementById("book-form").addEventListener("submit", async function(e) {
    e.preventDefault();

    const id = document.getElementById("book-id").value;
    const title = document.getElementById("title").value;
    const author = document.getElementById("author").value;
    const price = document.getElementById("price").value;

    const book = { title, author, price };

    if (id) {
        await fetch(`${apiBaseUrl}/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(book),
        });
    } else {
        await fetch(apiBaseUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(book),
        });
    }

    document.getElementById("book-form").reset();
    fetchBooks();
});

// Edit a book
async function editBook(id) {
    const response = await fetch(`${apiBaseUrl}/${id}`);
    const book = await response.json();

    document.getElementById("book-id").value = book.id;
    document.getElementById("title").value = book.title;
    document.getElementById("author").value = book.author;
    document.getElementById("price").value = book.price;
}

// Delete a book
async function deleteBook(id) {
    await fetch(`${apiBaseUrl}/${id}`, { method: "DELETE" });
    fetchBooks();
}

// Initialize
fetchBooks();
