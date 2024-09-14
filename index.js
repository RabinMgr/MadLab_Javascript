async function fetchData(){
    
    try{
        const response = await fetch("https://gutendex.com/books/");

        if(!response.ok){
            throw new Error("Could not fetch resource");
        }

        const data = await response.json();
        console.log(data);

        const bookList = document.getElementById('books');
        bookList.innerHTML = "";  
        data.results.forEach(book => {
            const listItem = document.createElement('li');
            listItem.textContent = `
                Title: ${book.title}
                ID: ${book.id}
                Subjects: ${book.subjects.join(', ')}
            `;
            bookList.appendChild(listItem);

        })   
              
    }
    catch(error){
        console.error(error);
    }
}

fetchData();

