var HSH = {revision: "0.4.0-alpha", internals:{}, sync: {}};

HSH.check = function(hash){
  return new Promise(function(resolve, reject){
    if (location.hash == `#${hash}`){
      resolve(location.hash);
    }
  });
};

HSH.toRun = [];

HSH.runPerTick = function(toRun){
  HSH.toRun.push(toRun);
};

HSH.internals.checkPerTick = function(){
  for(var i = 0; i < HSH.toRun.length; i++){
    HSH.toRun[i]();
  }
  requestAnimationFrame(HSH.internals.checkPerTick);
};

HSH.when = function(hash, div2show, div2hide, inlineorblock, callback){
  return new Promise(function(resolve, reject){
    if ((div2show || div2hide) === undefined){
      HSH.runPerTick(()=>{
        HSH.check(hash).then((data)=>{
          callback();
        });
      });
    }
    else if ((div2show && div2hide) !== undefined){
      div2show.style.display = inlineorblock;
      div2hide.style.display = "none";
    }
  });
};

document.addEventListener("DOMContentLoaded", ()=>{requestAnimationFrame(HSH.internals.checkPerTick);});