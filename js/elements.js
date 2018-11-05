/*
 * Powered by Ahmed Elkadrey <www.codesgit.com>
 * v2.0.1 via Bootstrap 3.1.1
 * 2014-05-09
 */
String.prototype.trim = function()
{
    return this.replace(/(^\s*)|(\s*$)/g, "");
}

function trim(text)
{
    return text.replace(/(^\s*)/g, "");
}

String.prototype.lTrim = function()
{
    return this.replace(/(^\s*)/g, "");
}

String.prototype.rTrim = function()
{
    return this.replace(/(\s*$)/g, "");
}

String.prototype.trimAll = function()
{
    return this.replace(/(\s*)/g, "");
}
jQuery.fn.insert = function(text, text2)
{    
    var me = this;
    if(!text) return me;
    if(!text2) text2 = "";    
    switch(jQuery(me).prop("tagName"))
    {                
         case 'INPUT':
         case 'TEXTAREA':
             switch(jQuery(me).prop("type"))
             {
                 case 'text':
                 case 'textarea':
                 case 'password':
                 case 'file':
                 case 'select':
                     var theValue = "";
                     
                     if(jQuery(me).prop("selectionStart") == jQuery(me).prop("selectionEnd") && jQuery(me).prop("selectionStart") > 0)
                     {
                         theValue = jQuery(me).val().substr(0, jQuery(me).prop("selectionStart"));
                         theValue += text+text2;
                         theValue += jQuery(me).val().substr(jQuery(me).prop("selectionStart"), (jQuery(me).val()).length);
                     }
                     else if(jQuery(me).prop("selectionStart") < jQuery(me).prop("selectionEnd") && jQuery(me).prop("selectionEnd") > 0)
                     {
                         var selectionText = jQuery(me).val().substr(jQuery(me).prop("selectionStart"), jQuery(me).prop("selectionEnd"));                         
                         theValue = text + selectionText + text2;
                     }
                     else
                     {
                         theValue = jQuery(me).val() + text+text2;
                     }
                     
                     jQuery(me).val(theValue);
                 break;
             }

         break;     
    }
    return me;       
}


jQuery.fn.clear = function()
{
    var me = this;
   switch(jQuery(me).prop("tagName"))
   {        
        case 'SELECT':
            jQuery(me).find('option, optgroup').each(function()
            {
                jQuery(this).remove();
            });
        break;
        case 'A':
            jQuery(me).attr('href', "");
        break;
        case 'IMG':
        case 'IMAGE':
        case 'IFRAME':
            jQuery(me).attr('src', "");
        break;
        case 'FORM':
            jQuery(me).html('');
        break;        
   }
   
   return me;
}

jQuery.fn.empty = function()
{
   var me = this;
   switch(jQuery(me).prop("tagName"))
   {        
        case 'SELECT':
        case 'INPUT':
        case 'TEXTAREA':
            switch(this.type)
            {
                case 'checkbox':
                case 'radio':
                    jQuery(me).prop('checked', false);
                break;
                case 'text':
                case 'textarea':
                case 'password':
                case 'file':
                case 'select':
                default:
                    jQuery(me).val('');
            }
            
        break; 
        case 'DIV':
        case 'A':
        case 'SPAN':
        case 'LABEL':
        case 'B':
        case 'I':
        case 'LI':
        case 'UL':
        case 'TD':
        case 'TR':
        case 'H1':
        case 'H2':
        case 'H3':
        case 'H4':
        case 'H5':
            jQuery(me).html('');
        break;
        case 'FORM':
            jQuery(me).find("textarea, input[type=file],input[type=text], input[type=password]").val('');
            jQuery(me).find("select").val('');
            jQuery(me).find("input[type=checkbox]").attr('checked', false);
        break;
   }
   return me;
}

