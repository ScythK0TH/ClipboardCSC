const body = document.querySelector('body');
const title = document.querySelectorAll('#title-back');
const placeholder = document.querySelectorAll('.placeholdercolor');
const btn = document.querySelector('.theme_container');
const icon = document.querySelector('.theme_icon');

//to save the dark mode use the object "local storage".

//function that stores the value true if the dark mode is activated or false if it's not.
function store(value){
  localStorage.setItem('darkmode', value);
}

//function that indicates if the "darkmode" property exists. It loads the page as we had left it.
function load(){
  const darkmode = localStorage.getItem('darkmode');

  //if the dark mode was never activated
  if(!darkmode){
    store(false);
    icon.classList.add('fa-sun');
  } else if( darkmode == 'true'){ //if the dark mode is activated
    body.classList.add('darkmode');
    for(let i = 0; i < title.length; i++){
      title[i].classList.add('darkmode');
    }
    for(let i = 0; i < placeholder.length; i++){
      placeholder[i].classList.add('darkmode');
    }
    icon.classList.add('fa-moon');
  } else if(darkmode == 'false'){ //if the dark mode exists but is disabled
    icon.classList.add('fa-sun');
  }
}


load();

btn.addEventListener('click', () => {

  body.classList.toggle('darkmode');
  for(let i = 0; i < title.length; i++){
    title[i].classList.toggle('darkmode');
  }
  for(let i = 0; i < placeholder.length; i++){
    placeholder[i].classList.toggle('darkmode');
  }
  icon.classList.add('animated');

  //save true or false
  store(body.classList.contains('darkmode'));

  if(body.classList.contains('darkmode')){
    icon.classList.remove('fa-sun');
    icon.classList.add('fa-moon');
  }else{
    icon.classList.remove('fa-moon');
    icon.classList.add('fa-sun');
  }

  setTimeout( () => {
    icon.classList.remove('animated');
  }, 500)
})