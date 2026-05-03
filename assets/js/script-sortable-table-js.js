function sortTable(columnIndex, tableId) {
    var table = document.getElementById(tableId);
    var thead = table.querySelector("thead");
    var tbody = table.querySelector("tbody");
    var rows = Array.from(tbody.rows);

    // Toggle sort direction (simple version)
    var wrapColumnIndex = "" + columnIndex;
    var isAscending = (table.getAttribute("order-by") === wrapColumnIndex && table.getAttribute("data-sort-dir") === "asc");
    table.setAttribute("order-by", wrapColumnIndex);
    table.setAttribute("data-sort-dir", isAscending ? "desc" : "asc");

    var headers = thead.querySelectorAll("th");
    headers.forEach((header, index) => {
        header.classList.remove("sort-asc", "sort-desc");
        if(index == columnIndex) {
            header.classList.add(isAscending ? "sort-desc" : "sort-asc");
        }
    });

    rows.sort((rowA, rowB) => {
        var valA = rowA.cells[columnIndex].textContent.trim();
        var valB = rowB.cells[columnIndex].textContent.trim();

        // Check if numeric or string for better sorting
        return !isAscending
            ? valA.localeCompare(valB, undefined, {numeric: true})
            : valB.localeCompare(valA, undefined, {numeric: true});
    });

    // Re-append rows in new order
    rows.forEach(row => tbody.appendChild(row));
}