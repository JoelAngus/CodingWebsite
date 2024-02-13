

function insertNewPost(description, photoURL, price, city, condition) {

   var photoCard = Handlebars.templates.photoCard({
        photoURL: photoURL,
        description: description,
        price:price,
        city:city,
        condition:condition
      })
      console.log("== photoCard:", photoCard)
      var postContainer = document.getElementById("posts")
      postContainer.insertAdjacentHTML("beforeend",photoCard)
      return photoCard

}


var allPosts = []
var allCities = []



function clearFiltersAndReinsertPosts() {
    document.getElementById('filter-text').value = ""
    document.getElementById('filter-min-price').value = ""
    document.getElementById('filter-max-price').value = ""
    document.getElementById('filter-city').value = ""

    var filterConditionCheckedInputs = document.querySelectorAll("#filter-condition input")
    for (var i = 0; i < filterConditionCheckedInputs.length; i++) {
        filterConditionCheckedInputs[i].checked = false
    }

    doFilterUpdate()
}


/*
 * This function checks to see if a city is included in the collection of all
 * cities for which we have a post.  If it's not, the new city is added to the
 * collection.
 */
function addCityToAllCities(city) {
    /*
     * If city doesn't already exist in the list of cities by which we can
     * filter, add it.
     */
    if (allCities.indexOf(city.toLowerCase()) === -1) {
        allCities.push(city.toLowerCase())
        var newCityOption = createCityOption(city)
        var filterCitySelect = document.getElementById('filter-city')
        filterCitySelect.appendChild(newCityOption)
    }
}


/*
 * This function shows the "sell something" modal by removing the "hidden"
 * class from the modal and backdrop.
 */
function showSellSomethingModal() {
    var showSomethingModal = document.getElementById('sell-something-modal')
    var modalBackdrop = document.getElementById('modal-backdrop')

    showSomethingModal.classList.remove('hidden')
    modalBackdrop.classList.remove('hidden')

}


/*
 * This function clears any user-entered inputs in the "sell something" modal.
 */
function clearSellSomethingModalInputs() {
    var postTextInputElements = [
        document.getElementById('post-text-input'),
        document.getElementById('post-photo-input'),
        document.getElementById('post-price-input'),
        document.getElementById('post-city-input')
    ]


    /*
     * Clear any text entered in the text inputs.
     */
    postTextInputElements.forEach(function (inputElem) {
        inputElem.value = ''
    })

    /*
     * Grab the originally checked radio button and make sure it's checked.
     */
    var checkedPostConditionButton = document.querySelector('#post-condition-fieldset input[checked]')
    checkedPostConditionButton.checked = true
}

function hideSellSomethingModal() {
    var showSomethingModal = document.getElementById('sell-something-modal')
    var modalBackdrop = document.getElementById('modal-backdrop')

    showSomethingModal.classList.add('hidden')
    modalBackdrop.classList.add('hidden')

    clearSellSomethingModalInputs()
}

function hideSellSomethingModal() {
    var showSomethingModal = document.getElementById('sell-something-modal')
    var modalBackdrop = document.getElementById('modal-backdrop')

    showSomethingModal.classList.add('hidden')
    modalBackdrop.classList.add('hidden')

    clearSellSomethingModalInputs()
}
function handleModalAcceptClick() {
    var description = document.getElementById('post-text-input').value.trim()
    var photoURL = document.getElementById('post-photo-input').value.trim()
    var price = document.getElementById('post-price-input').value.trim()
    var city = document.getElementById('post-city-input').value.trim()
    var condition = document.querySelector('#post-condition-fieldset input:checked').value

    if (!description || !photoURL || !price || !city || !condition) {
        alert("You must fill in all of the fields!")
    } else {
        allPosts.push({
            description: description,
            photoURL: photoURL,
            price: price,
            city: city,
            condition: condition
        })
        clearFiltersAndReinsertPosts()
        addCityToAllCities(city)
        hideSellSomethingModal()
    }
}


/*
 * This function creates a new <option> element containing a given city name.
 */
function createCityOption(city) {
    var newCityOption = document.createElement('option')
    newCityOption.textContent = city
    return newCityOption
}


/*
 * A function to apply the current filters to a specific post.  Returns true
 * if the post passes the filters and should be displayed and false otherwise.
 */
function postPassesFilters(post, filters) {
    if (filters.text) {
        var postDescription = post.description.toLowerCase();
        var filterText = filters.text.toLowerCase();
        if (postDescription.indexOf(filterText) === -1) {
            return false;
        }
    }

    if (filters.minPrice) {
        var filterMinPrice = Number(filters.minPrice);
        if (Number(post.price) < filterMinPrice) {
            return false;
        }
    }

    if (filters.maxPrice) {
        var filterMaxPrice = Number(filters.maxPrice);
        if (Number(post.price) > filterMaxPrice) {
            return false;
        }
    }

    if (filters.city) {
        if (post.city.toLowerCase() !== filters.city.toLowerCase()) {
            return false;
        }
    }

    if (filters.conditions && filters.conditions.length > 0) {
        if (filters.conditions.indexOf(post.condition) === -1) {
            return false;
        }
    }

    return true;
}


