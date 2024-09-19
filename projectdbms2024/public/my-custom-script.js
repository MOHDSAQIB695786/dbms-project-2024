// Get all the add to cart buttons
const addToCartButtons = document.querySelectorAll('.flashmsg');

// Get the cart message element
const cartMessage = document.getElementById('cartMessage');

// Loop over each button
addToCartButtons.forEach((button) => {
    // Add a click event listener to the button
    button.addEventListener('click', () => {
        // Show the cart message
        cartMessage.style.display = 'block';
       


        // Hide the cart message after 2 seconds
        setTimeout(() => {
            cartMessage.style.display = 'none';
      

        }, 500);
    });
});
