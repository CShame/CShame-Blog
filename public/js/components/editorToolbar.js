/**
 * 编辑框工具栏js
 * */

$('#wmd-bold-button').on('click', function () {
    addContent('**加粗文字**', true, 2,4);
});
$('#wmd-italic-button').on('click', function () {
    addContent('*斜体文字*', true, 1,4);
});

//添加超链接
$('#wmd-link-button').on('click', function () {
    var html = '<input type="text" id="hyperlink" placeholder="请输入链接..." style="width: 100%;">';
    $('.modal').find('.header').html('插入链接');
    $('.modal').find('.content').html('');
    $('.modal').find('.content').append(html);
    $('.ui.modal').modal('show');

    $('#addHyperlink').on('click', function () {
        var text = '[链接描述](';
        text += $('#hyperlink').val();
        text += ')';
        addContent(text, true);
        $("#addHyperlink").unbind('click');
    });
});


//引用
$('#wmd-quote-button').on('click', function () {
    addContent('> 请输入应用内容', true,0,7);
});

//代码块
$('#wmd-code-button').on('click', function () {
    addContent('``` \r\n请输入代码\r\n```', true, 6,5);
});

//图片
$('#wmd-image-button').on('click', function () {
    var html = '<div style="position:relative;"><input type="file" id="editorUpload" accept="image/gif,image/jpeg,image/jpg,image/png" style="width: 100%;background-color: #eee">'
        + '<button class="ui teal button" style="position: absolute;left: 10px;top: 5px;width: 78px;padding: 10px 0;">选择文件</button></div>';
    $('.modal').find('.header').html('插入图片');
    $('.modal').find('.content').html('');
    $('.modal').find('.content').append(html);
    $('.ui.modal').modal('show');

    $('.teal').on('click', function () {
        $('#editorUpload').click();
        $(".teal").unbind('click');
    });

    $('#addHyperlink').on('click', function () {
        uploadPostImg(addContent);
        $("#addHyperlink").unbind('click');
    });
});

//表格
$('#wmd-table-button').on('click', function () {
    var content = `
列1 | 列2 | 列3 
  - | - | -
请输入内容 | 请输入内容 | 请输入内容`;
    addContent(content, true);
});

/**
 * 自动在textarea中添加相应的内容
 * @param {string} data 要加的内容
 * @param {bool} addEnter  是否添加回车
 * @param {int} moveForward 光标向前移动几个位置
 * @param {int} selectedTextLength 选中文本的长度
 * */
function addContent(data, addEnter, moveForward,selectedTextLength) {
    if (addEnter === true) {
        data = '\r\n\r\n' + data;
        data = data + '\r\n\r\n';
    }
    moveForward = moveForward ? moveForward : 0;
    var txtArea = $('#myEditor')[0];
    var content = txtArea.value;
    var start = txtArea.selectionStart; //初始位置
    txtArea.value = content.substring(0, txtArea.selectionStart) + data + content.substring(txtArea.selectionEnd, content.length);
    var position = start + data.length - 6 - moveForward;
    $('#myEditor').focus();
//     setCursorPosition(txtArea, position);
    if(selectedTextLength){
        setTextSelected(txtArea,position-selectedTextLength,position);
    }
}

/**
 * 设置输入域(input/textarea)光标的位置
 * @param {HTMLInputElement/HTMLTextAreaElement} elem
 * @param {Number} index
 */
function setCursorPosition(elem, index) {
    var val = elem.value
    var len = val.length

    // 超过文本长度直接返回
    if (len < index) return
    setTimeout(function () {
        elem.focus();
        if (elem.setSelectionRange) { // 标准浏览器
            elem.setSelectionRange(index, index)
        } else { // IE9-
            var range = elem.createTextRange();
            range.moveStart("character", -len);
            range.moveEnd("character", -len);
            range.moveStart("character", index);
            range.moveEnd("character", 0);
            range.select()
        }
    }, 10)
}

/**
 * 设置文本选中高亮
 * @param {HTMLInputElement/HTMLTextAreaElement} inputDom
 * @param {Number} startIndex 开始位置
 * @param {Number} endIndex 结束位置
 * */
function setTextSelected(inputDom, startIndex, endIndex)
{
    if (inputDom.setSelectionRange)
    {
        inputDom.setSelectionRange(startIndex, endIndex);
    }
    else if (inputDom.createTextRange) //IE
    {
        var range = inputDom.createTextRange();
        range.collapse(true);
        range.moveStart('character', startIndex);
        range.moveEnd('character', endIndex - startIndex-1);
        range.select();
    }
    inputDom.focus();
}

/**
 * 上传图片
 * */
function uploadPostImg(callback) {
    var file = document.getElementById("editorUpload");
    var formData = new FormData();
    formData.append('editorImg',file.files[0]);
    $.ajax({
        url: '/posts/postImgUpload',
        type: 'POST',
        data: formData,
        cache: false,
        contentType: false,
        processData: false,
        success: function(data){
            if(200 === data.code) {
                var text = '![](';
                text += data.data;
                text += ')';
                callback(text,true);
            } else {
                alert("上传失败！");
            }
            console.log('imgUploader upload success',data);
        },
        error: function(){
            alert("与服务器通信发生错误");
        }
    });
}
