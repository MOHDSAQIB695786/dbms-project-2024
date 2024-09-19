
function handleLogin(event) {
  event.preventDefault();
  const form = event.target;
  const data = new FormData(form);
  
  fetch('/login', {
    method: 'POST',
    body: data
  })
  .then(response => response.text())
  .then(text => {
    // Handle the response text, e.g., display a message or redirect
    console.log(text);
  })
  .catch(error => console.error('Error:', error));
}

