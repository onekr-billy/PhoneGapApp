<form action="" id="search-form">
    <fieldset data-role="controlgroup" data-mini="true">
        <label for="searchinput1">
        </label>
        <input id="searchinput1" placeholder="商品搜索" value="奶粉" type="search" />
    </fieldset>
</form>
<div class="content-primary">
    <div class="camera_wrap camera_azure_skin" id="foucsPic">
    </div>
    <!-- #foucs -->
    <!-- #camera_wrap_1 -->
    <ul data-role="listview" data-inset="true" data-theme="c" id="columnlistContent">
    </ul>
    <ul data-role="listview" data-inset="true" data-dividertheme="d" id="noticelistContent">
    </ul>
    <script id="columnlist_jTemplate" type="text/template">
        {#foreach $T.list as col}
        <li><a href="{$T.col.id}">{$T.col.title}</a></li>
        {#/for}
    </script>
    <script id="notice_jTemplate" type="text/template">
        <li data-role="list-divider">公告</li>
        {#foreach $T.list as notice}
        <li><a href="#notice/{$T.notice.id}">{$T.notice.title}</a></li>
        {#/for}
    </script>
</div>