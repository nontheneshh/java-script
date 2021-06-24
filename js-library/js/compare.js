function compare(a, b, type){
  switch (type) {
    case 'number':
      if (+a > +b) return 1;
      else if (+a < +b) return -1;
      else return 0;
    case 'string':
      if (a > b) return 1;
      else if (a < b) return -1;
      else return 0;
    case 'date':
      return new Date(a) - new Date(b);
  }
}
