<!--
 * @ignore
 * @file list.tpl
 * @author fanyy 
 * @time 16-1-15
-->


<!-- target: returnSightNearbyList --> 
<!-- for: ${list} as ${item} --> 
<li class="sight_item" style="background-image: url(${item.image}@380h)"  > 
     <div class="img_mask"></div>
     <a class="city" href="/m/city?id=${item.cityid}"><span>${item.cityname}</span></a>
     <a class="sight_link" href="/m/sight?id=${item.id}">
       <div class="title">${item.name}</div>
       <div class="detail">
          <div class="distance"> 
            <i class="location"></i>
            <span class="number">${item.dis}</span>
            <span class="text">${item.dis_unit}</span>
          </div>
          <div class="like">
            <span class="text fr">个内容</span>
            <span class="number fr">${item.contentNum}</span> 
            <i class="content fr"></i>
            <i class="ver fr"></i>
            <span class="text fr">人收藏</span> 
            <span class="number fr">${item.collect}</span> 
            <i class="collect fr"></i>
          </div>
       </div> 
     </a>
</li> 
<!-- /for --> 
<!-- /target -->

<!-- target: returnLandscapeList --> 
<!-- for: ${list} as ${item}, ${key}-->
<!-- if: ${currentPage}==1 && ${key}==0-->
<li class="title-box" style="background-image: url(${item.image})"  href="/m/sight/landscape?id=${item.id}">
      <div class="img_mask"></div>
      <div class="name-box">
        <span class="sight_name">${item.name}</span>
        <!-- <i class="icon_map"></i>
        <a class="tomap">切换地图</a> -->
      </div>
      <div class="desc-box">
         <div class="describe">${item.content}</div>
          <!-- if: ${item.audio}!='' -->
          <div class="radio"  href="/m/sight/landscape?id=${item.id}">
           <div class="time">${item.audio_len}</div>
          </div>
          <!-- /if -->  

      </div>
</li>
<!-- else -->  
<li class="item item_link" href="/m/sight/landscape?id=${item.id}"> 
    <div class="bg_img" style="background-image: url(${item.image}@160h_200w)"></div> 
    <div class="content-box">
      <div class="title">
         <span class="name">${item.name}</span>
         <span class="location"></span>
         <span class="dis">${item.dis}</span>
         <span class="dis_unit">${item.dis_unit}</span>
      </div>
      <div class="content">
        ${item.content}
      </div>
       
    </div> 
    <!-- if: ${item.audio}!='' -->
    <div class="headset-box">
       <div class="headset"></div>
       <div class="time">${item.audio_len}</div>
    </div>
    <!-- /if -->  
</li>
<!-- /if --> 
<!-- /for --> 
<!-- /target -->

<!-- target: returnCityLandscapeList --> 
<!-- if: ${list.landscape_id}==''-->
<li class="title-box" style="background-image: url(${list.image})">
<!-- else -->  
<li class="title-box" style="background-image: url(${list.image})"  href="/m/sight/landscape?id=${list.landscape_id}">
<!-- /if --> 
      <div class="img_mask"></div>
      <div class="name-box">
        <span class="sight_name">${list.name}</span>
        <!-- <i class="icon_map"></i>
        <a class="tomap">切换地图</a> -->
      </div>
      <div class="desc-box">
         <div class="describe">${list.des}</div>
          <!-- if: ${list.audio}!=null && ${list.audio}!=''-->
          <div class="radio"  href="/m/sight/landscape?id=${list.landscape_id}">
           <div class="time">${list.audio_len}</div>
          </div>
          <!-- /if -->  
      </div>
</li> 
<!-- for: ${list.sight} as ${item}, ${key}--> 
  <!-- if: ${item.landscape_id}==''-->
  <li class="item item_link" > 
  <!-- else -->  
  <li class="item item_link" href="/m/sight/landscape?id=${item.landscape_id}"> 
  <!-- /if -->    
      <div class="bg_img" style="background-image: url(${item.image}@160h_200w)"></div> 
      <div class="content-box">
        <div class="title">
           <span class="name">${item.name}</span>
           <span class="location"></span>
           <span class="dis">${item.dis}</span>
           <span class="dis_unit">${item.dis_unit}</span>
        </div>
        <div class="content">
          ${item.content}
        </div>
         
      </div> 
      <!-- if: ${item.audio}!='' -->
      <div class="headset-box">
         <div class="headset"></div>
         <div class="time">${item.audio_len}</div>
      </div>
      <!-- /if -->  
  </li>
 
<!-- /for --> 
<!-- /target -->


