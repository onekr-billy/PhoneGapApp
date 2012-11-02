<div class="content-primary">
  <div data-role="controlgroup" data-type="horizontal" class="groupbuttonfullwidth">
    <a id="sales" data-theme="e" data-role="button" data-icon="arrow-d" data-mini="true">
      销量
    </a>
    <a id="price" data-theme="e" data-role="button" data-icon="arrow-d" data-mini="true">
      价格
    </a>
    <a id="upTime" data-theme="e" data-role="button" data-icon="arrow-d" data-mini="true">
      上架时间
    </a>
  </div>
  <div class="p10">
  </div>
  <ul id="productlistContent" data-role="listview" data-filter="true" data-filter-placeholder="快速筛选">
  </ul>
  <div class="p10">
  </div>
  <div data-role="controlgroup" data-type="horizontal" data-mini="true" data-theme="c"
      class="page">
    <div id="loading_list"></div>
    <a href="javascript:;" data-role="button" data-icon="arrow-d" data-iconpos="left" id="morePage">
      再显示10条&nbsp;共<label id="totalCount"></label>件商品
    </a>
  </div>
</div>

<script id="productItemTemplate" type="text/template">
  {#foreach $T.list as Puct}
  <li>
    <a href='{$T.Puct.gid}' >
      <img src='{$T.Puct.pic_url}' onerror='this.src="/images/errorImg_small.jpg"' />
      <h3>
        {$T.Puct.title}
      </h3>
      <p>
        价格： <strong class="ui-font-red">￥{$T.Puct.price}</strong>
      </p>
    </a>
  </li>
  {#/for}
</script>