jQuery.fn.int = function()
{
    jQuery(this).each(function()
    {
        var me = this;
        if(jQuery(me).val() != null && jQuery(me).val() != undefined && !jQuery(me).attr('fertilize'))
        {
            jQuery(me).focus(function()
            {
                if(jQuery(this).val() == 0) jQuery(this).val("");
                else jQuery(this).select();
            }).keydown(function(e)
            {        
                if((e.keyCode <= 105 && e.keyCode >= 96) || (e.keyCode <= 57 && e.keyCode >= 48) || outKeys(e.keyCode)) return true;
                else return false;
            }).blur(function()
            {
                if(this.value == "") this.value = "0";
            });        
            var theval = jQuery(me).val() != "" ? parseInt(jQuery(me).val()) : 0;
            if(theval == NaN || !theval) theval = 0;
            jQuery(me).attr('fertilize', 'done').val(theval);
        } 
    });
    return this;
}

jQuery.fn.float = function(limits)
{
    if(!limits || parseInt(limits) == "") limits = 2;
    jQuery(this).each(function()
    {
        var me = this;
        if(jQuery(me).val() != null && jQuery(me).val() != undefined && !jQuery(me).attr('fertilize'))
        {
            jQuery(me).focus(function()
            {
                jQuery(me).checkField(false);
            }).keydown(function(e)
            {       
                if((e.keyCode <= 105 && e.keyCode >= 96) || (e.keyCode <= 57 && e.keyCode >= 48) || (e.keyCode == 110 || e.keyCode == 190) || outKeys(e.keyCode)) 
                {
                    var chk = (jQuery(me).val()).split(".");
                    var point = (chk[0]).length + 1;
                    var currentPoint = jQuery(me).prop("selectionStart");                    
                    if(currentPoint > point && (chk[1]).length >= limits && !outKeys(e.keyCode)) return false;
                    else return true;
                }
                else return false;
            }).blur(function()
            {
                jQuery(me).checkField(true);
            }).map(function()
            {                
                jQuery(me).attr('fertilize', 'done');
            });
            
            jQuery.fn.checkField = function(bluring)
            {
                var me = this;
                var theVal = jQuery(me).val();
                if(theVal == "") 
                {
                    jQuery(me).val((bluring ? "0" : "") + "." + repeat("0", limits));
                    jQuery(me).focusOn(0);
                }
                else
                {
                    var chk = theVal.split(".");
                    if((chk[0]).length == 0 && bluring) 
                    {
                        chk[0] = "0";
                    }
                        
                    if(chk.length <= 1) jQuery(me).val(parseInt(chk[0]) + "." + repeat("0", limits));
                    else
                    {                        
                        if((chk[1]).length > limits)
                        {
                            chk[1] = (chk[1]).substr(0, limits);
                        }
                        else if((chk[1]).length < limits)
                        {                            
                            chk[1] += repeat("0", limits, (chk[1]).length + 1);
                        }
                        
                        theVal = parseInt(chk[0]) + '.' + chk[1];                        
                        jQuery(me).val(theVal);
                    }
                }
                
            }
            jQuery(me).checkField(true);
        }
    });
    return this;
}

jQuery.fn.selectRange = function(startFrom, length)
{
    startFrom = parseInt(startFrom);
    length = parseInt(length);
    if(startFrom == NaN) startFrom = 0;
    if(length == NaN) length = startFrom;
    
    jQuery(this).prop("selectionStart", startFrom).prop("selectionEnd", length + startFrom).focus();
}

if (!Object.keys) 
{
  Object.keys = function(obj) 
  {
    var keys = [];

    for (var i in obj) 
    {
        if (obj.hasOwnProperty(i)) 
        {
          keys.push(i);
        }
    }
    return keys;
  };
}

jQuery.fn.enableTab = function()
{
    jQuery(this).each(function()
    {
        jQuery(this).keydown(function(e)
        {
            if(e.keyCode == 9 || e.key == "Tab")
            {
                jQuery(this).insert("\t");
                return false;
            }
        });
    });
}

