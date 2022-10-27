function zoom(){
  this.curZoom = zoom;
  this.init();

  let ary = [];
  for(let item of this.solLine){
    let obj = _.cloneDeep(item);
    let x = this.curPixel(obj.x - this.gridPadding) + this.gridPadding;
    let y = this.curPixel(obj.y - this.gridPadding) + this.gridPadding;
    console.log(x);
    ary.push({
      dir: obj.dir,
      x,
      y
    });
  }
  this.solLine = ary;
}
