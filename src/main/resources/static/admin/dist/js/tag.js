$(function () {
    $("#jqGrid").jqGrid({
        url: '/admin/tags/list',
        datatype: "json",
        colModel: [
            {label: 'id', name: 'tagId', index: 'tagId', width: 50, key: true, hidden: true},
            {label: '标签名称', name: 'tagName', index: 'tagName', width: 240},
            {label: '添加时间', name: 'createTime', index: 'createTime', width: 120}
        ],
        height: 560,
        rowNum: 10,
        rowList: [10, 20, 50],
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

// 增加tag
function tagAdd() {
    var tagName = $("#tagName").val();
    if (!validCN_ENString2_18(tagName)) {
        swal("标签名称不规范", {
            icon: "error",
        });
    } else {
        var url = '/admin/tags/save?tagName=' + tagName;
        $.ajax({
            type: 'POST',//方法类型
            url: url,
            success: function (result) {
                // 保存成功
                if (result.resultCode == 200) {
                    $("#tagName").val('') // 清空输入框
                    swal("保存成功", { // 弹出提示框
                        icon: "success",
                    });
                    reload(); // 重新加载列表
                }
                else { // 保存失败
                    $("#tagName").val('')
                    swal(result.message, {
                        icon: "error",
                    });
                };
            },
            error: function () {
                swal("操作失败", {
                    icon: "error",
                });
            }
        });
    }
}

// 删除标签
function deleteTag() {
    var ids = getSelectedRows(); // 选中的标签ids
    if (ids == null) {
        return;
    }
    swal({ // 确认弹框
        title: "确认弹框",
        text: "确认要删除数据吗?",
        icon: "warning",
        buttons: true,
        dangerMode: true,
    }).then((flag) => {
            if (flag) { // 点击确定后
                $.ajax({
                    type: "POST",
                    url: "/admin/tags/delete",
                    contentType: "application/json", // 接收返回值的类型
                    data: JSON.stringify(ids), // 将ids(数组)转成json数据发送
                    success: function (resp) {
                        if (resp.resultCode == 200) {
                            swal("删除成功", {
                                icon: "success",
                            });
                            $("#jqGrid").trigger("reloadGrid"); // 刷新列表
                        } else {
                            swal(resp.message, {
                                icon: "error",
                            });
                        }
                    }
                });
            }
        }
    );
}