<!-- target: returnFoodList --> 
<!-- for: ${list} as ${item} -->
<li class="item item_link" href="/m/sight/food?id=${item.id}">  
    <div class="bg_img" style="background-image: url(${item.image}@168h_200w)"></div> 
    <div class="content-box">
      <div class="title">
         <span class="name">${item.title}</span> 
      </div>
      <div class="content">
        ${item.content}
      </div>
      <div class="title">
         <span class="num">${item.shopNum}</span> 
         <span class="text">个名店推荐，</span> 
         <span class="num">${item.topicNum}</span> 
         <span class="text">个相关话题</span>   
      </div>
    </div>  
</li>
<!-- /for --> 
<!-- /target -->

<!-- target: returnSpecialtyList --> 
<!-- for: ${list} as ${item} -->
<li class="item item_link" href="/m/sight/specialty?id=${item.id}"> 
    <div class="bg_img" style="background-image: url(${item.image}@168h_200w)"></div> 
    <div class="content-box">
      <div class="title">
         <span class="name">${item.title}</span> 
      </div>
      <div class="content">
        ${item.content}
      </div>
      <div class="title">
        <span class="num">${item.productNum}</span> 
         <span class="text">个名品推荐，</span> 
         <span class="num">${item.topicNum}</span> 
         <span class="text">个相关话题</span> 
      </div>
    </div>  
</li>
<!-- /for --> 
<!-- /target -->



<!-- target: returnProductList --> 
<!-- for: ${list} as ${item} --> 
<li class="item item_link"> 
    <div class="bg_img" style="background-image: url(${item.image}@160h_200w)"></div> 
    <div class="content-box">
      <div class="title">
         <span class="shop_name">${item.title}</span> 
      </div> 
      <div class="icon-box">
         <span class="price">¥${item.price}</span>
         <a href="${item.url}" class="buy_link">购买链接</a>
      </div> 
    </div>  
</li>
<!-- /for --> 
<!-- /target -->


<!-- target: returnShopList --> 
<!-- for: ${list} as ${item} -->
<li class="item item_link" href="${item.url}">  
    <div class="bg_img" style="background-image: url(${item.image}@160h_200w)"></div> 
    <div class="content-box">
      <div class="title">
         <span class="shop_name">${item.title}</span> 
      </div>
      <div class="title">
        <!-- for: ${item.star_all} as ${key} -->
          <span class="star_all"></span>  
        <!-- /for --> 
        <!-- if: ${item.star_half}==1 -->
          <span class="star_half"></span>  
        <!-- /if --> 
         <span class="score">${item.score}分</span>
         <span class="price">人均:&nbsp;${item.price}元</span>
      </div>
      <div class="icon-box">
         <span class="address">地址:${item.addr}</span>
      </div> 
    </div>   
</li>
<!-- /for --> 
<!-- /target -->


<!-- target: returnTopicList --> 
<!-- for: ${list} as ${item} -->
<li class="item item_link" href="${item.url}"> 
    <div class="bg_img" style="background-image: url(${item.image}@160h_200w)"></div> 
    <div class="content-box">
      <!-- if: ${item.desc}!='' -->
      <div class="title"> 
         <span class="desc">${item.subtitle}</span> 
      </div> 
      <!-- /if -->   
      <div class="title">
         <span class="topic_name">${item.title}</span> 
      </div> 
      <div class="icon-box">
        <span class="like"></span><span class="num">${item.praise}</span> 
        <span class="view"></span><span class="num">${item.visit}</span>  
      </div> 
    </div>  
</li>
<!-- /for --> 
<!-- /target -->

<!-- target: returnBookList --> 
<!-- for: ${list} as ${item} -->
<li class="item item_link" href="${item.url}"> 
    <div class="bg_img" style="background-image: url(${item.image}@290h_230w)"></div> 
    <div class="content-box">
      <div class="title">
         <span class="name">${item.title}</span> 
      </div> 
      <!-- if: ${item.content_desc}!='' -->
      <div class="content"> 
         ${item.content_desc}
      </div> 
      <!-- /if -->  
      <div class="icon-box">
        <span class="address">${item.author}</span> 
      </div> 
    </div>  
</li>
<!-- /for --> 
<!-- /target -->

<!-- target: returnVideoList --> 
<!-- for: ${list} as ${item} -->
<li class="item item_link" href="${item.url}"> 
    <div class="img_mask"></div>
    <div class="img_bg" style="background-image: url(${item.image}@400h_9r_3s
)"></div>  
      <!-- if: ${item.len}!='' -->
       <div class="len"> 
          ${item.len}
      </div>
      <!-- /if --> 
      <div class="icon-box">
        <div class="title">
           ${item.title}
        </div>
        <div class="button">
           点击观看
        </div>  
      </div>    
</li>
<!-- /for --> 
<!-- /target -->


