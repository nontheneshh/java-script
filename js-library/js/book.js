class Book{
  constructor(id, title, author, publishingHouse, year, qtLeft, qtPages){
    this.id = id;
    this.title = title;
    this.author = author;
    this.publishingHouse = publishingHouse;
    this.year = year;
    this.qtLeft = qtLeft;
    this.qtPages = qtPages;
  }

  change(title, author, publishingHouse, year, qtLeft, qtPages, coverSrc){
    this.title = title;
    this.author = author;
    this.publishingHouse = publishingHouse;
    this.year = year;
    this.qtLeft = qtLeft;
    this.qtPages = qtPages;
  }
}
