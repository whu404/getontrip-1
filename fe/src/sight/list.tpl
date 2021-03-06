<!--
 * @ignore
 * @file list.tpl
 * @author fanyy 
 * @time 16-1-15
-->


<!-- target: returnSightNearbyList --> 
<!-- for: ${list} as ${item} -->
<li class="sight_item" style="background-image: url(${item.image})">
  <a class="sight_link" href="/keyword/guide?id=${item.id}"> 
     <div class="img_mask"></div>
     <div class="title">${item.name}</div>
     <div class="detail">
        <div class="distance"> 
          <i class="location"></i>
          <span class="number">${item.dis}</span>
          <span class="text">${item.dis_unit}</span>
        </div>
        <div class="like"> 
          <span class="number fr">${item.param1}</span> 
          <i class="content fr"></i>
          <i class="ver fr"></i> 
          <span class="number fr">${item.param3}</span> 
          <i class="collect fr"></i>
        </div>
     </div>
  </a>
</li> 
<!-- /for --> 
<!-- /target -->