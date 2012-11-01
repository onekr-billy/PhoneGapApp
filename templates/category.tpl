
<div class="loading_list"></div>

<div id="categoryList" class="content-primary">
</div>    
<ul id="sub_categoryList" data-role="listview" data-inset="true" data-theme="c" data-divider-theme="c">
</ul>

<script id="categoryList_template" type="text/template">
    {#for index=1 to $T.length}
    {#if $T.index==1}
        <div data-role="collapsible" data-theme="e" data-collapsed="false">
    {#else}
        <div data-role="collapsible" data-theme="e" data-collapsed="true">
    {#/if}
    {#param name=dr value=$T[$T.index-1]}
        <h3>{$P.dr.name}</h3>
        <ul data-role="listview">
            {#foreach $P.dr.child as drC}
            <li><a class="SubZC" data-id="{$T.drC.id}" href="javascript:void(null);" >{$T.drC.name}</a></li>
            {#/for}
        </ul>
    </div>

</script>

<script id="sub_category_template" type="text/template">
    <li data-role="list-divider">{$T.name}</li>
    {#foreach $T as drCC}
    <li><a class="cidA" href="javascript:void(0);" data-id="{$T.drCC.id}" >{$T.drCC.name}</a>
    </li>
    {#/for}
</script>