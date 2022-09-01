function eat(food){
  let favoriteFoods = ['apple', 'orange'];
  let isFavoriteFood = favoriteFoods.includes(food);
  if(isFavoriteFood){
    console.log('I like ' + food);
  }else{
    console.log('I don‘t like ' + food);
  }
}
