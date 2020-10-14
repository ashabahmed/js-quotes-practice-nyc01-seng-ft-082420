document.addEventListener("DOMContentLoaded", function () {

  const quotesUrl = "http://localhost:3000/quotes?_embed=likes"

  const getQuotes = () => {
    fetch(quotesUrl)
    .then(response => response.json())
    .then(quotes => {
      renderQuotes(quotes)
    })
  }

  const renderQuotes = quotes => {
    
    for (const quote of quotes) {
      renderQuote(quote)
    }
  }
  function quotesNum(quote){
    
    if (quote.likes == undefined) {
      let quoteLikes = 0
      return quoteLikes
    } else {
      let quoteLikes = quote.likes.length
      return quoteLikes
    }
  }

  const renderQuote = quote => {
    const quoteLi = document.createElement('li')
    quoteLi.classList.add('quote-card')
    quoteLi.dataset.id = quote.id
    let quoteLikes = quotesNum(quote)

    quoteLi.innerHTML = `
      <blockquote class="blockquote">
        <p class="mb-0">${quote.quote}</p>
        <footer class="blockquote-footer">${quote.author}</footer>
        <br>
        <button class='btn-success'>Likes: <span>${quoteLikes}</span></button>
        <button class='btn-danger'>Delete</button>
      </blockquote>
    `
    const quotesUl = document.getElementById('quote-list')
    quotesUl.append(quoteLi)

  }

  const submitHandler = () => {
    document.addEventListener('submit', function (e) {
        e.preventDefault()
        const form = e.target
        const author = form.author.value
        const quote = form.quote.value
        
        const quoteObj = { quote: quote, author: author}

        form.reset()
        const options = {
          method: "POST",
          headers: {
            "content-type": "application/json",
            "accept": "application/json"
          },
          body: JSON.stringify(quoteObj)
        }

        fetch("http://localhost:3000/quotes/", options)
        .then(response => response.json())
        .then(response => renderQuote(response))
      })
      
    }

    const clickHandler = () => {
      document.addEventListener('click', (e) => { 
        if (e.target.matches('.btn-danger')) {
          const deleteButton = e.target
          const liQuote = deleteButton.parentElement.parentElement
          const quoteId = liQuote.dataset.id
          
          const options = {
            method: "DELETE"
          }

          fetch("http://localhost:3000/quotes/" + quoteId, options)
          .then(response => response.json())
          .then(quote => {
            liQuote.remove()
          })
        } else if (e.target.matches('.btn-success')) {
          const likesButton = e.target 
          const liQuote = likesButton.parentElement.parentElement
          const quoteId = liQuote.dataset.id
          const options = {
            method: "POST",
            headers: {
              "content-type": "application/json",
              "accept": "application/json"
            },
            body: JSON.stringify({quoteId: quoteId})
          }

          fetch("http://localhost:3000/likes", options)
          .then(response => response.json())
          
          .then(function(){
            let likesText = likesButton.childNodes[1]
            let increaseLikes = parseInt(likesText.textContent) 
            likesText.textContent = increaseLikes + 1
            
          })
        }
      })
    }
  

  clickHandler()  
  submitHandler()
  getQuotes()
})


//first get quotes and  put them on ul id #quotes-list
// quote html :
  // <li class='quote-card'>
  // <blockquote class="blockquote">
  //   <p class="mb-0">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer posuere erat a ante.</p>
  //   <footer class="blockquote-footer">Someone famous</footer>
  //   <br>
  //   <button class='btn-success'>Likes: <span>0</span></button>
  //   <button class='btn-danger'>Delete</button>
  // </blockquote>
  // </li>

  // form submission creates new quote and adds it to the ul.
  // delete button should remove from API and remove from page
  // like button will creeate a like for quote in API and updat the likes number
      //post request to http://localhost:3000/likes
  