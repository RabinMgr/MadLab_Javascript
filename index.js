let url = "https://gutendex.com/books/";

async function fetchData(url) {
    try {

        let foundBook = false;
        let page = 1;
        const search = document.getElementById('search');
        const bookList = document.getElementById('books');
        
        while(!foundBook && url){
            const response = await fetch(url);
            const data = await response.json();
            if (!response.ok) {
                throw new Error("Could not fetch resource");
            }      
            search.innerHTML =`...Searching on page: ${page}`;
            foundBook = findBook(data.results);
            console.log("page number: ", page);
            url = data.next;
            page+=1; 

            if (!url) {
                console.log("No more pages to check. Book was not found");
                break;
            }
        }

        const response = await fetch(url);
        const data = await response.json();
        if (!response.ok) {
            throw new Error("Could not fetch resource");
        }  
        // Sort data results by ID
        const sortedData = sortData(data.results); 
        // Set subjects entries to uppercase
        const transformedData = transformData(sortedData);  
        // Remove entries whose author didn't exist within the last 200 years.
        const filteredData = filterData(transformedData);
        displayBooks(filteredData);
        


    } catch (error) { 
        console.error("Error:", error.message);
    }
}



function displayBooks(data){
    const bookList = document.getElementById('books');
    bookList.innerHTML = "";  
    data.forEach(book => {
        const listItem = document.createElement('li');
        listItem.textContent = `
            ID: ${book.id}
            Title: ${book.title}
            Subjects: ${book.subjects.join(', ') || 'No subjects available'}
        `;
        bookList.appendChild(listItem);
    });
}

function findBook(data) {
    const item = document.getElementById('search');
    item.innerHTML = ""; 
    for (const book of data) {
        if (book.title === "Short Stories" && book.authors.some(author => author.name === "Dostoyevsky, Fyodor")) {
            
            console.log(`Found the book 'Short Stories' by 'Dostoyevsky, Fyodor'`);
            
            const listItem = document.createElement('li');
            listItem.textContent = `
                Title: ${book.title}
                ID: ${book.id}
                Subjects: ${book.subjects.join(', ') || 'No subjects available'}`;
            item.appendChild(listItem);
            
            return true; 
        }
    }
    return false; 
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

// Dates
function filterData(books) {
    const startYear = new Date().getFullYear() - 200;
    return books.filter(book => {
        if (!Array.isArray(book.authors)) {
            return false;}
        return book.authors.some(author => author.birth_year >= startYear);
    });
}

fetchData(url);