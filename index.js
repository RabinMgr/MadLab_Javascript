async function fetchData() {
    try {
        const response = await fetch("https://gutendex.com/books/");

        if (!response.ok) {
            throw new Error("Could not fetch resource");
        }

        const data = await response.json();
        console.log(data);

        // Sort data results
        const sortedData = sortData(data.results); 
        // Set subjects entries to uppercase
        const transformedData = transformData(sortedData);  

        
        const bookList = document.getElementById('books');
        bookList.innerHTML = "";  

        //Display the data
        transformedData.forEach(book => {
            const listItem = document.createElement('li');
            listItem.textContent = `
                Title: ${book.title}
                ID: ${book.id}
                Subjects: ${book.subjects.join(', ') || 'No subjects available'}
            `;
            bookList.appendChild(listItem);
        });

    } catch (error) {
        console.error("Error:", error.message);
    }
}

// Arrays
function sortData(data) {
    return data.sort((a, b) => a.id - b.id);
}

// Strings
function transformData(data) {
    return data.map(book => ({
        ...book,
        subjects: (book.subjects || []).map(subject => subject.toUpperCase())
    }));
}

fetchData();
