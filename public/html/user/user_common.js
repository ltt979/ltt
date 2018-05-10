function initPage(type_one) {
    $.ajax({
        url: "/pc/getProductTotalCount",
        type: 'post',
        dataType: 'json',
        data: {pageSize: 10, type_one: type_one},
        success: function (data) {
            var totalPages = data.pageCount;
            var options = {
                bootstrapMajorVersion: 3,
                currentPage: 1,
                totalPages: totalPages || 1,
                onPageClicked: function (e, originalEvent, type, page) {
                    $.ajax({
                        url: "/pc/getProductPage",
                        data: {currentPage: page, pageSize: 10, type_one: type_one},
                        dataType: 'json',
                        type: "post",
                        success: function (data) {
                            // console.log(data.resources);
                            var $container = $("#detail_block_list");
                            $container.empty();
                            $("#resource_detail_tmpl").tmpl(data.resources).appendTo($container);
                        }
                    })
                }
            }
            $('#pager').bootstrapPaginator(options);
            $('#pager').find("li a:first-child").click();
        }
    });
}



$(document).on('click', ".detail-control button.add", function (e) {
    var courseID = $(e.target).data('id');
    if (!courseID) {
        alert("请选择需要添加的课程");
        return false;
    }
    $.ajax({
        url: '/pc/addcourse',
        data: {courseID: courseID},
        dataType: 'json',
        type: "post",
        success: function (data) {
            $("#myModal .modal-body").html(data.msg);
            $("#myModal").modal();
            debugger;
            if (data.success) {
                $(e.target).removeClass("add").addClass("del").html("立即移除");
            }
        }
    });
});
$(document).on('click', ".detail-control button.del", function (e) {
    var courseID = $(e.target).data('id');
    if (!courseID) {
        alert("请选择需要移除的课程");
        return false;
    }
    $.ajax({
        url: '/pc/delcourseAjax',
        data: {courseID: courseID},
        dataType: 'json',
        type: "post",
        success: function (data) {
            $("#myModal .modal-body").html(data.msg);
            $("#myModal").modal();
            if (data.success) {
                debugger;
                $(e.target).removeClass("del").addClass("add").html("立即添加");
            }
        }
    });
});