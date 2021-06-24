const url = 'http://www.omdbapi.com/?apikey=32cd6fc';
const wrap = document.getElementById('wrap');
const pages = document.getElementById('pages');
const qtItemsOnPage = 10;
let title;
let type;
let qtPages = 0;
let selectedPage;

pages.onclick = renderPages;

document.forms.searchingForm.btnSearch.onclick = (e) => {
  title = document.forms.searchingForm.title.value;
  type = document.forms.searchingForm.type.value;

  fetch(`${url}&s=${title}&type=${type}`)
    .then(response => response.json())
    .then(json => {
      qtPages = Math.trunc(json.totalResults / qtItemsOnPage);
      if (qtPages == 0) qtPages = 1;
      if (json.Response == 'False'){
        renderMessageInWrap(json.Error);
      }
      else{
        selectedPage = 1;
        renderItems(json);
        renderPages();
      }
     });
}

function renderMessageInWrap(message){
  wrap.innerHTML = `<h2>${message}</h2>`;
}

function renderItems(jsonResult){
  wrap.innerHTML = '';
  for (let el of jsonResult.Search) {
    let item = document.createElement('div');
    item.className = 'item';
    item.innerHTML = `
    <h2>${el.Title}</h2>
    <div>${el.Year}</div>
    <div>${el.Type}</div>
    <img src="${el.Poster}" alt=${el.Title}></img>
    <button onclick="loadMoreInfo(event, '${el.imdbID}');" type="button">more</button>
    `;
    wrap.append(item);
  }
}

function loadMoreInfo(e, id){
 fetch(`${url}&i=${id}&plot=full`)
   .then(response => response.json())
   .then(json => showMoreInfo(json, e.target));
}

function showMoreInfo(info, bt){
  let infoItem = document.createElement('div');
  infoItem.className = 'info-item';
 // for(let i in info) console.log('obj[' + i + '] = ' + info[i]);

  infoItem.innerHTML = `
    <h3>Rated</h3>
    <div>${info.Rated}</div>
    <h3>Released</h3>
    <div>${info.Released}</div>
    <h3>Runtime</h3>
    <div>${info.Runtime}</div>
    <h3>Genre</h3>
    <div>${info.Genre}</div>
    <h3>Director</h3>
    <div>${info.Director}</div>
    <h3>Writer</h3>
    <div>${info.Writer}</div>
    <h3>Actors</h3>
    <div>${info.Actors}</div>
    <h3>Plot</h3>
    <div>${info.Plot}</div>
    <h3>Language</h3>
    <div>${info.Language}</div>
    <h3>Country</h3>
    <div>${info.Country}</div>
    <h3>Awards</h3>
    <div>${info.Awards}</div>
  `;
  bt.style.display = 'none';

  let btn = document.createElement('button');
  btn.innerText = 'less';
  btn.onclick = showLessInfo;
  infoItem.appendChild(btn);

  bt.closest('.item').appendChild(infoItem);
}

function showLessInfo(e) {
  let btn = e.target;
  let infoItem = btn.closest('.info-item');
  infoItem.closest('.item').scrollIntoView( {behavior: 'smooth'});
  btn.closest('.item').querySelector('button').style.display = 'block';
  infoItem.remove();
}

function loadPage(){
  renderMessageInWrap('LOADING...');

  fetch(`${url}&s=${title}&type=${type}&page=${selectedPage}`)
    .then(response => response.json())
    .then(json => {
       renderItems(json);
       wrap.querySelector('h2').remove();
     });
}

function renderPages() {
  pages.innerHTML = '';
  if (qtPages == 1) return;
  if (selectedPage < 1) selectedPage = 1;
  if (selectedPage > qtPages) selectedPage = qtPages;

  let to = selectedPage + 3;
  let from = selectedPage - 2;

  if (to > qtPages) to = qtPages;
  if (from < 1) from = 1;

  setBtnsBack();

  for (let i = from; i <= to; i++){
    let page = document.createElement('div');
    page.innerText = i;

    if (i == selectedPage) page.className = 'selected-page';

    page.onclick = function(e){
      let clickedPage = e.target;
      selectedPage = +clickedPage.innerText;
      clickedPage.className = 'selectedPage';
      loadPage();
    }
    pages.appendChild(page);
  }
  setBtnsForward();
}

function setBtnsBack(){
  if (selectedPage == 1) return;
  let toBegining = document.createElement('div');
  toBegining.innerText = '<<';
  pages.appendChild(toBegining);
  toBegining.onclick = (e) => {selectedPage = 1; renderPages(); loadPage()};

  let onePageBack = document.createElement('div');
  onePageBack.innerText = '<';
  pages.appendChild(onePageBack);
  onePageBack.onclick = (e) => {selectedPage--; renderPages(); loadPage()};
}

function setBtnsForward(){
  if (selectedPage >= qtPages) return;

  let onePageForward = document.createElement('div');
  onePageForward.innerText = '>';
  onePageForward.onclick = (e) => {selectedPage++; renderPages(); loadPage()}
  pages.appendChild(onePageForward);

  let toEnding = document.createElement('div');
  toEnding.innerText = '>>';
  toEnding.onclick = (e) => {selectedPage = qtPages; renderPages(); loadPage()};
  pages.appendChild(toEnding);
}