jQuery.fn.getVal = function()
{
    var val = '';
    $(this).each(function()
    {        
        switch((this.tagName).toLowerCase())
        {
            case 'input':
            case 'select':
            case 'textarea':                
                switch((this.type).toLowerCase())
                {
                    case 'select':                          
                    case 'hidden':                          
                    case 'text':
                    case 'textarea':
                    case 'password':                    
                    case 'button':                        
                    case 'submit': 
                    default :
                        if(val == '') val = $(this).val();
                    break;
                    case 'radio':
                    case 'checkbox':
                        if($(this).prop('checked') == true) 
                        {
                            if(val == '') val = $(this).val();
                        }
                        else if((this.type).toLowerCase() == 'checkbox') if(val == '') val = false;
                    break;                     
                }
            break;            
            default:
                if(val == '') val = $(this).html();
        }
    });  
    return val;
}

$.fn.showErr = function(msgError, lockClose)
{
    $(this).prepend('<div class="alert alert-danger fade in">' + msgError + (lockClose ? '' : '<button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button>') + '</div>');
}

$.fn.msgBox = function(title, message, obj)
{
    $(this).click(function()
    {            
            var dontClose = false;
            var avoidOnClose = false;
            var html = '';
            if(!obj) obj = {};
            $("#msgbox").remove();
            html += '<div class="modal fade" id="msgbox" tabindex="-1" role="dialog" aria-labelledby="msgBoxLabel" aria-hidden="true">';
            html += '<div class="modal-dialog"><div class="modal-content"><div class="modal-header">';
            html += '<h4 class="modal-title" id="msgBoxLabel">' + title + '</h4>';
            html += '</div><div class="modal-body">';
            html += message;
            html += '</div><div class="modal-footer">';

            switch(obj.type)
            {
                case 'ok':
                        html += '<button type="submit" id="msgBoxYes" data-loading-text="Loading..." class="btn btn-primary">OK</button>';
                    break;
                case 'okCancel':
                        html += '<button type="submit" id="msgBoxYes" data-loading-text="Loading..." class="btn btn-primary">OK</button>';
                        html += '<button type="submit" id="msgBoxNo" data-loading-text="Loading..." class="btn btn-default">Cancel</button>';
                    break;
                case 'yesNo':
                case '':
                case null:
                case undefined:
                    html += '<button type="submit" id="msgBoxYes" data-loading-text="Loading..." class="btn btn-primary">Yes</button>';
                    html += '<button type="submit" id="msgBoxNo" data-loading-text="Loading..." class="btn btn-default">No</button>';                        
            }


            html += '</div></div></div></div>';

            $("body").append(html).find('#msgbox').modal('show');
            
            if($("#msgBoxYes").length > 0) $("#msgBoxYes").click(function()
            {
                if(obj.onYes) 
                {
                    $(this).button('loading');
                    $("#msgBoxNo").prop('disabled', true);
                    $("#msgbox").find('.modal-body').addClass('loadingBar').html('&nbsp;');
                    dontClose = true;
                    obj.onYes(function()
                    {
                        avoidOnClose = true;
                        dontClose = false;
                        $('#msgbox').modal('hide');
                    });
                    return false;
                }                
                else $('#msgbox').modal('hide');                
            });
            
            $("#msgBoxNo").click(function()
            {
                $('#msgbox').modal('hide');
            });
            $('#msgbox').on('hidden.bs.modal', function() 
            {
                if(!dontClose) $('#msgbox').remove();
                if(obj.onClose && !avoidOnClose) obj.onClose();
            }).on('hide.bs.modal', function() 
            {
                if(dontClose) return false;                
            });
    });
}

$.postFrame = function(url, param, callBack)
{
    $("#hiddenPostFrame, #hiddenPostFrameForm").remove();
    var html = '<form action="' + url + '" id="hiddenPostFrameForm" target="hiddenPostFrame" method="post">';
    var dataAr = param.split("&");
    for(var parm in dataAr)
    {
        var parms = (dataAr[parm]).split("=");
        html += '<input type="hidden" name="' + parms[0] + '" value="'+parms[1]+'" />';
    }
    html += '</form>';// style="display: none;"
    html += '<iframe id="hiddenPostFrame" src="" name="hiddenPostFrame"></iframe>';
    $("body").append(html);
    if(callBack)
    {
        $("#hiddenPostFrame").bind('load', function()
        {
            callBack($(this).contents());
        });
    }
    $("#hiddenPostFrameForm").submit();
}
