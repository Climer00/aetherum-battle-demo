(function(){
function fix(k,pairs){
  var s=window.AETHERUM_SPRITES&&window.AETHERUM_SPRITES[k];
  if(!s)return;
  pairs.forEach(function(p){s=s.split(p[0]).join(p[1]);});
  window.AETHERUM_SPRITES[k]=s;
}
fix('chip_windup',[['eTs6XBgUH5','eTs6XGgUH5'],['0bPFrWoiTCB','0bPFrWsoiTCB']]);
fix('chip_shove',[['vjgSrAq','vjgQrAq'],['nfbs5rYT','nfbs7rYT']]);
})();