/*
 * Applies the filters currently entered by the user to the set of all posts.
 * Any post that satisfies the user's filter values will be displayed,
 * including posts that are not currently being displayed because they didn't
 * satisfy an old set of filters.  Posts that don't satisfy the filters are
 * removed from the DOM.
 */
function doFilterUpdate() {
    /*
     * Grab values of filters from user inputs.
     */
    var filters = {
        text: document.getElementById('filter-text').value.trim(),
        minPrice: document.getElementById('filter-min-price').value,
        maxPrice: document.getElementById('filter-max-price').value,
        city: document.getElementById('filter-city').value.trim(),
        conditions: []
    }

    var filterConditionCheckedInputs = document.querySelectorAll("#filter-condition input:checked")
    for (var i = 0; i < filterConditionCheckedInputs.length; i++) {
        filters.conditions.push(filterConditionCheckedInputs[i].value)
    }

    /*
     * Remove all "post" elements from the DOM.
     */
    var postContainer = document.getElementById('posts')
    while(postContainer.lastChild) {
        postContainer.removeChild(postContainer.lastChild)
    }

    /*
     * Loop through the collection of all "post" elements and re-insert ones
     * that meet the current filtering criteria.
     */
    allPosts.forEach(function (post) {
        if (postPassesFilters(post, filters)) {
            insertNewPost(
                post.description,
                post.photoURL,
                post.price,
                post.city,
                post.condition
            )
        }
    })
}


/*
 * This function parses an existing DOM element representing a single post
 * into an object representing that post and returns that object.  The object
 * is structured like this:
 *
 * {
 *   description: "...",
 *   photoURL: "...",
 *   price: ...,
 *   city: "...",
 *   condition: "..."
 * }
 */
function parsePostElem(postElem) {
    var post = {
        price: postElem.getAttribute('data-price'),
        city: postElem.getAttribute('data-city'),
        condition: postElem.getAttribute('data-condition')
    }

    var postImageElem = postElem.querySelector('.post-image-container img')
    post.photoURL = postImageElem.src
    post.description = postImageElem.alt

    return post
}


/*
 * Wait until the DOM content is loaded, and then hook up UI interactions, etc.
 */




window.addEventListener('DOMContentLoaded', function () {



    var nameReturn="";
    var ingredientsReturn=[];

    function getName() {
  return nameReturn;
     }

    function getIngredients() {
    return ingredientsReturn;
 }


    

            

            var myButtons = document.querySelectorAll(".action-button")
            var myPopups = document.querySelectorAll(".popup")
            var closePopups = document.querySelectorAll("#closePopup")
          
            myButtons.forEach(function (button, index) {
              button.addEventListener("click", function () {
                myPopups[index].classList.add("show")
              })
            })
          
            closePopups.forEach(function (closePopup, index) {
              closePopup.addEventListener("click", function () {
                myPopups[index].classList.remove("show")
              })
            })
          
            window.addEventListener("click", function (event) {
              myPopups.forEach(function (popup) {
                if (event.target === popup) {
                  popup.classList.remove("show")
                }
              })
            })







    var addRecipeButton = document.getElementById('addRecipeButton')
    console.log("Got Element: ", addRecipeButton)
    if(addRecipeButton){
        
        addRecipeButton.addEventListener('click', function(){
            var nameInputElem = document.getElementById('post-name-input')
            var ingredientsInputElem = document.getElementById('post-ingredients-input')
            var linkInputElem = document.getElementById('post-link-input')
            var photoURLElem = document.getElementById('post-photo-input')
            
            var nameInput = nameInputElem.value
            var ingredientsInput = ingredientsInputElem.value.split(', ')
            var linkInput = linkInputElem.value
            var photoURLInput = photoURLElem.value
            // console.log("addRecipeClicked")
            // console.log("name: ", nameInput)
            // console.log("ingredients: ", ingredientsInput)
            // console.log("link: ", linkInput)
            // console.log("photo: ", photoURLInput)
            if(!nameInput || !ingredientsInput || !linkInput || !photoURLInput){
                alert("Please fill in all fields!")
            }else{

            fetch("/myPosts/newPost", {
                    method: "POST",
                    body: JSON.stringify({
                    name: nameInput,
                    ingredients: ingredientsInput,
                    link: linkInput,
                    photoURL: photoURLInput,
                    library: ""
                    }),
                    headers: {
                        "Content-Type": "application/json"
                    }
                }).then(function (res) {
                    if (res.status === 200) {
                            console.log("Post Added!")
                            window.location.href = '../myPosts';
                      } else {
                        alert("An error occurred saving post data.")
                      }
                }).catch(function (err) {
                        alert("An error occurred saving the post: " + err)
                })
            }
        });
    }
    
    var currentPath = window.location.pathname;
    console.log("Current path: ",currentPath)
    var navItems = document.querySelectorAll('.navitem');
    console.log(navItems)
    navItems.forEach(function (navItem) {
        // Get the anchor element within the navigation item
        var link = navItem.querySelector('a');
        console.log("Link for ",navItem,": ",link)
  
        // Check if the href attribute of the anchor matches the current path
        if (link.getAttribute('href') === currentPath) {
          // Add a "current" class to the parent navigation item
          navItem.classList.add('current');
        }
      })
    
})
