$(function () {
    $("#jqGrid").jqGrid({
        url: '/admin/links/list',
        datatype: "json",
        // 模态框的字段
        colModel: [
            {label: 'id', name: 'linkId', index: 'linkId', width: 50, key: true, hidden: true},
            {label: '网站名称', name: 'linkName', index: 'linkName', width: 100},
            {label: '网站链接', name: 'linkUrl', index: 'linkUrl', width: 120},
            {label: '网站描述', name: 'linkDescription', index: 'linkDescription', width: 120},
            {label: '排序值', name: 'linkRank', index: 'linkRank', width: 30},
            {label: '添加时间', name: 'createTime', index: 'createTime', width: 100}
        ],
        height: 560,
        rowNum: 10,
        rowList: [10, 20, 50], // 每页可显示数量的选项
        styleUI: 'Bootstrap',
        loadtext: '信息读取中...',
        rownumbers: false,
        rownumWidth: 20,
        autowidth: true,
        multiselect: true,
        pager: "#jqGridPager",
        jsonReader: {
            root: "data.list",
            page: "data.currPage",
            total: "data.totalPage",
            records: "data.totalCount"
        },
        prmNames: {
            page: "page",
            rows: "limit",
            order: "order",
        },
        gridComplete: function () {
            //隐藏grid底部滚动条
            $("#jqGrid").closest(".ui-jqgrid-bdiv").css({"overflow-x": "hidden"});
        }
    });
    $(window).resize(function () {
        $("#jqGrid").setGridWidth($(".card-body").width());
    });
});

/**
 * jqGrid重新加载
 */
function reload() {
    var page = $("#jqGrid").jqGrid('getGridParam', 'page');
    $("#jqGrid").jqGrid('setGridParam', {
        page: page
    }).trigger("reloadGrid");
}

function linkAdd() {
    reset();
    $('.modal-title').html('友链添加');
    $('#linkModal').modal('show');
}

//绑定modal上的保存按钮
$('#saveButton').click(function () {
    // 拿到模态框中填写/修改的信息
    var linkId = $("#linkId").val();
    var linkName = $("#linkName").val();
    var linkUrl = $("#linkUrl").val();
    var linkDescription = $("#linkDescription").val();
    var linkRank = $("#linkRank").val();
    // 校验信息
    if (!validCN_ENString2_18(linkName)) {
        $('#edit-error-msg').css("display", "block");
        $('#edit-error-msg').html("请输入符合规范的名称！");
        return;
    }
    if (!isURL(linkUrl)) {
        $('#edit-error-msg').css("display", "block");
        $('#edit-error-msg').html("请输入符合规范的网址！");
        return;
    }
    if (!validCN_ENString2_100(linkDescription)) {
        $('#edit-error-msg').css("display", "block");
        $('#edit-error-msg').html("请输入符合规范的描述！");
        return;
    }
    if (isNull(linkRank) || linkRank < 0) {
        $('#edit-error-msg').css("display", "block");
        $('#edit-error-msg').html("请输入符合规范的排序值！");
        return;
    }
    // 将填写的参数序列化，发到后台
    var params = $("#linkForm").serialize();
    var url = '/admin/links/save';
    if (linkId != null && linkId > 0) {
        url = '/admin/links/update'; // 更新
    }
    $.ajax({
        type: 'POST',//方法类型
        url: url,
        data: params,
        success: function (result) {
            if (result.resultCode == 200 && result.data) { // 此处的result.data是一个Boolean值
                $('#linkModal').modal('hide'); // 收起模态框
                swal("保存成功", { // 弹出提示框
                    icon: "success",
                });
                reload(); // 刷新列表
            } else {
                $('#linkModal').modal('hide');
                swal("保存失败", {
                    icon: "error",
                });
            }
            ;
        },
        error: function () {
            swal("操作失败", {
                icon: "error",
            });
        }
    });

});

// 修改
function linkEdit() {
    var id = getSelectedRow(); // 拿到选中的行
    if (id == null) {
        return;
    }
    reset();
    // 请求数据
    $.get("/admin/links/info/" + id, function (resp) {
        if (r.resultCode == 200 && resp.data != null) {
            // 填充数据至modal(模态框)
            $("#linkName").val(resp.data.linkName);
            $("#linkUrl").val(resp.data.linkUrl);
            $("#linkDescription").val(resp.data.linkDescription);
            $("#linkRank").val(resp.data.linkRank);
            // 根据原linkType值设置select选择器为选中状态
            if (resp.data.linkType == 1) {
                $("#linkType option:eq(1)").prop("selected", 'selected');
            }
            if (resp.data.linkType == 2) {
                $("#linkType option:eq(2)").prop("selected", 'selected');
            }
        }
    });
    $('.modal-title').html('友链修改');
    $('#linkModal').modal('show'); // 数据组织完后，显示模态框
    $("#linkId").val(id); // 将id放入隐藏的input标签中
}

// 删除blogLinks
function deleteLink() {
    var ids = getSelectedRows(); // 拿到选中的blogLinks
    if (ids == null) {
        return;
    }
    swal({
        title: "确认弹框",
        text: "确认要删除数据吗?",
        icon: "warning",
        buttons: true,
        dangerMode: true,
    }).then((flag) => { // 点击确定按钮后发送删除请求
            if (flag) {
                $.ajax({
                    type: "POST",
                    url: "/admin/links/delete",
                    contentType: "application/json",
                    data: JSON.stringify(ids),
                    success: function (r) {
                        if (r.resultCode == 200) {
                            swal("删除成功", {
                                icon: "success",
                            });
                            $("#jqGrid").trigger("reloadGrid");// 删除成功后重新刷新列表
                        } else {
                            swal(r.message, {
                                icon: "error",
                            });
                        }
                    }
                });
            }
        }
    );
}

// 初始化模态框数据
function reset() {
    $("#linkName").val('');
    $("#linkUrl").val('');
    $("#linkDescription").val('');
    $("#linkRank").val(0);
    $('#edit-error-msg').css("display", "none");
    $("#linkType option:first").prop("selected", 'selected');
}