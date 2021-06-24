class Card {
  constructor(id, visitor, book, borrowDate, returnDate = null) {
    this.id = id;
    this.visitor = visitor;
    this.book = book;
    this.borrowDate = borrowDate;
    if (returnDate != null) {
        this.returnDate = new Date(returnDate);
      }
  }
  setReturnDate(returnDate){
    this.returnDate = returnDate;
  }
}
